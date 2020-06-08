const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const { promisify } = require("util");
const crypto = require("crypto");

const User = require("../models/userModel");
const catchError = require("../utils/catchError");
const CustomError = require("../utils/customError");
const validator = require("../utils/validators");
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

const correctPassword = async (candidatePassword, userPassword) =>
  await bcrypt.compare(candidatePassword, userPassword);

const createPasswordResetToken = (user) => {
  const resetToken = crypto.randomBytes(32).toString("hex");

  user.passwordResetToken = crypto
    .createHash("sha256")
    .update(resetToken)
    .digest("hex");

  user.passwordResetExpires = Date.now() + 10 * 60 * 1000;

  return resetToken;
};

const sendResetToken = async (user, message, res, next) => {
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
    passwordConfirm,
    user_type,
    names,
    last_name,
    address,
    neighborhood,
    mobile_phone,
  } = req.body;

  if (
    !email ||
    !password ||
    !passwordConfirm ||
    !names ||
    !last_name ||
    !address ||
    !neighborhood ||
    !mobile_phone ||
    !user_type
  )
    return next(
      new CustomError(
        "You must provide email, password, passwordConfirm, names, last name, address, neighborhood, mobile phone and user type",
        400
      )
    );

  const validEmail = validator.validateEmail(email);
  const validPassword = validator.validatePassword(password);
  const validConfirm = password === passwordConfirm;
  const validNames = validator.validateName(names);
  const validLastName = validator.validateName(last_name);
  const validMobileNumber = validator.validateMobileNumber(mobile_phone);

  if (
    validEmail &&
    validPassword &&
    validConfirm &&
    validNames &&
    validLastName &&
    validMobileNumber
  ) {
    switch (user_type) {
      case "client":
        const passwordEncripted = await bcrypt.hash(password, 12);

        const newUser = await User.create({
          email,
          password: passwordEncripted,
          names,
          last_name,
          address,
          neighborhood,
          mobile_phone,
          user_type,
        });

        sendToken(newUser, 201, res);
        break;

      case "shopkeeper":
        const { market_name, service_capacity } = req.body;

        if (!market_name || !service_capacity)
          return next(
            new CustomError(
              "You must provide a market name and a service capacity",
              400
            )
          );

        const validMarketName = validator.validateName(market_name);

        if (validMarketName) {
          const passwordEncripted = await bcrypt.hash(password, 12);

          const newUser = await User.create({
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

          sendToken(newUser, 201, res);
        } else return next(new CustomError("Invalid market name", 400));
        break;

      default:
        return next(
          new CustomError("Users only can be clients or shopkeepers", 400)
        );
        break;
    }
  } else {
    if (!validEmail) return next(new CustomError("Invalid email", 400));
    else if (!validPassword)
      return next(
        new CustomError(
          "Password must have eight characters, one number, one lowercase and one uppercase",
          400
        )
      );
    else if (!validConfirm)
      return next(new CustomError("Passwords must match", 400));
    else if (!validNames) return next(new CustomError("Invalid name", 400));
    else if (!validLastName)
      return next(new CustomError("Invalid last name", 400));
    else if (!validMobileNumber)
      return next(new CustomError("Invalid mobile number", 400));
  }
});

exports.login = catchError(async (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password)
    return next(new CustomError("You must provide email and password", 400));

  const validEmail = validator.validateEmail(email);
  const validPassword = validator.validatePassword(password);

  if (validEmail && validPassword) {
    const user = await User.findOne({ email }).select("+password");

    if (!user || !(await correctPassword(password, user.password)))
      return next(new CustomError("Email or password invalid", 400));

    sendToken(user, 200, res);
  } else {
    if (!validEmail) return next(new CustomError("Invalid email", 400));

    if (!validPassword)
      return next(
        new CustomError(
          "Password must have eight characters, one number, one lowercase and one uppercase",
          400
        )
      );
  }
});

exports.protect = catchError(async (req, res, next) => {
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    token = req.headers.authorization.split(" ")[1];
  }

  if (!token) {
    return next(new CustomError("You are not logged in", 401));
  }

  const decoded = await promisify(jwt.verify)(token, process.env.JWT_KEY);

  const currentUser = await User.findById(decoded.id).select("-password");
  if (!currentUser) {
    return next(
      new CustomError("The user belonging to this token doesn't exist", 401)
    );
  }

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

exports.forgotPassword = catchError(async (req, res, next) => {
  if (!validator.validateEmail(req.body.email))
    return next(new CustomError("Invalid email", 404));

  const user = await User.findOne({ email: req.body.email });

  if (!user)
    return next(
      new CustomError("There is no user with that email address", 404)
    );

  const resetToken = createPasswordResetToken(user);
  await user.save({ validateBeforeSave: false });

  const resetURL = `${req.protocol}://${req.get(
    "host"
  )}/api/v1/users/resetPassword/${resetToken}`;

  const message = `Forgot password? submit PATCH request with your new password and passwordConfirm to ${resetURL}. If you don't forget your password, ignore this email.`;

  await sendResetToken(user, message, res, next);
});

// exports.resetPassword = catchAsync(async (req, res, next) => {
//   //1) Get user based on the token
//   const hashedToken = crypto
//     .createHash("sha256")
//     .update(req.params.token)
//     .digest("hex");

//   const user = await User.findOne({
//     passwordResetToken: hashedToken,
//     passwordResetExpires: { $gt: Date.now() },
//   });
//   // 2) if token has no expire and there is user, set new password
//   if (!user) {
//     return next(new AppError("Token is invalid or has expired", 400));
//   }
//   user.password = req.body.password;
//   user.passwordConfirm = req.body.passwordConfirm;
//   user.passwordResetToken = undefined;
//   user.passwordResetExpires = undefined;
//   await user.save();
//   // 3) update changePasswordAt property of user
//   // 4) log the user in send JWT
//   createSendToken(user, 200, res);
// });
