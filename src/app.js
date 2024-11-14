const express = require("express");
const { errorHandler, notFound } = require("./shared/middleware/errorHandler.js");

const bookRoutes = require("./modules/books/routes/bookRoutes.js");

const app = express();

app.use(express.json());

app.use("/api/books", bookRoutes);


app.use(notFound);
app.use(errorHandler);

module.exports = app;
