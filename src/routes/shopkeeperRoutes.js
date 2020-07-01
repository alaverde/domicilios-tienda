const express = require('express');

const protectRoute = require("../middlewares/protectRoutes");
const validator = require("../middlewares/validator");
const shopkeeperController = require("../controllers/shopkeeperController");
const clientValidator = require("../middlewares/clientValidator");

//Setup
const router = express.Router();

//Routes
router.use(protectRoute.verifyToken);
router.use(protectRoute.restrictTo("shopkeeper"));

router.get('/orders', shopkeeperController.getOrders);
router.get('/order',
  clientValidator.showOrderValidator(),
  validator.checkResult,
  shopkeeperController.getOneOrder);

router.post('/cancelOrder',
  clientValidator.cancelOrderValidator(),
  validator.checkResult,
  shopkeeperController.cancelOrder);

router.post('/acceptOrder',
  clientValidator.cancelOrderValidator(),
  validator.checkResult,
  shopkeeperController.acceptOrder);

module.exports = router;