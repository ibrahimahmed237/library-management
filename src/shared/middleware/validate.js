
const appError = require("../utils/appError.js");
const debug = require("debug")("app:validate");
const validate = (schema) => (req, res, next) => {
    const { error, value } = schema.validate(req.body);
    if (error) {
        debug(error);
        return next(new appError(error.details[0].message, 400));
    }
    req.body = value;
    next();
};

module.exports = validate;
