const Joi = require("joi");

// Book Schemas
const bookSchema = Joi.object({
  title: Joi.string().required().min(1).max(255).trim().messages({
    "string.min": "Title cannot be empty",
    "string.max": "Title cannot exceed 255 characters",
    "any.required": "Title is required",
  }),
  author: Joi.string().required().min(2).max(255).trim().messages({
    "string.min": "Author name must be at least 2 characters long",
    "string.max": "Author name cannot exceed 255 characters",
    "any.required": "Author is required",
  }),
  ISBN: Joi.string()
    .required()
    .pattern(/^(?=(?:\D*\d){10}(?:(?:\D*\d){3})?$)[\d-]+$/)
    .messages({
      "string.pattern.base": "Please provide a valid ISBN-10 or ISBN-13 number",
      "any.required": "ISBN is required",
    }),
  description: Joi.string().allow("").max(1000).trim().messages({
    "string.max": "Description cannot exceed 1000 characters",
  }),
  available_quantity: Joi.number()
    .integer()
    .required()
    .min(0)
    .default(1)
    .messages({
      "number.base": "Available quantity must be a number",
      "number.integer": "Available quantity must be a whole number",
      "number.min": "Available quantity cannot be negative",
      "any.required": "Available quantity is required",
    }),
  shelf_location: Joi.string().allow("").required().max(255).trim().messages({
    "string.max": "Shelf location cannot exceed 255 characters",
    "any.required": "Shelf location is required",
  }),
});

const bookUpdateSchema = Joi.object({
  title: Joi.string().min(1).max(255).trim().messages({
    "string.min": "Title cannot be empty",
    "string.max": "Title cannot exceed 255 characters",
  }),
  author: Joi.string().min(2).max(255).trim().messages({
    "string.min": "Author name must be at least 2 characters long",
    "string.max": "Author name cannot exceed 255 characters",
  }),
  ISBN: Joi.string()
    .pattern(/^(?=(?:\D*\d){10}(?:(?:\D*\d){3})?$)[\d-]+$/)
    .messages({
      "string.pattern.base": "Please provide a valid ISBN-10 or ISBN-13 number",
    }),
  description: Joi.string().allow("").max(1000).trim().messages({
    "string.max": "Description cannot exceed 1000 characters",
  }),
  available_quantity: Joi.number().integer().min(0).messages({
    "number.base": "Available quantity must be a number",
    "number.integer": "Available quantity must be a whole number",
    "number.min": "Available quantity cannot be negative",
  }),
  shelf_location: Joi.string().allow("").max(255).trim().messages({
    "string.max": "Shelf location cannot exceed 255 characters",
  }),
}).min(1); // At least one field must be provided for update

// Auth Schemas
const registerSchema = Joi.object({
  name: Joi.string().required().min(2).max(50).trim().messages({
    "string.min": "Name must be at least 2 characters long",
    "string.max": "Name cannot exceed 50 characters",
    "any.required": "Name is required",
  }),
  email: Joi.string().required().email().lowercase().trim().messages({
    "string.email": "Please provide a valid email address",
    "any.required": "Email is required",
  }),
  password: Joi.string()
    .required()
    .min(6)
    .max(50)
    .pattern(new RegExp("^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])"))
    .messages({
      "string.min": "Password must be at least 6 characters long",
      "string.max": "Password cannot exceed 50 characters",
      "string.pattern.base":
        "Password must contain at least one uppercase letter, one lowercase letter, and one number",
      "any.required": "Password is required",
    }),
});

const loginSchema = Joi.object({
  email: Joi.string().required().email().lowercase().trim().messages({
    "string.email": "Please provide a valid email address",
    "any.required": "Email is required",
  }),
  password: Joi.string().required().messages({
    "any.required": "Password is required",
  }),
});

const bookSearchSchema = Joi.object({
  title: Joi.string().trim().allow(""),
  author: Joi.string().trim().allow(""),
  ISBN: Joi.string().trim().allow(""),
}).or("title", "author", "ISBN");

// Borrowing Schemas
const borrowingSchema = Joi.object({
  book_id: Joi.number().integer().required().messages({
    "number.base": "Book ID must be a number",
    "any.required": "Book ID is required",
  }),
  return_date: Joi.date().greater("now").required().messages({
    "date.base": "Return date must be a valid date",
    "date.greater": "Return date must be in the future",
    "any.required": "Return date is required",
  }),
});

const returnBookSchema = Joi.object({
  borrowing_id: Joi.number().integer().required().messages({
    "number.base": "Borrowing ID must be a number",
    "any.required": "Borrowing ID is required",
  }),
});

// Borrower Update Schema
const borrowerUpdateSchema = Joi.object({
  name: Joi.string().min(2).max(50).trim().messages({
    "string.min": "Name must be at least 2 characters long",
    "string.max": "Name cannot exceed 50 characters",
  }),
  email: Joi.string().email().lowercase().trim().messages({
    "string.email": "Please provide a valid email address",
  }),
  password: Joi.string()
    .min(6)
    .max(50)
    .pattern(new RegExp("^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])"))
    .messages({
      "string.min": "Password must be at least 6 characters long",
      "string.max": "Password cannot exceed 50 characters",
      "string.pattern.base":
        "Password must contain at least one uppercase letter, one lowercase letter, and one number",
    }),
}).min(1); // At least one field must be provided for update

// Report Schemas
const reportSchema = Joi.object({
  report_type: Joi.string()
    .valid(
      "borrowing",
      "overdue",
      "inventory",
      "last_month_borrowing",
      "last_month_overdue"
    )
    .required()
    .messages({
      "any.only":
        "Report type must be one of: borrowing, overdue, inventory, last_month_borrowing, last_month_overdue",
      "any.required": "Report type is required",
    }),
  start_date: Joi.date()
    .when("report_type", {
      is: Joi.valid("last_month_borrowing", "last_month_overdue"),
      then: Joi.optional(),
      otherwise: Joi.required(),
    })
    .messages({
      "date.base": "Start date must be a valid date",
      "any.required": "Start date is required",
    }),
  end_date: Joi.date()
    .when("report_type", {
      is: Joi.valid("last_month_borrowing", "last_month_overdue"),
      then: Joi.optional(),
      otherwise: Joi.required(),
    })
    .messages({
      "date.base": "End date must be a valid date",
      "date.greater": "End date must be after start date",
      "any.required": "End date is required",
    }),
});

module.exports = {
  registerSchema,
  loginSchema,
  bookSchema,
  bookSearchSchema,
  borrowingSchema,
  returnBookSchema,
  borrowerUpdateSchema,
  reportSchema,
  bookUpdateSchema,
};
