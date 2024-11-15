const express = require("express");
const { borrowerSchema } = require("../../../shared/utils/validatorSchemas.js");
const validate = require("../../../shared/middleware/validate.js");

const router = express.Router();

router.post("/signup", validate(borrowerSchema), )
router.post("/login", )
router.post("/logout", )

module.exports = router;
