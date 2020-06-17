const express = require("express");

const protectRoute = require("../middlewares/protectRoutes");
const clientController = require("../controllers/clientController");
const validator = require("../middlewares/validator");
const clientValidator = require("../middlewares/clientValidator");

//Setup
const router = express.Router();

//Routes
router.use(protectRoute.verifyToken);
router.use(protectRoute.restrictTo("client"));

router.get(
  "/shops",
  clientController.getShops
);

router.get(
  "/products",
  clientValidator.getProductsValidator(),
  validator.checkResult,
  clientController.getProducts
);

router.post(
  "/order", 
  clientValidator.createOrdersValidator,
  clientController.makeOrders);

router.get(
  "/orders/me", 
  clientController.getOrders);

router.post(
  "/cancelorder",
  clientValidator.cancelOrderValidator(),
  validator.checkResult,
  clientController.cancelOrder);

module.exports = router;
