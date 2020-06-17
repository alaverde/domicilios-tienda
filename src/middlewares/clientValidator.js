const { body } = require("express-validator");
const CustomError = require("../utils/customError");

exports.getProductsValidator = () => [idValidator("idTienda")];

exports.cancelOrderValidator = () => [idValidator("idOrder")];

exports.createOrdersValidator = (req, res, next) => {
  let idProducts = [];
  let orderQuantity = [];
  for (order of req.body.orders){
    if(!validateAlphanumeric(order.idProduct) || !validateQuantity(order.quantity))
      return next(new CustomError("The id must be alphanumeric and the quantity only a positive number", 400));
    if(idProducts.includes(order.idProduct))
      return next(new CustomError("You cannot repeat the same product two or more times", 400));
    idProducts.push(order.idProduct);
    orderQuantity.push(order.quantity);
  }
  req.orders = {
    idProducts,
    orderQuantity
  }
  next();
};

const idValidator = (id) => body(id)
.notEmpty()
.withMessage(`You must provide ${id}`)
.isAlphanumeric()
.withMessage(`Invalid ${id}`)
.escape()
.trim()

const validateQuantity = (number) => {
  let r = new RegExp(/^[0-9]+$/);
  return r.test(number) && number>0;
};

const validateAlphanumeric = (text) => {
  let r = new RegExp(/^[a-zA-Z0-9]+$/);
  return r.test(text);
};