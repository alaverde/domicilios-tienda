const User = require("../models/userModel");
const CatchError = require("../utils/catchError");

exports.getMarkets = CatchError(async (req, res, next) => {
  
  const markets = await User.find({user_type: { $eq: 'shopkeeper' }});

  res.status(200).json({
    markets
  });
});

exports.getAutorizationRemaingingMarkets = CatchError(async (req, res, next) => {
  
  const markets = await User.find({
    user_type: { $eq: 'shopkeeper' },
    market_state: { $eq: 'unauthorized'}
  });

  res.status(200).json({
    markets
  });
});

exports.authorize = CatchError(async (req, res, next) => {
  const idMarket = req.body.id;

  let market = await User.findById(idMarket);
  market.market_state = "authorized";

  const marketUpdate = await User.findByIdAndUpdate(idMarket, market);

  res.status(200).json({
    result: true,
    message: "Market successfully authorized",
  });
});

exports.override = CatchError(async (req, res, next) => {
  const idMarket = req.body.id;

  let market = await User.findById(idMarket);
  market.market_state = "unauthorized";

  const marketUpdate = await User.findByIdAndUpdate(idMarket, market);

  res.status(200).json({
    result: true,
    message: "Market successfully override",
  });
});