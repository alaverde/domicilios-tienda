const express = require("express");
const validator = require("../middlewares/validator");
const productValidator = require("../middlewares/productValidator");

const productController = require("../controllers/productController");
const protectRoute = require("../middlewares/protectRoutes");

const router = express.Router();
router.use(protectRoute.verifyToken);

router.post("/add", productValidator.validationAdd, validator.checkResult, productController.add);
router.get("/get", productValidator.validationId, validator.checkResult, productController.get);
router.get("/getList",productValidator.validationGetList, validator.checkResult, productController.getList);
router.post("/update", productValidator.validationUpdate, validator.checkResult, productController.update);
router.post("/delete", productValidator.validationId, validator.checkResult,  productController.delete);

module.exports = router;
