const CustomErrorJson = require("../utils/customError");
const { validationResult} = require("express-validator");

exports.checkResult = (req, res, next) =>{
  const result = validationResult(req);

  if(!result.isEmpty())
      return next(new CustomErrorJson("Some errors encountered", result.errors, 400));

  next();
};