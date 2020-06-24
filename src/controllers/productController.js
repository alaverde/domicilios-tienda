const Product = require("../models/productModel");
const CatchError = require("../utils/catchError");

exports.add = CatchError(async (req, res, next) => {
  const product = req.body;
  product.userId = req.user._id;

  await Product.create(product);

  res.status(200).json({
    result: true,
    message: "New product created successfully",
  });
});

exports.get = CatchError(async (req, res, next) => {
  const idProduct = req.body.id;

  const product = await Product.findById(idProduct);

  res.status(200).json(product);
});

exports.getList = CatchError(async (req, res, next) => {
  const idUserMarket = req.body.id;

  const products = await Product.find({ userId: { $eq: idUserMarket } });

  res.status(200).json(products);
});

exports.update = CatchError(async (req, res, next) => {
  const product = req.body;

  const updateProduct = await Product.findByIdAndUpdate(product.id, product);

  res.status(200).json({
    result: true,
    message: "Product updated successfully",
  });
});

exports.delete = CatchError(async (req, res, next) => {
  const idProduct = req.body.id;

  const deleteProduct = await Product.findByIdAndDelete(idProduct);

  res.status(200).json({
    result: true,
    message: "Product deleted successfully",
  });
});
