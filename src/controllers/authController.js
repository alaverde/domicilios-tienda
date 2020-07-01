const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const crypto = require("crypto");

const User = require("../models/userModel");
const catchError = require("../utils/catchError");
const CustomError = require("../utils/customError");
const sendEmail = require("../utils/sendEmail");

const createToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_KEY, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });
};

const sendToken = (user, statusCode, res) => {
  const token = createToken(user._id);
  user.password = undefined;
  res.status(statusCode).json({
    status: "success",
    token,
    user,
  });
};

const comparePasswords = async (candidatePassword, userPassword) =>
  await bcrypt.compare(candidatePassword, userPassword);

const createResetToken = (user) => {
  const resetToken = crypto.randomBytes(32).toString("hex");

  user.passwordResetToken = crypto
    .createHash("sha256")
    .update(resetToken)
    .digest("hex");

  user.passwordResetExpires = Date.now() + 10 * 60 * 1000;

  return resetToken;
};

const sendEmailWithResetToken = async (user, message, res, next) => {
  try {
    await sendEmail({
      email: user.email,
      subject: "Your password reset token (valid 10 min)",
      message,
    });
    res.status(200).json({
      status: "success",
      message: "Token sent to email",
    });
  } catch (err) {
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;
    await user.save({ validateBeforeSave: false });

    return next(
      new CustomError(
        "There was an error sending the email. Try again later",
        500
      )
    );
  }
};

exports.signup = catchError(async (req, res, next) => {
  const {
    email,
    password,
    user_type,
    names,
    last_name,
    address,
    neighborhood,
    mobile_phone,
  } = req.body;

  const passwordEncripted = await bcrypt.hash(password, 12);

  switch (user_type) {
    case "client":
      newUser = await User.create({
        email,
        password: passwordEncripted,
        names,
        last_name,
        address,
        neighborhood,
        mobile_phone,
        user_type,
      });
      break;

    case "shopkeeper":
      const { market_name, service_capacity } = req.body;
      newUser = await User.create({
        email,
        password: passwordEncripted,
        names,
        last_name,
        address,
        neighborhood,
        mobile_phone,
        user_type,
        market_name,
        service_capacity,
        market_state: "unauthorized",
      });
      break;
  }
  sendToken(newUser, 201, res);
});

exports.login = catchError(async (req, res, next) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email }).select("+password");

  if (!user || !(await comparePasswords(password, user.password)))
    return next(new CustomError("User don't found with this credentials", 400));

  sendToken(user, 200, res);
});

exports.removeUser = catchError(async(req, res, next) => {
  const idUser = req.body.id;

  const removedUser = await User.findByIdAndDelete(idUser);

  res.status(200).json({
    result: true,
    message: "User removed successfully",
  });
});

exports.forgotPassword = catchError(async (req, res, next) => {
  const user = await User.findOne({ email: req.body.email });

  if (!user)
    return next(
      new CustomError("There is no user with that email address", 404)
    );

  const resetToken = createResetToken(user);
  await user.save({ validateBeforeSave: false });

  const resetURL = `${req.protocol}://${req.get(
    "host"
  )}/api/auth/resetPassword/${resetToken}`;

  const message = `Forgot password? submit POST request with your new password and passwordConfirm to ${resetURL}. If you don't forget your password, ignore this email.`;

  await sendEmailWithResetToken(user, message, res, next);
});

exports.resetPassword = catchError(async (req, res, next) => {
  const hashedToken = crypto
    .createHash("sha256")
    .update(req.params.token)
    .digest("hex");

  const user = await User.findOne({
    passwordResetToken: hashedToken,
    passwordResetExpires: { $gt: Date.now() },
  });

  if (!user)
    return next(new CustomError("Token is invalid or has expired", 400));

  const passwordEncripted = await bcrypt.hash(req.body.password, 12);
  user.password = passwordEncripted;
  user.passwordResetToken = undefined;
  user.passwordResetExpires = undefined;
  await user.save();

  sendToken(user, 200, res);
});
