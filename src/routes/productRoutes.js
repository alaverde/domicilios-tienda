const express = require("express");

const productController = require("../controllers/productController");
const protectRoute = require("../middlewares/protectRoutes");

const router = express.Router();
router.use(protectRoute.verifyToken);
router.post("/add", productController.add);
router.get("/get", productController.get);
router.get("/getList", productController.getList);
router.post("/update", productController.update);
router.post("/delete", productController.delete);

module.exports = router;
