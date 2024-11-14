const express = require("express");
const BookController = require("../controllers/bookController.js");
const limiter = require("../../../shared/middleware/rateLimiter.js");
const validate = require("../../../shared/middleware/validate.js");
const { bookSchema } = require("../../../shared/utils/validatorSchemas.js");

const router = express.Router();

router.post("/", limiter, validate(bookSchema), BookController.addBook);
router.put("/:id", validate(bookSchema), BookController.updateBook);
router.delete("/:id", BookController.deleteBook);
router.get("/", BookController.listBooks);
router.get("/search", BookController.searchBooks);

module.exports = router;
