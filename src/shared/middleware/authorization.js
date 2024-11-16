const appError = require("../utils/appError");

const authorization = (req, res, next) => {
  if (!req.borrower.isAdmin) {
    return next(
      new appError("You are not authorized to access this route.", 403)
    );
  }
  next();
};

module.exports = authorization;
