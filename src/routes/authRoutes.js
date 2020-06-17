const express = require("express");

const authController = require("../controllers/authController");
const validator = require("../middlewares/validator");
const authValidator = require("../middlewares/authValidator");

//Setup
const router = express.Router();

//Routes
router.post(
  "/signup",
  authValidator.validatorSignUp(),
  validator.checkResult,
  authController.signup
);
router.post(
  "/login",
  authValidator.validatorLogin(),
  validator.checkResult,
  authController.login
);
router.post(
  "/forgotpassword",
  authValidator.validatorForgotPassword(),
  validator.checkResult,
  authController.forgotPassword
);
router.post(
  "/resetPassword/:token",
  authValidator.validatorResetPassword(),
  validator.checkResult,
  authController.resetPassword
);

module.exports = router;
