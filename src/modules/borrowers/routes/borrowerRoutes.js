const express = require("express");
const BorrowerController = require("../controllers/borrowerController.js");
const authentication = require("../../../shared/middleware/authentication.js");
const authorization = require("../../../shared/middleware/authorization.js");
const validate = require("../../../shared/middleware/validate.js");
const { borrowerUpdateSchema } = require("../../../shared/utils/validatorSchemas.js");

const router = express.Router();

// Routes requiring authentication
router.get("/profile", authentication, BorrowerController.getProfile);
router.put(
    "/profile",
    authentication,
    validate(borrowerUpdateSchema),
    BorrowerController.updateProfile
);
router.get("/history", authentication, BorrowerController.getBorrowingHistory);

// Routes requiring admin authentication
router.get("/", authentication, authorization, BorrowerController.listBorrowers);
router.get("/:id", authentication, authorization, BorrowerController.getBorrower);
router.delete("/:id", authentication, authorization, BorrowerController.deleteBorrower);

module.exports = router;