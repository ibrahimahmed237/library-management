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

docker-compose up --build
```

This will build the Docker images, run the containers, and set up the database with initial data.

## API Endpoints

### Authentication

- **Register**: `POST /api/auth/register`
    - Request Body: `{ "name": "string", "email": "string", "password": "string" }`
- **Login**: `POST /api/auth/login`
    - Request Body: `{ "email": "string", "password": "string" }`

### Books

- **Add Book**: `POST /api/books`
    - Request Body: `{ "title": "string", "author": "string", "ISBN": "string", "description": "string", "available_quantity": "number", "shelf_location": "string" }`
- **Update Book**: `PUT /api/books/:id`
    - Request Body: `{ "title": "string", "author": "string", "ISBN": "string", "description": "string", "available_quantity": "number", "shelf_location": "string" }`
- **Delete Book**: `DELETE /api/books/:id`
- **List Books**: `GET /api/books`
- **Search Books**: `GET /api/books/search?title=string&author=string&ISBN=string`

### Borrowers

- **Get Profile**: `GET /api/borrowers/profile`
- **Update Profile**: `PUT /api/borrowers/profile`
    - Request Body: `{ "name": "string", "email": "string", "password": "string" }`
- **Get Borrowing History**: `GET /api/borrowers/history`
- **List Borrowers**: `GET /api/borrowers`
- **Get Borrower**: `GET /api/borrowers/:id`
- **Delete Borrower**: `DELETE /api/borrowers/:id`

### Borrowing

- **Checkout Book**: `POST /api/borrowing/checkout`
    - Request Body: `{ "book_id": "number", "return_date": "date" }`
- **Return Book**: `POST /api/borrowing/return`
    - Request Body: `{ "borrowing_id": "number" }`
- **Get Borrower Books**: `GET /api/borrowing/my-books`
- **Get Overdue Books**: `GET /api/borrowing/overdue`

### Reporting

- **Generate Report**: `POST /api/reports/generate`
    - Request Body: `{ "start_date": "date", "end_date": "date", "report_type": "string" }`
    - This endpoint allows users to generate various types of reports based on the specified date range and report type.
- **Get Statistics**: `GET /api/reports/statistics`
    - This endpoint provides statistical data about the library, such as the number of books, borrowers, and borrowing activities.

The Library Management System offers comprehensive functionalities to manage a library's operations effectively. From adding and updating books to managing borrower profiles and borrowing activities, the system ensures smooth and efficient library management. The reporting and statistics features provide valuable insights into the library's performance and help in making informed decisions.
```

