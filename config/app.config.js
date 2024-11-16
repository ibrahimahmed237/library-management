const dotenv = require('dotenv');
dotenv.config();

module.exports = {
    port: process.env.PORT || 3030,
    JWT_SECRET: process.env.JWT_SECRET,
    JWT_EXPIRES_IN: '24h',
    rateLimitWindowMs: 15 * 60 * 1000, // 15 minutes
    rateLimitMaxRequests: 100, // max 100 requests per 15 minutes
};
