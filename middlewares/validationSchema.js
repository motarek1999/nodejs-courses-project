const { body , validationResult } = require("express-validator");

const validationSchema = () => {
  return [
    body("title")
      .notEmpty()
      .withMessage("Title is Required")
      .isLength({ min: 2 })
      .withMessage("Title must be 2 digits at least"),
    body("price").notEmpty().withMessage("Price is Required"),
  ];
};

module.exports = { validationSchema };