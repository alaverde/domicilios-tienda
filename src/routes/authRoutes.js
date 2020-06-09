const express = require("express");

const authController = require("../controllers/authController");
const validator = require("../middlewares/validator");

//Setup
const router = express.Router();

//Rutas
router.post(
  "/signup",
  validator.validateInputs(
    "email",
    "password",
    "passwordConfirm",
    "user_type",
    "names",
    "last_name",
    "address",
    "neighborhood",
    "mobile_phone"
  ),
  authController.signup
);
router.post(
  "/login",
  validator.validateInputs("email", "password"),
  authController.login
);
router.post(
  "/forgotpassword",
  validator.validateInputs("email"),
  authController.forgotPassword
);
router.post(
  "/resetPassword/:token",
  validator.validateInputs("password", "passwordConfirm"),
  authController.resetPassword
);

module.exports = router;
