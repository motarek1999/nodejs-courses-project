const jwt = require("jsonwebtoken");
const statusText = require("../utilities/httpStatusText");
const appError = require("../utilities/appError");

const verifyToken = (req, res, next) => {
  const authHeader =
    req.headers["Authorization"] || req.headers["authorization"];

  if (!authHeader) {
    const error = appError.create("Token is Required", 401, statusText.ERROR);
    return next(error);
  }


  const token = authHeader.split(" ")[1];

  try {
    const currentUser = jwt.verify(token, process.env.JWT_SECRET);
    console.log(currentUser);
    req.currentUser = currentUser;
    next();
  } catch (err) {
    const error = appError.create("Invalid Token", 401, statusText.ERROR);
    return next(error);
  }
};

module.exports = verifyToken;
