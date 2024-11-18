const express = require("express");
const ReportingController = require("../controllers/reportingController.js");
const authentication = require("../../../shared/middleware/authentication.js");
const validate = require("../../../shared/middleware/validate.js");
const { reportSchema } = require("../../../shared/utils/validatorSchemas.js");
const limiter = require("../../../shared/middleware/rateLimiter.js");

const router = express.Router();

router.post(
  "/generate",
  authentication,
  limiter,
  validate(reportSchema),
  ReportingController.generateReport
);

router.get("/statistics", authentication, ReportingController.getStatistics);

module.exports = router;
