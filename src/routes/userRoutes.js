const express = require("express");

const protectRoute = require("../middlewares/protectRoutes");
const userController = require("../controllers/userController");

//Setup
const router = express.Router();

//Rutas
router.use(protectRoute.verifyToken);

router.get(
  "/me",
  protectRoute.restrictTo("admin", "shopkeeper"),
  userController.getMe
);

module.exports = router;
