const express = require("express");
const validator = require("../middlewares/validator");
const adminValidator = require("../middlewares/adminValidator");
const productValidator = require("../middlewares/productValidator");

const adminController = require("../controllers/adminController");
const productController = require("../controllers/productController");
const protectRoute = require("../middlewares/protectRoutes");

const router = express.Router();

router.use(protectRoute.verifyToken);
router.use(protectRoute.restrictTo("admin"));

router.get("/markets", adminController.getMarkets);
router.get("/marketsAuthRemain", adminController.getAutorizationRemaingingMarkets);
router.post("/authorize", adminValidator.validationMarketId, validator.checkResult,  adminController.authorize);
router.post("/override", adminValidator.validationMarketId, validator.checkResult,  adminController.override);
router.post("/deleteProduct", productValidator.validationId, validator.checkResult,  productController.delete);

module.exports = router;