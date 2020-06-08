const express = require("express");

const authController = require("../controllers/authController");
const userController = require("../controllers/userController");

//Setup
const router = express.Router();

//Rutas
router.use(authController.protect);

router.get(
  "/me",
  authController.restrictTo("admin", "shopkeeper"),
  userController.getMe
);

module.exports = router;
