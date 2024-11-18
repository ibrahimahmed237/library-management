const express = require("express");
const BorrowingController = require("../controllers/borrowingController.js");
const authentication = require("../../../shared/middleware/authentication.js");
const limiter = require("../../../shared/middleware/rateLimiter.js");
const validate = require("../../../shared/middleware/validate.js");
const { borrowingSchema, returnBookSchema } = require("../../../shared/utils/validatorSchemas.js");

const router = express.Router();

router.post(
    "/checkout",
    authentication,
    limiter,
    validate(borrowingSchema),
    BorrowingController.checkoutBook
);

router.post(
    "/return",
    authentication,
    limiter,
    validate(returnBookSchema),
    BorrowingController.returnBook
);

router.get(
    "/checked-out",
    authentication,
    BorrowingController.getCheckedOutBooks
);

router.get(
    "/overdue",
    authentication,
    BorrowingController.getOverdueBooks
);

module.exports = router;