const express = require("express");

const authController = require('../controllers/authController');
const productController = require('../controllers/productController');

const router = express.Router();
router.use(authController.protect);
router.post("/add", productController.add);
router.get("/get", productController.get);
router.get("/getList", productController.getList);
router.post("/update", productController.update);
router.post("/delete", productController.delete);

module.exports = router;