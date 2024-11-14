
const appError = require("../utils/appError.js");

const validate = (schema) => (req, res, next) => {
    const { error, value } = schema.validate(req.body);
    if (error) {
        return next(new appError(error.details[0].message, 400));
    }
    req.body = value;
    next();
};

module.exports = validate;
