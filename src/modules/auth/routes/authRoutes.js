const express = require("express");
const {
  registerSchema,
  loginSchema,
} = require("../../../shared/utils/validatorSchemas.js");
const validate = require("../../../shared/middleware/validate.js");
const AuthController = require("../controllers/authController.js");
const authentication = require("../../../shared/middleware/authentication.js");

const router = express.Router();

router.post("/register", validate(registerSchema), AuthController.register);

router.post("/login", validate(loginSchema), AuthController.login);

module.exports = router;
