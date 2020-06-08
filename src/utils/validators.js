const catchError = require("../utils/catchError");
const CustomError = require("../utils/customError");

exports.validateEmail = (email) => {
  let r = new RegExp(
    /^([a-zA-Z0-9_\-\.]+)@([a-zA-Z0-9_\-\.]+)\.([a-zA-Z]{2,5})$/
  );
  return r.test(email);
};

exports.validatePassword = (password) => {
  let r = new RegExp(/^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z]).{8,}$/);
  return r.test(password);
};

exports.validateName = (name) => {
  let r = new RegExp(/^[a-zA-ZÀ-ú]+(([',. -][a-zA-ZÀ-ú])?[a-zA-ZÀ-ú]*)*$/);
  return r.test(name);
};

exports.validateMobileNumber = (number) => {
  let r = new RegExp(/^3[0-9]{9}$/);
  return r.test(number);
};
