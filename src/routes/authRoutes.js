const express = require("express");

const authController = require("../controllers/authController");

//Setup
const router = express.Router();

//Rutas
router.post("/signup", authController.signup);
router.post("/login", authController.login);

module.exports = router;
