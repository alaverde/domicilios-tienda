const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema({
  client: {
    type: mongoose.Schema.ObjectId,
    ref: "user",
    required: [true, "You must provide client id"],
    unique: false,
  },
  vendor: {
    type: mongoose.Schema.ObjectId,
    ref: "user",
    required: [true, "You must provide client id"],
    unique: false,
  },
  date: {
    type: Date,
    default: Date.now(),
    required: [true, "You must provide the actual time"],
  },
  state: {
    type: String,
    enum: ["created", "accepted", "canceled"],
    default: "created",
    required: [true, "You must provide the state of the order"],
  },
  total_price: {
    type: Number,
    required: [true, "You must provide the total price"],
  },
});

const Order = mongoose.model("order", orderSchema);

module.exports = Order;
