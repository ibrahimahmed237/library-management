const AuthService = require("../services/authService");
const appError = require("../../../shared/utils/appError");
const debug = require("debug")("app:authController");
class AuthController {
  async register(req, res, next) {
    try {
      const { borrower, token } = await AuthService.register(req.body);
      res.status(201).json({
        status: "success",
        data: {
          borrower,
          token,
        },
      });
    } catch (error) {
      next(new appError(error.message, 400));
    }
  }

  async login(req, res, next) {
    try {
      const { email, password } = req.body;
      const { borrower, token } = await AuthService.login(email, password);
      res.status(200).json({
        status: "success",
        data: {
          borrower,
          token,
        },
      });
    } catch (error) {
      next(new appError(error.message, 401));
    }
  }
}

module.exports = new AuthController();
