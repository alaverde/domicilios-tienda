const CustomError = require("../utils/customError");

exports.validateInputs = (...inputs) => (req, res, next) => {
  for (i of inputs) {
    const input = req.body[i];

    if (!input) return next(new CustomError(`The ${i} can't be null`, 404));

    switch (i) {
      case "email":
        if (!validateEmail(input))
          return next(new CustomError("Invalid email", 404));
        break;

      case "password":
        if (!validatePassword(input))
          return next(
            new CustomError(
              "Password must have eight characters, one number, one lowercase and one uppercase",
              400
            )
          );
        break;

      case "passwordConfirm":
        if (!(input === req.body.password))
          return next(new CustomError("Passwords must be equals", 400));
        break;

      case "user_type":
        switch (input) {
          case "client":
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

            if (!validateNames(market_name))
              return next(new CustomError("Invalid market name", 400));

            if (!validateOnlyNumbers(service_capacity))
              return next(new CustomError("Invalid service capacity", 400));
            break;

          default:
            return next(
              new CustomError(
                "The user only can be type client or shopkeeper",
                400
              )
            );
        }
        break;

      case "names":
        if (!validateNames(input))
          return next(new CustomError("Invalid user names", 400));
        break;

      case "last_name":
        if (!validateNames(input))
          return next(new CustomError("Invalid user last name", 400));
        break;

      case "address":
        break;

      case "neighborhood":
        if (!validateNames(input))
          return next(new CustomError("Invalid neighborhood", 400));
        break;

      case "mobile_phone":
        if (!validateMobileNumber(input))
          return next(new CustomError("Invalid mobile number", 400));
        break;

      case "idTienda":
        if (!validateAlphanumeric(input))
          return next(new CustomError("Invalid id", 400));
        break;
    }
  }
  next();
};

const validateEmail = (email) => {
  let r = new RegExp(
    /^([a-zA-Z0-9_\-\.]+)@([a-zA-Z0-9_\-\.]+)\.([a-zA-Z]{2,5})$/
  );
  return r.test(email);
};

const validatePassword = (password) => {
  let r = new RegExp(/^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z]).{8,}$/);
  return r.test(password);
};

const validateNames = (name) => {
  let r = new RegExp(/^[a-zA-ZÀ-ú]+(([',. -][a-zA-ZÀ-ú])?[a-zA-ZÀ-ú]*)*$/);
  return r.test(name);
};

const validateMobileNumber = (number) => {
  let r = new RegExp(/^3[0-9]{9}$/);
  return r.test(number);
};

const validateOnlyNumbers = (number) => {
  let r = new RegExp(/^[0-9]+$/);
  return r.test(number);
};

const validateAlphanumeric = (text) => {
  let r = new RegExp(/^[a-zA-Z0-9]+$/);
  return r.test(text);
};
