const { promisify } = require("util");
const jwt = require("jsonwebtoken");

const catchError = require("../utils/catchError");
const CustomError = require("../utils/customError");
const User = require("../models/userModel");

exports.verifyToken = catchError(async (req, res, next) => {
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  )
    token = req.headers.authorization.split(" ")[1];

  if (!token) return next(new CustomError("You are not logged in", 401));

  const decoded = await promisify(jwt.verify)(token, process.env.JWT_KEY);

  const currentUser = await User.findById(decoded.id).select("-password");

  if (!currentUser)
    return next(
      new CustomError("The user belonging to this token doesn't exist", 401)
    );

  req.user = currentUser;

  next();
});

exports.restrictTo = (...types) => {
  return (req, res, next) => {
    if (!types.includes(req.user.user_type)) {
      return next(
        new CustomError("You don't have permission to perform this action", 403)
      );
    }
    next();
  };
};
