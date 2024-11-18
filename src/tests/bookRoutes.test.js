// __tests__/controllers/bookController.test.js
const BookController = require('../modules/books/controllers/bookController');
const BookService = require('../modules/books/services/bookService');
const appError = require('../shared/utils/appError');

// Mock the BookService
jest.mock('../modules/books/services/bookService');

describe('BookController', () => {
    let mockReq;
    let mockRes;
    let mockNext;

    beforeEach(() => {
        // Reset all mocks before each test
        jest.clearAllMocks();

        // Setup mock request object
        mockReq = {
            body: {},
            params: {},
            query: {}
        };

        // Setup mock response object
        mockRes = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
            send: jest.fn()
        };

        // Setup mock next function
        mockNext = jest.fn();
    });

    describe('addBook', () => {
        const mockBook = {
            id: 1,
            title: 'Test Book',
            author: 'Test Author',
            ISBN: '1234567890'
        };

        it('should successfully add a book', async () => {
            mockReq.body = mockBook;
            BookService.addBook.mockResolvedValue(mockBook);

            await BookController.addBook(mockReq, mockRes, mockNext);

            expect(BookService.addBook).toHaveBeenCalledWith(mockBook);
            expect(mockRes.status).toHaveBeenCalledWith(201);
            expect(mockRes.json).toHaveBeenCalledWith(mockBook);
        });

        it('should handle errors when adding a book', async () => {
            const error = new Error('Validation error');
            BookService.addBook.mockRejectedValue(error);

            await BookController.addBook(mockReq, mockRes, mockNext);

            expect(mockNext).toHaveBeenCalledWith(
                expect.any(appError)
            );
            expect(mockNext.mock.calls[0][0].statusCode).toBe(400);
        });
    });

    describe('updateBook', () => {
        const mockUpdate = {
            title: 'Updated Book'
        };

        it('should successfully update a book', async () => {
            mockReq.params.id = '1';
            mockReq.body = mockUpdate;
            BookService.updateBook.mockResolvedValue(true);

            await BookController.updateBook(mockReq, mockRes, mockNext);

            expect(BookService.updateBook).toHaveBeenCalledWith('1', mockUpdate);
            expect(mockRes.status).toHaveBeenCalledWith(200);
            expect(mockRes.json).toHaveBeenCalledWith({
                message: 'Book updated successfully.'
            });
        });

        it('should handle book not found during update', async () => {
            mockReq.params.id = '999';
            mockReq.body = mockUpdate;
            BookService.updateBook.mockResolvedValue(false);

            await BookController.updateBook(mockReq, mockRes, mockNext);

            expect(mockNext).toHaveBeenCalledWith(
                expect.any(appError)
            );
            expect(mockNext.mock.calls[0][0].statusCode).toBe(404);
        });
    });

    describe('deleteBook', () => {
        it('should successfully delete a book', async () => {
            mockReq.params.id = '1';
            BookService.deleteBook.mockResolvedValue(true);

            await BookController.deleteBook(mockReq, mockRes, mockNext);

            expect(BookService.deleteBook).toHaveBeenCalledWith('1');
            expect(mockRes.status).toHaveBeenCalledWith(204);
            expect(mockRes.send).toHaveBeenCalled();
        });

        it('should handle errors when deleting a book', async () => {
            mockReq.params.id = '999';
            BookService.deleteBook.mockRejectedValue(new Error('Book not found'));

            await BookController.deleteBook(mockReq, mockRes, mockNext);

            expect(mockNext).toHaveBeenCalledWith(
                expect.any(appError)
            );
            expect(mockNext.mock.calls[0][0].statusCode).toBe(404);
        });
    });

    describe('listBooks', () => {
        const mockBooks = [
            { id: 1, title: 'Book 1' },
            { id: 2, title: 'Book 2' }
        ];

        it('should successfully list all books', async () => {
            BookService.listBooks.mockResolvedValue(mockBooks);

            await BookController.listBooks(mockReq, mockRes, mockNext);

            expect(BookService.listBooks).toHaveBeenCalled();
            expect(mockRes.status).toHaveBeenCalledWith(200);
            expect(mockRes.json).toHaveBeenCalledWith(mockBooks);
        });

        it('should handle errors when listing books', async () => {
            BookService.listBooks.mockRejectedValue(new Error('Database error'));

            await BookController.listBooks(mockReq, mockRes, mockNext);

            expect(mockNext).toHaveBeenCalledWith(
                expect.any(appError)
            );
            expect(mockNext.mock.calls[0][0].statusCode).toBe(500);
        });
    });

    describe('searchBooks', () => {
        const mockBooks = [
            { id: 1, title: 'Search Result 1' },
            { id: 2, title: 'Search Result 2' }
        ];

        it('should successfully search books', async () => {
            mockReq.query = { title: 'Search' };
            BookService.searchBooks.mockResolvedValue(mockBooks);

            await BookController.searchBooks(mockReq, mockRes, mockNext);

            expect(BookService.searchBooks).toHaveBeenCalledWith({ title: 'Search' });
            expect(mockRes.status).toHaveBeenCalledWith(200);
            expect(mockRes.json).toHaveBeenCalledWith(mockBooks);
        });

        it('should handle errors when searching books', async () => {
            mockReq.query = { title: 'Error' };
            BookService.searchBooks.mockRejectedValue(new Error('Search error'));

            await BookController.searchBooks(mockReq, mockRes, mockNext);

            expect(mockNext).toHaveBeenCalledWith(
                expect.any(appError)
            );
            expect(mockNext.mock.calls[0][0].statusCode).toBe(500);
        });
    });
});