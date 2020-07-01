const CatchError = require("../utils/catchError");
const Orders = require("../models/orderModel");

exports.getOrders = CatchError(async (req, res, next) => {
  const orders = await Orders.find({
    vendor: {
      $eq: req.user._id
    }
  });
  res.status(200).json({
    orders
  });
});

exports.getOneOrder = CatchError(async (req, res, next) => {
  const order = await Orders.findById(req.body.idOrder);
  if (order.vendor.equals(req.user._id)) {
    res.status(200).json({
      order
    });
  } else {
    res.status(400).json({
      message: "This order does not belong to your store"
    });
  }
});

exports.cancelOrder = CatchError(async (req, res, next) => {
  const {
    idOrder
  } = req.body;

  const order = await Orders.findById(idOrder);

  if (!order) {
    res.status(400).json({
      message: "This order does not exist"
    });
  } else if (!order.vendor.equals(req.user._id)) {
    res.status(400).json({
      message: "This order does not belong to your store"
    });
  } else if (order.state === "canceled") {
    res.status(400).json({
      message: "This order is already canceled"
    });
  } else {
    order.state = "canceled";
    order.save();

    res.status(200).json({
      message: "Order canceled"
    });
  }
});

exports.acceptOrder = CatchError(async (req, res, next) => {
  const {
    idOrder
  } = req.body;

  const order = await Orders.findById(idOrder);

  if (!order) {
    res.status(400).json({
      message: "This order does not exist"
    });
  } else if (!order.vendor.equals(req.user._id)) {
    res.status(400).json({
      message: "This order does not belong to your store"
    });
  } else if (order.state !== "created") {
    res.status(400).json({
      message: "This order has already been accepted or canceled"
    });
  } else {
    order.state = "accepted";
    order.save();

    res.status(200).json({
      message: "Order accepted"
    });
  }
});