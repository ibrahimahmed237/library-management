const Joi = require("joi");

// Book validation schema
const bookSchema = Joi.object({
  title: Joi.string().required().trim(),
  author: Joi.string().required().trim(),
  ISBN: Joi.string().required().trim(),
  available_quantity: Joi.number().integer().min(0).required(),
  description: Joi.string().allow(null, "").trim(),
  shelf_location: Joi.string().required().trim(),
});

// Borrower validation schema
const borrowerSchema = Joi.object({
  name: Joi.string().required().trim(),
  email: Joi.string().email().required().trim(),
  password: Joi.string().min(8).required(),
});


module.exports = { bookSchema, borrowerSchema };
