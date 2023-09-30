const asyncWrapper = require("../middlewares/asyncWrapper");
const User = require("../models/users.model");
const appError = require("../utilities/appError");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const generatingJWT = require("../utilities/generateJWT");

const statusText = require("../utilities/httpStatusText");

const getAllUsers = asyncWrapper(async (req, res) => {
  const query = req.query;

  const limit = query.limit || 10;

  const page = query.page;

  const skip = (page - 1) * limit;

  const users = await User.find(
    {},
    {
      __v: false,
      password: false,
    }
  )
    .limit(limit)
    .skip(skip);

  res.json({ status: statusText.SUCCESS, data: { users } });
});

const register = asyncWrapper(async (req, res, next) => {
  const { firstName, lastName, email, password, role } = req.body;

  const oldUser = await User.findOne({ email: email });

  if (oldUser) {
    const error = appError.create("User already exists", 400, statusText.FAIL);
    return next(error);
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const avatarPath = req.file.filename;

  const newUser = new User({
    firstName,
    lastName,
    email,
    password: hashedPassword,
    role,
    avatar: avatarPath,
  });

  const token = await generatingJWT({
    id: newUser._id,
    email: newUser.email,
    role: newUser.role,
  });

  newUser.token = token;

  await newUser.save();

  res.status(201).json({
    status: statusText.SUCCESS,
    data: {
      user: newUser,
    },
  });
});

const login = asyncWrapper(async (req, res, next) => {
  const { email, password } = req.body;

  if (!email && !password) {
    const error = appError.create(
      "Please provide email and password",
      400,
      statusText.FAIL
    );
    return next(error);
  }

  const user = await User.findOne({ email: email });

  if (!user) {
    const error = appError.create("User not found", 400, statusText.FAIL);
    return next(error);
  }

  const matchedPassword = await bcrypt.compare(password, user.password);

  if ((user, matchedPassword)) {
    const token = await generatingJWT({
      id: user._id,
      email: user.email,
      role: user.role,
    });

    return res.json({
      status: statusText.SUCCESS,
      data: {
        token: token,
      },
    });
  } else {
    const error = appError.create("Incorrect password", 400, statusText.FAIL);
    return next(error);
  }
});

module.exports = {
  getAllUsers,
  register,
  login,
};
