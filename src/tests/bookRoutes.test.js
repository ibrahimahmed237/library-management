const request = require('supertest');
const express = require('express');
const bodyParser = require('body-parser');
const bookRoutes = require('../modules/books/routes/bookRoutes'); 
const BookService = require('../modules/books/services/bookService'); 

const app = express();
app.use(bodyParser.json());
app.use('/api/books', bookRoutes);

jest.mock('../modules/books/services/bookService.js'); // Mock the BookService

describe('Book Routes', () => {
  describe('POST /api/books', () => {
    it('should add a new book', async () => {
      const newBook = { title: 'Test Book', author: 'Test Author', ISBN: '1234567890' };
      BookService.addBook.mockResolvedValue(newBook);

      const response = await request(app)
        .post('/api/books')
        .send(newBook)
        .expect(201);

      expect(response.body).toEqual(newBook);
      expect(BookService.addBook).toHaveBeenCalledWith(newBook);
    });
  });

  describe('PUT /api/books/:id', () => {
    it('should update an existing book', async () => {
      const updatedBook = { title: 'Updated Book', author: 'Updated Author', ISBN: '0987654321' };
      BookService.updateBook.mockResolvedValue(true);

      const response = await request(app)
        .put('/api/books/1')
        .send(updatedBook)
        .expect(200);

      expect(response.body).toEqual({ message: 'Book updated successfully.' });
      expect(BookService.updateBook).toHaveBeenCalledWith('1', updatedBook);
    });

    it('should return 404 if the book is not found', async () => {
      BookService.updateBook.mockResolvedValue(false);

      const response = await request(app)
        .put('/api/books/1')
        .send({ title: 'Non-existent Book' })
        .expect(404);

      expect(response.body).toEqual({ message: 'Book not found.' });
    });
  });

  describe('DELETE /api/books/:id', () => {
    it('should delete an existing book', async () => {
      BookService.deleteBook.mockResolvedValue(true);

      await request(app)
        .delete('/api/books/1')
        .expect(204);

      expect(BookService.deleteBook).toHaveBeenCalledWith('1');
    });

    it('should return 404 if the book is not found', async () => {
      BookService.deleteBook.mockResolvedValue(false);

      const response = await request(app)
        .delete('/api/books/1')
        .expect(404);

      expect(response.body).toEqual({ message: 'Book not found.' });
    });
  });

  describe('GET /api/books', () => {
    it('should list all books', async () => {
      const books = [{ title: 'Book 1' }, { title: 'Book 2' }];
      BookService.listBooks.mockResolvedValue(books);

      const response = await request(app)
        .get('/api/books')
        .expect(200);

      expect(response.body).toEqual(books);
      expect(BookService.listBooks).toHaveBeenCalled();
    });
  });
});