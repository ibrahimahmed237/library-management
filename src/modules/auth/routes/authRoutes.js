const express = require("express");
const {
  registerSchema,
  loginSchema,
} = require("../../../shared/utils/validatorSchemas.js");
const validate = require("../../../shared/middleware/validate.js");
const AuthController = require("../controllers/authController.js");
const limiter = require("../../../shared/middleware/rateLimiter.js");

const router = express.Router();

router.post(
  "/register",
  validate(registerSchema),
  limiter,
  AuthController.register
);

router.post("/login", validate(loginSchema), limiter, AuthController.login);

module.exports = router;
