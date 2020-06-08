const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const { promisify } = require("util");

const User = require("../models/userModel");
const catchError = require("../utils/catchError");
const CustomError = require("../utils/customError");
const validator = require("../utils/validators");

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
