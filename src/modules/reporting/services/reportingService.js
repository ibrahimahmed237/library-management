const { Op } = require("sequelize");
const Book = require("../../books/models/Book.js");
const BorrowingHistory = require("../../borrowing/models/BorrowingHistory.js");
const Borrower = require("../../borrowers/models/Borrower.js");
const XLSX = require("xlsx");
const appError = require("../../../shared/utils/appError.js");
const { startOfMonth, endOfMonth, subMonths } = require("date-fns");
const sequelize = require("sequelize");


class ReportingService {
    async generateReport({
        start_date,
        end_date,
        report_type,
        borrower_id = null,
    }) {
        let reportData;
    
        // Handle special report types for last month
        if (
          report_type === "last_month_borrowing" ||
          report_type === "last_month_overdue"
        ) {
          const lastMonthStart = startOfMonth(subMonths(new Date(), 1));
          const lastMonthEnd = endOfMonth(subMonths(new Date(), 1));
    
          if (report_type === "last_month_borrowing") {
            reportData = await this.getBorrowingReport(
              lastMonthStart,
              lastMonthEnd,
              borrower_id
            );
          } else {
            reportData = await this.getOverdueReport(
              lastMonthStart,
              lastMonthEnd,
              borrower_id
            );
          }
        } else {
          switch (report_type) {
            case "borrowing":
              reportData = await this.getBorrowingReport(
                start_date,
                end_date,
                borrower_id
              );
              break;
            case "overdue":
              reportData = await this.getOverdueReport(
                start_date,
                end_date,
                borrower_id
              );
              break;
            case "inventory":
              if (!borrower_id) {
                reportData = await this.getInventoryReport(start_date, end_date);
              } else {
                throw new appError(
                  "Inventory report is only available for administrators",
                  403
                );
              }
              break;
            default:
              throw new appError("Invalid report type", 400);
          }
        }
    
        // Add analytics for borrowing and overdue reports
        if (
          [
            "borrowing",
            "overdue",
            "last_month_borrowing",
            "last_month_overdue",
          ].includes(report_type)
        ) {
          const analytics = await this.generateAnalytics(reportData);
          reportData = {
            data: reportData,
            analytics: analytics,
          };
        }
        
        // Ensure report_type is always included in the data structure
        if (typeof reportData === 'object') {
          reportData.report_type = report_type;
        } else {
          reportData = {
            data: reportData,
            report_type: report_type
          };
        }
    
        return await this.generateExcel(reportData, report_type);
    }

    async generateAnalytics(data) {
        return {
            total_records: data.length,
            unique_borrowers: new Set(data.map((item) => item.Borrower.id)).size,
            unique_books: new Set(data.map((item) => item.Book.id)).size,
            average_borrowing_duration: this.calculateAverageDuration(data),
            most_borrowed_book: this.getMostBorrowedBook(data),
            most_active_borrower: this.getMostActiveBorrower(data),
        };
    }

    calculateAverageDuration(data) {
        const durations = data
            .filter((item) => item.returned_date)
            .map((item) => {
                const checkout = new Date(item.checkout_date);
                const returned = new Date(item.returned_date);
                return Math.ceil((returned - checkout) / (1000 * 60 * 60 * 24));
            });

        return durations.length
            ? Math.round(
                durations.reduce((acc, curr) => acc + curr, 0) / durations.length
            )
            : 0;
    }

    getMostBorrowedBook(data) {
        const bookCounts = {};
        data.forEach((item) => {
            bookCounts[item.Book.title] = (bookCounts[item.Book.title] || 0) + 1;
        });

        return Object.entries(bookCounts).sort(([, a], [, b]) => b - a)[0]?.[0] || "None";
    }

    getMostActiveBorrower(data) {
        const borrowerCounts = {};
        data.forEach((item) => {
            borrowerCounts[item.Borrower.name] =
                (borrowerCounts[item.Borrower.name] || 0) + 1;
        });

        return Object.entries(borrowerCounts).sort(([, a], [, b]) => b - a)[0]?.[0] || "None";
    }

    async getBorrowingReport(start_date, end_date, borrower_id = null) {
        const whereClause = {
            checkout_date: {
                [Op.between]: [start_date, end_date],
            },
        };

        if (borrower_id) {
            whereClause.borrower_id = borrower_id;
        }

        return await BorrowingHistory.findAll({
            where: whereClause,
            include: [
                {
                    model: Book,
                    attributes: ["id", "title", "author", "ISBN"],
                },
                {
                    model: Borrower,
                    attributes: ["id", "name", "email"],
                },
            ],
            order: [["checkout_date", "DESC"]],
        });
    }

    async getOverdueReport(start_date, end_date, borrower_id = null) {
        const whereClause = {
            return_date: {
                [Op.between]: [start_date, end_date],
            },
            returned_date: {
                [Op.or]: [{ [Op.gt]: { [Op.col]: "return_date" } }, { [Op.is]: null }],
            },
        };

        if (borrower_id) {
            whereClause.borrower_id = borrower_id;
        }

        return await BorrowingHistory.findAll({
            where: whereClause,
            include: [
                {
                    model: Book,
                    attributes: ["id", "title", "author", "ISBN"],
                },
                {
                    model: Borrower,
                    attributes: ["id", "name", "email"],
                },
            ],
            order: [["return_date", "DESC"]],
        });
    }

    async getInventoryReport(start_date, end_date) {
        // Convert dates to ISO strings for querying
        const startDate = new Date(start_date).toISOString().split('T')[0];
        const endDate = new Date(end_date).toISOString().split('T')[0];
    
        // Query for books with total borrowings within the date range
        const query = await Book.findAll({
            attributes: [
                "id",
                "title",
                "author",
                "ISBN",
                "available_quantity",
                [
                    sequelize.literal(`(
                        SELECT COALESCE(COUNT(*), 0)
                        FROM borrowing_history
                        WHERE borrowing_history.book_id = \`Books\`.\`id\`
                        AND DATE(borrowing_history.checkout_date) >= '${startDate}'
                        AND DATE(borrowing_history.checkout_date) <= '${endDate}'
                    )`),
                    "total_borrowings",
                ],
            ],
            order: [[sequelize.literal('total_borrowings'), 'DESC']],
        });
    
        return query;
    }
    async generateExcel(data, reportType) {
        // Create a new workbook
        const workbook = XLSX.utils.book_new();
        
        // Get headers based on report type
        const headers = this.getReportHeaders(reportType);
        
        // Format the data
        let formattedData = [];
        if (data.data) {
            formattedData = this.formatReportData(data.data, reportType);
        } else {
            formattedData = this.formatReportData(data, reportType);
        }

        // Create worksheet with data
        const wsData = [headers, ...formattedData.map(row => headers.map(header => 
            row[header.toLowerCase().replace(/ /g, "_")] || '')
        )];
        
        const ws = XLSX.utils.aoa_to_sheet(wsData);

        // Style the headers (make them bold)
        const range = XLSX.utils.decode_range(ws['!ref']);
        for (let C = range.s.c; C <= range.e.c; ++C) {
            const address = XLSX.utils.encode_cell({ r: 0, c: C });
            if (!ws[address]) continue;
            ws[address].s = { font: { bold: true } };
        }

        // Add the data worksheet
        XLSX.utils.book_append_sheet(workbook, ws, "Data");

        // Add analytics sheet if available
        if (data.analytics) {
            const analyticsData = [
                ["Metric", "Value"],
                ...Object.entries(data.analytics).map(([key, value]) => [
                    key.replace(/_/g, " ").replace(/\b\w/g, l => l.toUpperCase()),
                    value.toString()
                ])
            ];
            
            const wsAnalytics = XLSX.utils.aoa_to_sheet(analyticsData);
            
            // Style analytics headers
            const analyticsCell = XLSX.utils.encode_cell({ r: 0, c: 0 });
            wsAnalytics[analyticsCell].s = { font: { bold: true } };
            
            XLSX.utils.book_append_sheet(workbook, wsAnalytics, "Analytics");
        }

        // Set column widths
        const maxWidth = 20;
        ws['!cols'] = headers.map(() => ({ wch: maxWidth }));

        // Write to buffer
        return XLSX.write(workbook, { type: 'buffer', bookType: 'xlsx' });
    }

    getReportHeaders(reportType) {
        switch (reportType) {
            case "borrowing":
                return [
                    "Book Title",
                    "Author",
                    "ISBN",
                    "Borrower Name",
                    "Checkout Date",
                    "Return Date",
                    "Status",
                ];
            case "overdue":
                return [
                    "Book Title",
                    "Author",
                    "ISBN",
                    "Borrower Name",
                    "Checkout Date",
                    "Due Date",
                    "Days Overdue",
                ];
            case "inventory":
                return [
                    "Title",
                    "Author",
                    "ISBN",
                    "Available Quantity",
                    "Total Borrowings",
                ];
            default:
                throw new appError("Invalid report type", 400);
        }
    }

    formatReportData(data, reportType) {
        if (!Array.isArray(data)) {
            return [];
        }
        
        return data.map((item) => {
            switch (reportType) {
                case "borrowing":
                    return {
                        book_title: item.Book.title,
                        author: item.Book.author,
                        isbn: item.Book.ISBN,
                        borrower_name: item.Borrower.name,
                        checkout_date: item.checkout_date,
                        return_date: item.return_date,
                        status: item.is_returned ? "Returned" : "Active",
                    };
                case "overdue":
                    const daysOverdue = Math.ceil(
                        (new Date() - new Date(item.return_date)) / (1000 * 60 * 60 * 24)
                    );
                    return {
                        book_title: item.Book.title,
                        author: item.Book.author,
                        isbn: item.Book.ISBN,
                        borrower_name: item.Borrower.name,
                        checkout_date: item.checkout_date,
                        due_date: item.return_date,
                        days_overdue: daysOverdue,
                    };
                case "inventory":
                    return {
                        title: item.title,
                        author: item.author,
                        isbn: item.ISBN,
                        available_quantity: item.available_quantity,
                        total_borrowings: item.dataValues.total_borrowings || 0,
                    };
                default:
                    return item;
            }
        });
    }
}

module.exports = new ReportingService();