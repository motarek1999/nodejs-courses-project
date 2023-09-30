const express = require("express");
const router = express.Router();
const multer = require("multer");
const appError = require("../utilities/appError");
const statusText = require("../utilities/httpStatusText");

const diskStorage = multer.diskStorage({
  destination: function (req, file, cb) {
    console.log("File", file);
    cb(null, "uploads");
  },
  filename: function (req, file, cb) {
    const ext = file.mimetype.split("/")[1];
    const fileName = `user-${Date.now()}.${ext}`;
    cb(null, fileName);
  },
});

const fileFilter = (req, file, cb) => {
  const imgType = file.mimetype.split("/")[0];
  if (imgType === "image") {
    return cb(null, true);
  } else {
    return cb(
      appError.create("File must be an image", 400, statusText.FAIL),
      false
    );
  }
};

const upload = multer({
  storage: diskStorage,
  fileFilter,
});
const usersController = require("../Controllers/users.controller");
const verifyToken = require("../middlewares/verifyToken");

// Get All Users
router.route("/").get(verifyToken, usersController.getAllUsers);

// Register
router
  .route("/register")
  .post(upload.single("avatar"), usersController.register);

// Login
router.route("/login").post(usersController.login);

module.exports = router;
