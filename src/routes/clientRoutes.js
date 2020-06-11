const express = require("express");

const protectRoute = require("../middlewares/protectRoutes");
const clientController = require("../controllers/clientController");
const validator = require("../middlewares/validator");

//Setup
const router = express.Router();

//Routes
router.use(protectRoute.verifyToken);
router.use(protectRoute.restrictTo("client"));

router.get(
  "/shops",
  validator.validateInputs("neighborhood"),
  clientController.getShops
);

router.get(
  "/products",
  validator.validateInputs("idTienda"),
  clientController.getProducts
);

router.post("/order", validator.validateInputs("orders"), clientController.makeOrders);

router.get("/orders/me", clientController.getOrders);

router.post("/cancelorder",validator.validateInputs("idOrder"), clientController.cancelOrder);

module.exports = router;
