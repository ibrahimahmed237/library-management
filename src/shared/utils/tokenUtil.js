// shared/utils/tokenUtil.js
const jwt = require('jsonwebtoken');
const config = require('../../config/app.config.js');

const generateToken = (payload) => {
    return jwt.sign(payload, config.jwtSecret, { expiresIn: config.tokenExpiry });
};

module.exports = { generateToken };
