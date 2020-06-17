const { body, param } = require("express-validator");

exports.validatorLogin = ()=>[emailValidator,
    passwordValidator];

exports.validatorSignUp = () => [emailValidator,
  passwordValidator,
  passwordConfirmValidator,
  nameValidator("names"),
  nameValidator("last_name"),
  addressValidator,
  nameValidator("neighborhood"),
  mobilePhoneValidator,
  userTypeValidator,
  marketNameValidator,
  serviceCapacityValidator];

exports.validatorForgotPassword = () => [emailValidator];

exports.validatorResetPassword = () => [passwordValidator,
  passwordConfirmValidator,
  resetTokenValidator];

const emailValidator = body("email")
.notEmpty()
.withMessage("email can not be empty")
.bail()
.isEmail()
.withMessage("Invalid email")
.bail()
.escape()
.trim();

const passwordValidator = body("password")
.notEmpty()
.withMessage("password can not be empty")
.bail()
.matches(/^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z]).{8,}$/)
.withMessage("Password must contain 8 characters, one uppercase, one lowercase and one number")
.bail()
.escape()
.trim()

const passwordConfirmValidator = body('passwordConfirm')
.exists()
.withMessage("passwordConfirm can not be empty")
.bail()
.custom((value, { req }) => value === req.body.password)
.withMessage("passwordConfirm field must have the same value as the password field")

const nameValidator = (input) => body(input)
.notEmpty()
.withMessage(`${input} can not be empty`)
.bail()
.matches(/^[a-zA-ZÀ-ú]+(([',. -][a-zA-ZÀ-ú])?[a-zA-ZÀ-ú]*)*$/)
.withMessage(`Invalid ${input}`)
.bail()
.escape()
.trim();

const addressValidator = body("address")
.notEmpty()
.withMessage("address can not be empty")
.bail()
.escape()
.trim();

const mobilePhoneValidator = body("mobile_phone")
.notEmpty()
.withMessage("mobile phone can not be empty")
.bail()
.matches(/^3[0-9]{9}$/)
.withMessage("Invalid mobile phone")
.bail()

const resetTokenValidator = param("token")
.notEmpty()
.withMessage("You must provide a token on params")
.bail()
.isAlphanumeric()
.withMessage("Invalid token")
.escape()
.trim();

const userTypeValidator = body("user_type")
.notEmpty()
.withMessage("user type can not be empty")
.bail()
.custom((value)=> value==="client" || value==="shopkeeper")
.withMessage("The user only can be type client or shopkeeper")

const marketNameValidator = body("market_name")
.if(({ req }) => req.body.user_type === "shopkeeper")
.notEmpty()
.withMessage("You must provide a market name")
.bail()
.matches(/^[a-zA-ZÀ-ú]+(([',. -][a-zA-ZÀ-ú])?[a-zA-ZÀ-ú]*)*$/)
.withMessage("Invalid market name")
.escape()
.trim();

const serviceCapacityValidator = body("service_capacity")
.if((value, { req }) => req.body.user_type === "shopkeeper")
.notEmpty()
.withMessage("You must provide a service capacity")
.bail()
.isInt()
.withMessage("The service capacity must be an integer")
.custom((value)=> value=>1 && value<=100)
.withMessage("The service capacity must be a number between 1 and 100")