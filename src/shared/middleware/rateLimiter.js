// shared/middleware/rateLimiter.js
const rateLimit = require("express-rate-limit");
const {
  rateLimitWindowMs,
  rateLimitMaxRequests,
} = require("../../../config/app.config.js");
const limiter = rateLimit({
  windowMs: rateLimitWindowMs,
  max: rateLimitMaxRequests,
  message: "Too many requests from this IP, please try again later.",
});

module.exports = limiter;
