const express = require("express");
const BorrowingController = require("../controllers/borrowingController.js");
const authentication = require("../../../shared/middleware/authentication.js");
const authorization = require("../../../shared/middleware/authorization.js");
const validate = require("../../../shared/middleware/validate.js");
const { borrowingSchema, returnBookSchema } = require("../../../shared/utils/validatorSchemas.js");

const router = express.Router();

router.post(
    "/checkout",
    authentication,
    validate(borrowingSchema),
    BorrowingController.checkoutBook
);

router.post(
    "/return",
    authentication,
    validate(returnBookSchema),
    BorrowingController.returnBook
);

router.get(
    "/my-books",
    authentication,
    BorrowingController.getBorrowerBooks
);

router.get(
    "/overdue",
    authentication,
    BorrowingController.getOverdueBooks
);

module.exports = router;