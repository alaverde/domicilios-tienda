const express = require("express");

const protectRoute = require("../middlewares/protectRoutes");
const userController = require("../controllers/clientController");
const validator = require("../middlewares/validator");

//Setup
const router = express.Router();

//Rutas
router.use(protectRoute.verifyToken);
router.use(protectRoute.restrictTo("client"));

router.get(
  "/shops",
  validator.validateInputs("neighborhood"),
  userController.getShops
);
router.get(
  "/products",
  validator.validateInputs("idTienda"),
  userController.getProducts
);

module.exports = router;
