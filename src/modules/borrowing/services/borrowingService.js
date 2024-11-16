const { Op } = require("sequelize");
const BorrowingHistory = require("../models/BorrowingHistory.js");
const Book = require("../../books/models/Book.js");
const appError = require("../../../shared/utils/appError.js");
const Borrower = require("../../borrowers/models/Borrower.js");
class BorrowingService {
    async checkoutBook({ book_id, borrower_id, return_date }) {
        const book = await Book.findByPk(book_id);
        if (!book) {
            throw new appError("Book not found", 404);
        }

        if (book.available_quantity < 1) {
            throw new appError("Book is not available for checkout", 400);
        }

        // Check if borrower already has this book
        const existingBorrowing = await BorrowingHistory.findOne({
            where: {
                book_id,
                borrower_id,
                is_returned: false
            }
        });

        if (existingBorrowing) {
            throw new appError("You already have this book checked out", 400);
        }

        // Start transaction
        const t = await BorrowingHistory.sequelize.transaction();

        try {
            // Create borrowing record
            const borrowing = await BorrowingHistory.create({
                book_id,
                borrower_id,
                checkout_date: new Date(),
                return_date,
                is_returned: false
            }, { transaction: t });

            // Update book quantity
            await Book.update(
                { available_quantity: book.available_quantity - 1 },
                { where: { id: book_id }, transaction: t }
            );

            await t.commit();
            return borrowing;
        } catch (error) {
            await t.rollback();
            throw error;
        }
    }

    async returnBook(borrowing_id, borrower_id) {
        const borrowing = await BorrowingHistory.findOne({
            where: {
                id: borrowing_id,
                borrower_id,
                is_returned: false
            }
        });

        if (!borrowing) {
            throw new appError("Borrowing record not found", 404);
        }

        // Start transaction
        const t = await BorrowingHistory.sequelize.transaction();

        try {
            // Update borrowing record
            await borrowing.update({
                returned_date: new Date(),
                is_returned: true
            }, { transaction: t });

            // Update book quantity
            await Book.increment('available_quantity', {
                by: 1,
                where: { id: borrowing.book_id },
                transaction: t
            });

            await t.commit();
            return { message: "Book returned successfully" };
        } catch (error) {
            await t.rollback();
            throw error;
        }
    }

    async getBorrowerBooks(borrower_id) {
        return await BorrowingHistory.findAll({
            where: {
                borrower_id,
                is_returned: false
            },
            include: [{
                model: Book,
                attributes: ['title', 'author', 'ISBN']
            }]
        });
    }

    async getAllOverdueBooks() {
        return await BorrowingHistory.findAll({
          where: {
            return_date: {
              [Op.lt]: new Date(),
            },
            is_returned: false,
          },
          include: [
            {
              model: Book,
              attributes: ["title", "author", "ISBN"],
            },
            {
              model: Borrower,
              attributes: ["name", "email"],
            },
          ],
          order: [["return_date", "ASC"]],
        });
      }
    
      async getBorrowerOverdueBooks(borrowerId) {
        return await BorrowingHistory.findAll({
          where: {
            borrower_id: borrowerId,
            return_date: {
              [Op.lt]: new Date(),
            },
            is_returned: false,
          },
          include: [
            {
              model: Book,
              attributes: ["title", "author", "ISBN"],
            },
          ],
          order: [["return_date", "ASC"]],
        });
      }
}

module.exports = new BorrowingService();