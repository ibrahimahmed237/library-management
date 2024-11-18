const express = require("express");
const BookController = require("../controllers/bookController.js");
const limiter = require("../../../shared/middleware/rateLimiter.js");
const validate = require("../../../shared/middleware/validate.js");
const {
  bookSchema,
  bookUpdateSchema,
} = require("../../../shared/utils/validatorSchemas.js");
const authentication = require("../../../shared/middleware/authentication.js");
const authorization = require("../../../shared/middleware/authorization.js");

const router = express.Router();

router.post(
  "/",
  authentication,
  authorization,
  validate(bookSchema),
  BookController.addBook
);

router.put(
  "/:id",
  authentication,
  authorization,
  validate(bookUpdateSchema),
  BookController.updateBook
);

router.delete("/:id", authentication, authorization, BookController.deleteBook);
router.get("/", BookController.listBooks);
router.get("/search", limiter, BookController.searchBooks);

module.exports = router;
