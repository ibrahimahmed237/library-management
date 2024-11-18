const BorrowingService = require("../services/borrowingService.js");
const appError = require("../../../shared/utils/appError.js");

class BorrowingController {
    async checkoutBook(req, res, next) {
        try {
            const borrowing = await BorrowingService.checkoutBook({
                book_id: req.body.book_id,
                borrower_id: req.borrower.id,
                return_date: req.body.return_date
            });
            res.status(201).json(borrowing);
        } catch (error) {
            next(new appError(error.message, 400));
        }
    }

    async returnBook(req, res, next) {
        try {
            const result = await BorrowingService.returnBook(req.body.borrowing_id, req.borrower.id);
            res.status(200).json(result);
        } catch (error) {
            next(new appError(error.message, 400));
        }
    }

    async getCheckedOutBooks(req, res, next) {
        try {
            const checkedOutBooks = req.borrower.isAdmin 
                ? await BorrowingService.getAllCheckedOutBooks()
                : await BorrowingService.getBorrowerBooks(req.borrower.id);
            console.log(req.borrower.isAdmin);
            res.status(200).json(checkedOutBooks);
        } catch (error) {
            next(new appError(error.message, 500));
        }
    }

    async getOverdueBooks(req, res, next) {
        try {
            const overdueBooks = req.borrower.isAdmin 
                ? await BorrowingService.getAllOverdueBooks()
                : await BorrowingService.getBorrowerOverdueBooks(req.borrower.id);
            res.status(200).json(overdueBooks);
        } catch (error) {
            console.log(error);
            
            next(new appError(error.message, 500));
        }
    }
}

module.exports = new BorrowingController();