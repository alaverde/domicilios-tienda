const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.ObjectId,
    ref: "user",
    required: [true, "Provide user market id"],
    unique: false,
  },
  name: {
    type: String,
    required: [true, "Provide product name"],
    maxlength: [100, "Name exceed max Length 100 characters"],
    unique: true,
  },
  image: {
    type: String,
    required: false,
  },
  unitPrice: {
    type: Number,
    required: [true, "Provide product unit price"],
  },
  quantity: {
    type: Number,
    required: [true, "Provide product quantity"],
    min: 1,
  },
});

const Product = mongoose.model("product", productSchema);

module.exports = Product;
