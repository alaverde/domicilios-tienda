const User = require("../models/userModel");
const Product = require("../models/productModel");
const CatchError = require("../utils/catchError");
const CustomError = require("../utils/customError");

exports.getShops = CatchError(async (req, res, next) => {
  const { neighborhood } = req.body;

  const shops = await User.find({
    user_type: { $eq: "shopkeeper" },
    neighborhood: { $eq: neighborhood }
  }).select("market_name address");

  res.status(200).json({ shops });
});

exports.getProducts = CatchError(async (req, res, next) => {
  const { idTienda } = req.body;

  let products = await Product.find({
    userId: { $eq: idTienda }
  }).populate({path:'userId',
  match:{
    neighborhood:req.user.neighborhood
  },
  select: '_id'
  });

  if(products.length === 0) res.status(200).json({ message:'The store is empty' });
  else {
    if(!products[0].userId) return next(new CustomError('This store does not have coverage in your area',400));

  // products = products.filter(function(product) {
  //   return product.userId;
  // });

    res.status(200).json({ products });
  }
});