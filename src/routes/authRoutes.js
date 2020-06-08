const express = require("express");

const authController = require("../controllers/authController");

//Setup
const router = express.Router();

//Rutas
router.post("/signup", authController.signup);
router.post("/login", authController.login);
router.post("/forgotpassword", authController.forgotPassword);
router.patch("/resetPassword/:token", authController.resetPassword);

module.exports = router;
