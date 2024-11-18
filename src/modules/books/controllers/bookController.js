const BookService = require("../services/bookService.js");
const appError = require("../../../shared/utils/appError.js");
const debug = require("debug")("app:bookController");

class BookController {
    async addBook(req, res, next) {
        try {
            const book = await BookService.addBook(req.body);
            res.status(201).json(book); 
        } catch (error) {
            next(new appError(error.message, 400));
        }
    }

    async updateBook(req, res, next) {
        try {
            const updated = await BookService.updateBook(req.params.id, req.body);
            if (updated) {
                res.status(200).json({ message: 'Book updated successfully.' }); 
            } else {
                next(new appError('Book not found.', 404)); 
            }
        } catch (error) {
            next(new appError(error.message, 400));
        }
    }

    async deleteBook(req, res, next) {
        try {
            await BookService.deleteBook(req?.params?.id);
            res.status(204).send();
        } catch (error) {
            next(new appError(error.message, 404)); 
        }
    }

    async listBooks(req, res, next) {
        try {
            const books = await BookService.listBooks();
            res.status(200).json(books); 
        } catch (error) {
            next(new appError(error.message, 500));
        }
    }

    async searchBooks(req, res, next) {
        try {
            const books = await BookService.searchBooks(req.query);
            res.status(200).json(books); 
        } catch (error) {
            next(new appError(error.message, 500)); 
        }
    }
}

module.exports = new BookController();
