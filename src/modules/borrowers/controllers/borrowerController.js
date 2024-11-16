const BorrowerService = require("../services/borrowerService.js");
const appError = require("../../../shared/utils/appError.js");

class BorrowerController {
    async updateProfile(req, res, next) {
        try {
            const updatedBorrower = await BorrowerService.updateBorrower(req.borrower.id, req.body);
            res.status(200).json(updatedBorrower);
        } catch (error) {
            next(new appError(error.message, 400));
        }
    }

    async deleteBorrower(req, res, next) {
        try {
            await BorrowerService.deleteBorrower(req?.params?.id);
            res.status(204).send({ message: 'Borrower deleted successfully.' });
        } catch (error) {
            next(new appError(error.message, 400));
        }
    }

    async getBorrower(req, res, next) {
        try {
            const borrower = await BorrowerService.getBorrower(req?.params?.id);
            if (!borrower) {
                return next(new appError("Borrower not found", 404));
            }
            res.status(200).json(borrower);
        } catch (error) {
            next(new appError(error.message, 500));
        }
    }

    async getProfile(req, res, next) {
        try {
            const borrower = await BorrowerService.getBorrower(req?.borrower?.id);
            res.status(200).json(borrower);
        } catch (error) {
            next(new appError(error.message, 500));
        }
    }

    async listBorrowers(req, res, next) {
        try {
            const borrowers = await BorrowerService.listBorrowers(req?.query);
            res.status(200).json(borrowers);
        } catch (error) {
            next(new appError(error.message, 500));
        }
    }

    async getBorrowingHistory(req, res, next) {
        try {
            const history = await BorrowerService.getBorrowingHistory(req?.borrower?.id);
            res.status(200).json(history);
        } catch (error) {
            next(new appError(error.message, 500));
        }
    }
}

module.exports = new BorrowerController();