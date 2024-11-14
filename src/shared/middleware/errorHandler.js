const appError = require("../utils/appError.js");

// Development error handler
const devErrorHandler = (res, error) => {
  console.error("Error:", error); // Detailed logging for debugging
  res.status(error.statusCode).json({
    status: error.status,
    message: error.message,
    stack: error.stack,
  });
};

// Production error handler
const prodErrorHandler = (res, error) => {
  if (error.isOperational) {
    res.status(error.statusCode).json({
      status: error.status,
      message: error.message,
    });
  } else {
    // Log unexpected errors for future debugging
    console.error("Unexpected Error:", error);
    res.status(500).json({
      status: "error",
      message: "Something went wrong!",
    });
  }
};

// CastError handler for invalid MongoDB ObjectId or database IDs
const castErrorHandler = (error) => {
  const message = `Invalid value '${error.value}' for field '${error.path}'`;
  return new appError(message, 400);
};

// ValidationError handler for validation failures
const validationErrorHandler = (error) => {
  const message = `Invalid input data. ${error.message}`;
  return new appError(message, 400);
};

// JWT error handler
const jwtErrorHandler = () =>
  new appError("Invalid token. Please log in again!", 401);

// JWT expired error handler
const jwtExpiredHandler = () =>
  new appError("Token expired. Please log in again!", 401);

// Main error handling middleware
const errorHandler = (error, req, res, next) => {
  error.statusCode = error.statusCode || 500;
  error.status = error.status || "error";

  if (process.env.NODE_ENV === "development") {
    devErrorHandler(res, error);
  } else {
    // Handle specific known error types for production
    if (error.name === "CastError") error = castErrorHandler(error);
    if (error.name === "ValidationError") error = validationErrorHandler(error);
    if (error.name === "JsonWebTokenError") error = jwtErrorHandler();
    if (error.name === "TokenExpiredError") error = jwtExpiredHandler();

    prodErrorHandler(res, error);
  }
};

// Middleware for handling 404 errors
const notFound = (req, res, next) => {
  const message = `Cannot find ${req.originalUrl} on this server!`;
  next(new appError(message, 404));
};

module.exports = { errorHandler, notFound };
