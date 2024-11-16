const Book = require("../models/Book.js");
const { Op } = require("sequelize");
class BookService {
  async addBook(bookData) {
    // Check if a book with the same ISBN already exists
    const book = await Book.findOne({ where: { ISBN: bookData.ISBN } });

    // Check if a book with the same ISBN already exists
    if (book) {
      throw new Error("Book with the same ISBN already exists");
    }

    return await Book.create(bookData);
  }

  async updateBook(id, bookData) {
    // Check if the book exists
    const book = await Book.findOne({ where: { id } });
    if (!book) {
      throw new Error("Book not found");
    }

    // Check if a book with the same ISBN already exists
    if (bookData.ISBN) {
      const bookWithSameISBN = await Book.findOne({
        where: { ISBN: bookData.ISBN },
      });
      if (bookWithSameISBN && bookWithSameISBN.id !== id) {
        throw new Error("Book with the same ISBN already exists");
      }
    }

    return await Book.update(bookData, { where: { id } });
  }

  async deleteBook(id) {
    const book = await Book.findOne({ where: { id } });
    if (!book) {
      throw new Error("Book not found");
    }

    return await Book.destroy({ where: { id } });
  }

  async listBooks() {
    return await Book.findAll();
  }

  async searchBooks(query) {
    const { title, author, ISBN } = query;

    // Build the where clause for OR conditions
    const whereClause = {
      [Op.or]: [],
    };

    // Add search conditions if they exist
    if (title) {
      whereClause[Op.or].push({
        title: {
          [Op.like]: `%${title}%`, // MySQL like is case-insensitive by default
        },
      });
    }

    if (author) {
      whereClause[Op.or].push({
        author: {
          [Op.like]: `%${author}%`,
        },
      });
    }

    if (ISBN) {
      whereClause[Op.or].push({
        ISBN: {
          [Op.like]: `%${ISBN}%`,
        },
      });
    }

    // If no search parameters provided, return empty array
    if (whereClause[Op.or].length === 0) {
      return [];
    }

    try {
      // Escape special characters to prevent SQL injection
      const books = await Book.findAll({
        where: whereClause,
        attributes: ["id", "title", "author", "ISBN"],
      });

      return books;
    } catch (error) {
      throw new Error(`Error searching books: ${error.message}`);
    }
  }
}

module.exports = new BookService();
