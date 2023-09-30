const express = require("express");
const { body } = require("express-validator");
const router = express.Router();
const coursesFuncs = require("../Controllers/courses.controller");
const { validationSchema } = require("../middlewares/validationSchema");
const verifyToken = require("../middlewares/verifyToken");
const allowedToDelete = require("../middlewares/allowedTo");
const userRoles = require("../utilities/usersRoles");

router
  .route("/")
  .get(coursesFuncs.getAllCourses)
  .post(
    verifyToken,
    allowedToDelete(userRoles.MANAGER),
    validationSchema(),
    coursesFuncs.createCourse
  );

router
  .route("/:courseId")
  .get(coursesFuncs.getSingleCourse)
  .patch(coursesFuncs.updateCourse)
  .delete(
    verifyToken,
    allowedToDelete(userRoles.ADMIN, userRoles.MANAGER),
    coursesFuncs.deleteCourse
  );

module.exports = router;
