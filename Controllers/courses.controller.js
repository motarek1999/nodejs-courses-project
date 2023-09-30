const { body, validationResult } = require("express-validator");
const statusText = require("../utilities/httpStatusText");
const Course = require("../models/course.model");
const asyncWrapper = require("../middlewares/asyncWrapper");
const appError = require("../utilities/appError");
const User = require('../models/users.model');

const getAllCourses = async (req, res) => {
  const query = req.query;

  const limit = query.limit || 10;
  const page = query.page;

  const skip = (page - 1) * limit;

  const courses = await Course.find(
    {},
    {
      __v: false,
    }
  )
    .limit(limit)
    .skip(skip);
  res.json({ status: statusText.SUCCESS, data: { courses } });
};

const getSingleCourse = asyncWrapper(async (req, res, next) => {
  const course = await Course.findById(req.params.courseId);
  if (!course) {
    const error = appError.create("Course not Found", 404, statusText.FAIL);
    return next(error);

    // return res
    //   .status(404)
    //   .json({ status: statusText.FAIL, data: { course: null } });
  }
  return res.json({ status: statusText.SUCCESS, data: { course: course } });
});

const createCourse = asyncWrapper(async (req, res, next) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    const error = appError.create(errors.array(), 400, statusText.FAIL);
    return next(error);
  }

  const newCourse = new Course(req.body);

  await newCourse.save();

  res
    .status(201)
    .json({ status: statusText.SUCCESS, data: { course: newCourse } });
});

const updateCourse = asyncWrapper(async (req, res) => {
  const courseId = req.params.courseId;
  const updatedCourse = await Course.updateOne(
    { _id: courseId },
    { $set: { ...req.body } }
  );

  return res
    .status(200)
    .json({ status: statusText.SUCCESS, data: { course: updatedCourse } });
});

const deleteCourse = asyncWrapper(
  async (req, res) => {

    await Course.deleteOne({ _id: req.params.courseId });

    res.status(200).json({ status: statusText.SUCCESS, data: null });
}
)

module.exports = {
  getAllCourses,
  getSingleCourse,
  createCourse,
  updateCourse,
  deleteCourse,
};
