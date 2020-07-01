const User = require("../models/userModel");
const Product = require("../models/productModel");
const CatchError = require("../utils/catchError");
const CustomError = require("../utils/customError");
const Orders = require("../models/orderModel");

exports.getShops = CatchError(async (req, res, next) => {
  const shops = await User.find({
    user_type: {
      $eq: "shopkeeper"
    },
    neighborhood: {
      $eq: req.user.neighborhood
    },
    market_state: {
      $eq: "authorized"
    }
  }).select("market_name address");

  res.status(200).json({
    shops
  });
});

exports.getProducts = CatchError(async (req, res, next) => {
  const {
    idTienda
  } = req.body;

  let products = await Product.find({
    userId: {
      $eq: idTienda
    }
  }).populate({
    path: 'userId',
    match: {
      neighborhood: req.user.neighborhood
    },
    select: '_id'
  });

  if (products.length === 0)
    res.status(200).json({
      message: 'The store is empty'
    });
  else {
    if (!products[0].userId)
      return next(new CustomError('This store does not have coverage in your area', 400));

    res.status(200).json({
      products
    });
  }
});

exports.makeOrders = CatchError(async (req, res, next) => {
  const {
    idProducts,
    orderQuantity
  } = req.orders;

  //Find all the products
  const products = await Product.find().where('_id').in(idProducts);

  if (products.length < idProducts.length)
    res.status(400).json({
      message: 'Failed to find all specified products'
    })
  else {
    //Separate the products per shop
    let ordersPerShop = new Map();

    for (let i = 0; i < products.length; i++) {
      //Check if the quantity is available
      if (products[i].quantity < orderQuantity[i]) {
        const err = `The quantity requested for ${products[i].name} is not available`;
        return next(new CustomError(err));
      }
      //Create a key for the map with the Id of the shop
      let key = products[i].userId.toString();

      if (ordersPerShop.has(key)) {
        //Get the products requested for a specific shop
        let orderShop = ordersPerShop.get(key);

        orderShop["total"] = orderShop["total"] + products[i].unitPrice * orderQuantity[i];

        let productsArray = orderShop["products"];

        productsArray.push({
          "order": products[i]._id,
          "quantity": orderQuantity[i]
        });
      } else {
        ordersPerShop.set(key, {
          "shop": key,
          "products": [{
            "order": products[i]._id,
            "quantity": orderQuantity[i]
          }],
          "total": products[i].unitPrice * orderQuantity[i]
        });
      }
    }

    //Check if shop can register more orders
    //Get All Shops
    const shopsIds = Array.from(ordersPerShop.keys());
    const shops = await User.find().where('_id').in(shopsIds);

    //Get Shops Orders And Verify The Capacity
    for (let i = 0; i < shops.length; i++) {
      const ordersPerShop = await Orders.find({
        vendor: {
          $eq: shops[i]._id
        },
        state: {
          $eq: 'created'
        }
      });
      if (ordersPerShop.length >= shops[i].service_capacity) {
        return next(new CustomError(`The store ${shops[i].market_name} has exceeded the maximum capacity`));
      }
    }

    //Saving new quantity per product
    for (let i = 0; i < products.length; i++) {
      products[i].quantity = products[i].quantity - orderQuantity[i];
      await products[i].save();
    }

    //Create orders for each shop
    ordersPerShop.forEach(async (el) => {
      await Orders.create({
        "client": req.user._id,
        "vendor": el.shop,
        "orders": el.products,
        "total_price": el.total
      })
    });

    res.status(200).json({
      "message": "Orders created successfully"
    });
  }
})

exports.getOrders = CatchError(async (req, res, next) => {
  const orders = await Orders.find().where('client').equals(req.user._id)
    .populate({
      path: 'vendor',
      select: 'market_name address mobile_phone'
    })
    .populate({
      path: 'orders',
      populate: {
        path: 'order',
        select: 'name unitPrice'
      }
    });

  res.status(200).json({
    orders
  });
})

exports.cancelOrder = CatchError(async (req, res, next) => {
  const {
    idOrder
  } = req.body;
  const order = await Orders.findById(idOrder).where('client').equals(req.user._id);
  if (!order)
    res.status(422).json({
      message: "Order not found"
    })
  else {
    if (order.state !== "created")
      res.status(422).json({
        message: "You cannot cancel an order that has already been accepted or canceled"
      })
    else {
      order.state = "canceled";
      await order.save();
      res.status(200).json({
        message: "order canceled successfully"
      })
    }
  }
})