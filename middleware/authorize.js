const { AppError } = require('../utils');

exports.authorize =
  (...roles) =>
  (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return next(
        new AppError(
          `role ${req.user.role} is not authorized to access this route`,
          403
        )
      );
    }
    next();
  };
