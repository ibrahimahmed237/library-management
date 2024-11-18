# Library Management System

This is a Library Management System built with Node.js, Express, Sequelize, and MySQL. It allows users to manage books, borrowers, and borrowing history efficiently. The system supports various functionalities including user authentication, book management, borrower management, borrowing operations, and reporting.

## Prerequisites

- Docker
- Docker Compose

## Getting Started

### Clone the repository

```sh
git clone https://github.com/ibrahimahmed237/library-management.git
```

### Build and run the Docker containers
```sh
cd /docker
```

```sh
docker-compose up --build
```

This will build the Docker images, run the containers, migrate the database, and seed the initial data.

The `docker-compose.yml` file has been configured to automatically run the database migrations and seed the initial data when the containers are started. The relevant commands are included in the `command` in the `Dockerfile` file.

If you want to remove the seeders, you can do so by removing the following command from the Dockerfile:
`echo '  cd /app && npx knex seed:run' >> /app/start.sh`

### API Documentation

## API Endpoints

### Authentication

- **Register**: `POST /api/auth/register`
    - Request Body: `{ "name": "string", "email": "string", "password": "string" }`
    - Rate Limit: Prevents spammy registration attempts or brute-force attacks.
    - Response: Created user object and a token for authentication.
- **Login**: `POST /api/auth/login`
    - Request Body: `{ "email": "string", "password": "string" }`
    - Rate Limit: Protects against brute-force login attempts.
    - Response: User object and a token for authentication.
### Books

- **Add Book**: `POST /api/books` (Only accessible to the admin)
    - Request Body: `{ "title": "string", "author": "string", "ISBN": "string", "description": "string", "available_quantity": "number", "shelf_location": "string" }`
    - Response: Created book object
- **Update Book**: `PUT /api/books/:id` (Only accessible to the admin)
    - Request Body: `{ "title": "string", "author": "string", "ISBN": "string", "description": "string", "available_quantity": "number", "shelf_location": "string" }`
    - Response: Updated book object
- **Delete Book**: `DELETE /api/books/:id` (Only accessible to the admin)
- **List Books**: `GET /api/books` 
    - Response: Array of book objects
- **Search Books**: `GET /api/books/search?title=string&author=string&ISBN=string`
    - Rate Limit: Prevents abuse and reduces server load.
    - Response: Array of book objects that match the search criteria.

### Borrowers

- **Get Profile**: `GET /api/borrowers/profile`
- **Update Profile**: `PUT /api/borrowers/profile`
    - Request Body: `{ "name": "string", "email": "string", "password": "string" }`
- **Get Borrowing History**: `GET /api/borrowers/history` (Only accessible to the borrower)
- **List Borrowers**: `GET /api/borrowers` (Only accessible to the admin)
    - Response: Array of borrower objects
- **Get Borrower**: `GET /api/borrowers/:id` (Only accessible to the admin)
    - Response: Borrower object
- **Delete Borrower**: `DELETE /api/borrowers/:id` (Only accessible to the borrower who has not checked out any books)

### Borrowing

- **Checkout Book**: `POST /api/borrowing/checkout` (Only accessible to the borrower who has not checked out the book)
    - Request Body: `{ "book_id": "number", "return_date": "date" }` (This endpoint is only accessible to the borrower who has not checked out the book)
    - Rate Limit: Prevents excessive borrowing attempts, indicating abusive activity or automated scraping.
    - Response: Acknowledgement of the checkout with date of return.
- **Return Book**: `POST /api/borrowing/return` (Only accessible to the borrower who has checked out the book)
    - Request Body: `{ "borrowing_id": "number" }` (This endpoint is only accessible to the borrower who has checked out the book)
    - Rate Limit: Prevents misuse and manages a large volume of returns in a short period.
    - Response: Acknowledgement of the return success.

- **Get Borrower Books**: `GET /api/borrowing/my-books` returns an array of book objects for the borrower's borrowing history
    - Response: Array of book objects for the borrower's borrowing history
- **Get Overdue Books**: `GET /api/borrowing/overdue` returns an array of book objects for overdue books
    - Response: Array of book objects for overdue books
### Reporting

- **Generate Report**: `POST /api/reports/generate` (Generates a xlsx report based on the specified date range and report type)
    - Request Body: `{ "start_date": "date", "end_date": "date", "report_type": "string" }`
    - This endpoint allows users to generate various types of reports based on the specified date range and report type.
    - Report types: `borrowing`, `overdue`, `inventory`, `last_month_borrowing`, `last_month_overdue`
    - Rate Limit: Prevents frequent and resource-intensive report generation requests that could strain server resources.
    - Response: Downloaded xlsx report file.
- **Get Statistics**: `GET /api/reports/statistics`
    - This endpoint provides statistical data about the library, such as the number of books, borrowers, and borrowing activities.
    - Response: Array of statistic objects.

The Library Management System offers comprehensive functionalities to manage a library's operations effectively. From adding and updating books to managing borrower profiles and borrowing activities, the system ensures smooth and efficient library management. The reporting and statistics features provide valuable insights into the library's performance and help in making informed decisions.


