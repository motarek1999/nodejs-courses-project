const appError = require("../utilities/appError");
const statusText = require("../utilities/httpStatusText");

const allowedToDelete = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.currentUser.role)) {
      const error = appError.create(
        "You do not have permission to perform this action",
        401,
        statusText.FAIL
      );
      return next(error);
    }
    next();
  };
};
module.exports = allowedToDelete;
