const express = require("express");
const { errorHandler, notFound } = require("./shared/middleware/errorHandler.js");

const bookRoutes = require("./modules/books/routes/bookRoutes.js");
const borrowingRoutes = require('./modules/borrowing/routes/borrowingRoutes');
const authenticationRoutes = require('./modules/auth/routes/authRoutes.js');
const borrowerRoutes = require('./modules/borrowers/routes/borrowerRoutes.js');
const reportingRoutes = require('./modules/reporting/routes/reportingRoutes');

const app = express();

app.use(express.json());

app.use('/api/auth', authenticationRoutes);
app.use("/api/books", bookRoutes);
app.use('/api/borrowing', borrowingRoutes);
app.use('/api/borrowers', borrowerRoutes);
app.use('/api/reports', reportingRoutes);

app.use(notFound);
app.use(errorHandler);

module.exports = app;
