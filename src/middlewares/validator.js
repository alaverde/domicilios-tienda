const { body } = require("express-validator");
const CustomErrorJson = require("../utils/customErrorJson");
const { validationResult } = require("express-validator");

exports.checkResult = (req, res, next) =>{
  const result = validationResult(req);

  if(!result.isEmpty())
      return next(new CustomErrorJson("Some errors encountered", result.errors, 400));

  next();
};

exports.validatorSanitizer = (fieldName) => {
  return body(fieldName)
    .trim()
    .stripLow()
    .escape();
}

exports.existsValidator = (fieldName, extraMessage = "") => {
  return body(fieldName)
    .exists()
    .withMessage(`You must provide ${fieldName} ${extraMessage}`)
    .notEmpty()
    .withMessage(`You must provide ${fieldName} ${extraMessage}`)
}

exports.numericValidator = (fieldName) => {
  return body(fieldName)
    .isNumeric()
    .withMessage(`${fieldName} must be numeric`);
}

exports.zeroNegativeValidator = (value)=> {
  if(value <= 0)
      return Promise.reject("");

  return value;
}

exports.idValidator = (fieldName, extraMessage) => {
  return [
    this.validatorSanitizer(fieldName),
    this.existsValidator(fieldName, extraMessage),
  ];
}