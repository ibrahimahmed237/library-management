const dotenv = require('dotenv');
dotenv.config();

module.exports = {
    port: process.env.PORT || 3000,
    jwtSecret: process.env.JWT_SECRET,
    tokenExpiry: '1h',
    rateLimitWindowMs: 15 * 60 * 1000, // 15 minutes
    rateLimitMaxRequests: 100, // max 100 requests per 15 minutes
};
