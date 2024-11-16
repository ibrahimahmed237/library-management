const { Op } = require("sequelize");
const sequelize = require("sequelize");
const Book = require("../../books/models/Book.js");
const Borrowing = require("../../borrowing/models/BorrowingHistory.js");
const Borrower = require("../../borrowers/models/Borrower.js");
const appError = require("../../../shared/utils/appError.js");
const {
  startOfMonth,
  endOfMonth,
  subMonths,
  subDays,
} = require("date-fns");

class StatisticsService {
  async getStatistics(borrower_id = null) {
    const whereClause = borrower_id ? { borrower_id } : {};
    const today = new Date();
    const thirtyDaysAgo = subDays(today, 30);

    try {
      // Basic Statistics
      const [
        totalBorrowings,
        activeBorrowings,
        overdueBorrowings,
        borrowingsLast30Days,
        returnsLast30Days,
      ] = await Promise.all([
        Borrowing.count({ where: whereClause }),
        Borrowing.count({
          where: {
            ...whereClause,
            is_returned: false,
          },
        }),
        Borrowing.count({
          where: {
            ...whereClause,
            return_date: { [Op.lt]: new Date() },
            is_returned: false,
          },
        }),
        Borrowing.count({
          where: {
            ...whereClause,
            checkout_date: { [Op.between]: [thirtyDaysAgo, today] },
          },
        }),
        Borrowing.count({
          where: {
            ...whereClause,
            returned_date: { [Op.between]: [thirtyDaysAgo, today] },
            is_returned: true,
          },
        }),
      ]);

      // Advanced Statistics
      const [
        averageBorrowDuration,
        mostBorrowedBooks,
        borrowingTrends,
        topBorrowers,
        returnRateStats,
        overdueAnalysis,
      ] = await Promise.all([
        this.calculateAverageBorrowDuration(whereClause),
        this.getMostBorrowedBooks(whereClause),
        this.getBorrowingTrends(whereClause),
        this.getTopBorrowers(whereClause),
        this.getReturnRateStats(whereClause),
        this.getOverdueAnalysis(whereClause),
      ]);

      const statistics = {
        general_stats: {
          total_borrowings: totalBorrowings,
          active_borrowings: activeBorrowings,
          overdue_borrowings: overdueBorrowings,
          borrowings_last_30_days: borrowingsLast30Days,
          returns_last_30_days: returnsLast30Days,
          average_borrow_duration: averageBorrowDuration,
        },
        popular_books: mostBorrowedBooks,
        borrowing_trends: borrowingTrends,
        top_borrowers: topBorrowers,
        return_rate_analysis: returnRateStats,
        overdue_analysis: overdueAnalysis,
      };

      // Add admin-only statistics
      if (!borrower_id) {
        const [totalBooks, totalBorrowers, inventoryStats] = await Promise.all([
          Book.count(),
          Borrower.count(),
          this.getInventoryStats(),
        ]);

        statistics.library_stats = {
          total_books: totalBooks,
          total_borrowers: totalBorrowers,
          books_per_borrower: (totalBooks / totalBorrowers).toFixed(2),
          inventory_stats: inventoryStats,
        };
      }

      return statistics;
    } catch (error) {
      throw new appError("Error generating statistics: " + error.message, 500);
    }
  }
  async calculateAverageBorrowDuration(whereClause) {
    const borrowings = await Borrowing.findAll({
      where: {
        ...whereClause,
        is_returned: true,
      },
      attributes: [
        [
          sequelize.fn(
            "AVG",
            sequelize.fn(
              "DATEDIFF",
              sequelize.col("returned_date"),
              sequelize.col("checkout_date")
            )
          ),
          "avg_duration",
        ],
      ],
    });
    return Math.round(borrowings[0].getDataValue("avg_duration") || 0);
  }

  async getMostBorrowedBooks(whereClause) {
    return await Borrowing.findAll({
      where: whereClause,
      include: [
        {
          model: Book,
          attributes: ["title", "author", "ISBN"],
        },
      ],
      attributes: [
        "book_id",
        [sequelize.fn("COUNT", sequelize.col("book_id")), "borrow_count"],
      ],
      group: ["book_id", "Book.id", "Book.title", "Book.author", "Book.ISBN"],
      order: [[sequelize.fn("COUNT", sequelize.col("book_id")), "DESC"]],
      limit: 10,
    });
  }

  async getBorrowingTrends(whereClause) {
    const last6Months = Array.from({ length: 6 }, (_, i) => {
      const date = subMonths(new Date(), i);
      return {
        start: startOfMonth(date),
        end: endOfMonth(date),
        month: date.toLocaleString("default", { month: "long" }),
      };
    }).reverse();

    const trends = await Promise.all(
      last6Months.map(async ({ start, end, month }) => {
        const count = await Borrowing.count({
          where: {
            ...whereClause,
            checkout_date: {
              [Op.between]: [start, end],
            },
          },
        });
        return { month, count };
      })
    );

    return trends;
  }

  async getTopBorrowers(whereClause) {
    return await Borrowing.findAll({
      where: whereClause,
      include: [
        {
          model: Borrower,
          attributes: ["name", "email"],
        },
      ],
      attributes: [
        "borrower_id",
        [sequelize.fn("COUNT", sequelize.col("borrower_id")), "borrow_count"],
      ],
      group: ["borrower_id", "Borrower.id", "Borrower.name", "Borrower.email"],
      order: [[sequelize.fn("COUNT", sequelize.col("borrower_id")), "DESC"]],
      limit: 10,
    });
  }

  async getReturnRateStats(whereClause) {
    const [onTime, late] = await Promise.all([
      Borrowing.count({
        where: {
          ...whereClause,
          is_returned: true,
          returned_date: {
            [Op.lte]: sequelize.col("return_date"),
          },
        },
      }),
      Borrowing.count({
        where: {
          ...whereClause,
          is_returned: true,
          returned_date: {
            [Op.gt]: sequelize.col("return_date"),
          },
        },
      }),
    ]);

    const total = onTime + late;
    return {
      on_time_returns: onTime,
      late_returns: late,
      on_time_return_rate: total
        ? ((onTime / total) * 100).toFixed(2) + "%"
        : "0%",
    };
  }

  async getOverdueAnalysis(whereClause) {
    const overdueBooks = await Borrowing.findAll({
      where: {
        ...whereClause,
        is_returned: false,
        return_date: {
          [Op.lt]: new Date(),
        },
      },
      attributes: [
        [
          sequelize.fn(
            "DATEDIFF",
            sequelize.fn("NOW"),
            sequelize.col("return_date")
          ),
          "days_overdue",
        ],
      ],
    });

    const overdueDays = overdueBooks
      .map((book) => parseInt(book.getDataValue("days_overdue")))
      .sort((a, b) => a - b);

    return {
      total_overdue: overdueDays.length,
      average_days_overdue: overdueDays.length
        ? (overdueDays.reduce((a, b) => a + b, 0) / overdueDays.length).toFixed(
            1
          )
        : 0,
      max_days_overdue: overdueDays[overdueDays.length - 1] || 0,
      overdue_breakdown: {
        less_than_week: overdueDays.filter((days) => days <= 7).length,
        one_to_two_weeks: overdueDays.filter((days) => days > 7 && days <= 14)
          .length,
        more_than_two_weeks: overdueDays.filter((days) => days > 14).length,
      },
    };
  }

  async getInventoryStats() {
    const results = await Book.findAll({
      attributes: [
        [
          sequelize.fn("SUM", sequelize.col("available_quantity")),
          "total_books",
        ],
        [
          sequelize.fn("AVG", sequelize.col("available_quantity")),
          "avg_quantity_per_title",
        ],
        [
          sequelize.fn(
            "COUNT",
            sequelize.fn("DISTINCT", sequelize.col("author"))
          ),
          "unique_authors",
        ],
      ],
    });

    const lowStock = await Book.count({
      where: {
        available_quantity: {
          [Op.lt]: 2,
        },
      },
    });

    return {
      total_books: parseInt(results[0].getDataValue("total_books")),
      avg_quantity_per_title: parseFloat(
        results[0].getDataValue("avg_quantity_per_title")
      ).toFixed(2),
      unique_authors: parseInt(results[0].getDataValue("unique_authors")),
      low_stock_titles: lowStock,
    };
  }
}

module.exports = new StatisticsService();