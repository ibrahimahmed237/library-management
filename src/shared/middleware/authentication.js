const AuthService = require("../../modules/auth/services/authService.js");
const appError = require("../utils/appError.js");

const authentication = async (req, res, next) => {
  try {
    const token = req.header("Authorization")?.replace("Bearer ", "");
    if (!token) {
      next(new appError("Please authenticate.", 401));
    }

    const borrower = await AuthService.verifyToken(token);
    
    req.borrower = borrower;
    req.token = token;
    next();
  } catch (error) {
    next(new appError("Please authenticate.", 401));
  }
};

module.exports = authentication;
