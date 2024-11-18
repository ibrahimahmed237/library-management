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
cd ./docker
```

```sh
docker-compose up --build
```

This will build the Docker images, run the containers, migrate the database, and seed the initial data.

The `docker-compose.yml` file has been configured to automatically run the database migrations and seed the initial data when the containers are started. The relevant commands are included in the `Dockerfile` file.

If you want to remove the seeders, you can do so by removing the following command from the Dockerfile:

`echo '  cd /app && npx knex seed:run' >> /app/start.sh`

# API Documentation

## API Endpoints

### Authentication
These endpoints handle user registration and login.

- **Register**: `POST /api/auth/register`
  - **Description**: Registers a new user.
  - **Request Body**: `{ "name": "string", "email": "string", "password": "string" }`
  - **Rate Limit**: Yes, to prevent spam registrations.
  - **Response**: Created user object and token for authentication.
  
- **Login**: `POST /api/auth/login`
  - **Description**: Authenticates a user and provides a token.
  - **Request Body**: `{ "email": "string", "password": "string" }`
  - **Rate Limit**: Yes, to prevent brute-force attacks.
  - **Response**: User object and token for authentication.

### Books
Handles book management operations.

- **Add Book**: `POST /api/books`
  - **Requires**: Authentication, **Admin Access**
  - **Request Body**: `{ "title": "string", "author": "string", "ISBN": "string", "description": "string", "available_quantity": "number", "shelf_location": "string" }`
  - **Response**: Created book object.
  
- **Update Book**: `PUT /api/books/:id`
  - **Requires**: Authentication, **Admin Access**
  - **Request Body**: Same as "Add Book."
  - **Response**: Updated book object.
  
- **Delete Book**: `DELETE /api/books/:id`
  - **Requires**: Authentication, **Admin Access**
  - **Response**: Confirmation of book deletion.
  
- **List Books**: `GET /api/books`
  - **Requires**: None.
  - **Response**: Array of book objects.

- **Search Books**: `GET /api/books/search?title=string&author=string&ISBN=string`
  - **Requires**: None.
  - **Rate Limit**: Yes, to manage server load.
  - **Response**: Array of matching book objects.

### Borrowers
Manages borrower data and profiles.

- **Get Profile**: `GET /api/borrowers/profile`
  - **Requires**: Authentication.
  - **Response**: Borrower's profile information.
  
- **Update Profile**: `PUT /api/borrowers/profile`
  - **Requires**: Authentication.
  - **Request Body**: `{ "name": "string", "email": "string", "password": "string" }`
  - **Response**: Updated borrower profile.

- **Get Borrowing History**: `GET /api/borrowers/history`
  - **Requires**: Authentication.
  - **Response**: Array of borrowing records for the borrower.

- **List Borrowers**: `GET /api/borrowers`
  - **Requires**: Authentication, **Admin Access**
  - **Response**: Array of all borrower objects.

- **Get Borrower**: `GET /api/borrowers/:id`
  - **Requires**: Authentication, **Admin Access**
  - **Response**: Borrower details for the specified ID.

- **Delete Borrower**: `DELETE /api/borrowers/:id`
  - **Requires**: Authentication, **Admin Access**
  - **Conditions**: Only if the borrower has returned all checked-out books.
  - **Response**: Confirmation of borrower deletion.

### Borrowing
Handles borrowing operations, including checkout, returns, and overdue books.

- **Checkout Book**: `POST /api/borrowing/checkout`
  - **Requires**: Authentication.
  - **Request Body**: `{ "book_id": "number", "return_date": "date" }`
  - **Rate Limit**: Yes, to prevent excessive borrowing attempts.
  - **Response**: Confirmation with return date.

- **Return Book**: `POST /api/borrowing/return`
  - **Requires**: Authentication.
  - **Request Body**: `{ "borrowing_id": "number" }`
  - **Rate Limit**: Yes, to prevent misuse.
  - **Response**: Confirmation of book return.

- **Get Checked out Books**: `GET /api/borrowing/checked-out`
  - **Requires**: Authentication.
  - **Response**: Array of currently borrowed books.
  - **Note**: For Admins, returns all books and their borrowers that are currently checked out and not yet returned. For normal borrowers, returns only their checked-out books.

- **Get Overdue Books**: `GET /api/borrowing/overdue`
  - **Requires**: Authentication.
  - **Response**: Array of overdue book objects.
  - **Note**: For Admins, returns all books that are overdue. For normal borrowers, returns only their overdue books.

### Reporting
Provides analytics and reporting for borrowing activities.

- **Generate Report**: `POST /api/reports/generate`
  - **Requires**: Authentication.
  - **Request Body**: `{ "start_date": "date", "end_date": "date", "report_type": "string" }`
  - **Report types**: `borrowing`, `overdue`, `inventory`, `last_month_borrowing`, `last_month_overdue` 
  - **Rate Limit**: Yes, to prevent excessive report generation.
  - **Response**: Downloaded xlsx report file.
  - **Note**: For `last_month_borrowing` and `last_month_overdue report` types, `start_date` and `end_date` are not required.
  
- **Get Statistics**: `GET /api/reports/statistics`
  - **Requires**: Authentication.
  - **Response**: Library statistics, including counts of books, borrowers, and activities. The response includes general statistics, popular books, borrowing trends, top borrowers, return rate analysis, overdue analysis, and library inventory statistics.
  - **Note**: For normal borrowers, the statistics are specific to their own activities. For admins, the statistics cover all library activities.
  
The Library Management System offers comprehensive functionalities to manage a library's operations effectively. From adding and updating books to managing borrower profiles and borrowing activities, the system ensures smooth and efficient library management. The reporting and statistics features provide valuable insights into the library's performance and help in making informed decisions.
