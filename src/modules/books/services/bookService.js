const Book = require('../models/Book.js');

class BookService {
    async addBook(bookData) {
        return await Book.create(bookData);
    }

    async updateBook(id, bookData) {
        return await Book.update(bookData, { where: { id } });
    }

    async deleteBook(id) {
        return await Book.destroy({ where: { id } });
    }

    async listBooks() {
        return await Book.findAll();
    }

    async searchBooks(query) {
        const { title, author, ISBN } = query;
        const whereClause = {};
        if (title) whereClause.title = title;
        if (author) whereClause.author = author;
        if (ISBN) whereClause.ISBN = ISBN;

        return await Book.findAll({ where: whereClause });
    }
}

module.exports = new BookService();
