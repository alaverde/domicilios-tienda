const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: [true, "Provide your email"],
    unique: true,
  },
  password: {
    type: String,
    required: [true, "Provide your password"],
    minlength: [8, "Password must have 8 characters"],
  },
  user_type: {
    type: String,
    required: [true, "Must provide a user type"],
    enum: ["client", "shopkeeper"],
  },
  market_name: {
    type: String,
    required: false,
  },
  names: {
    type: String,
    required: [true, "You must provide a name"],
    minlength: [3, "Name must have 3 characters"],
    maxlength: [80, "Name must have less than 80 characters"],
  },
  last_name: {
    type: String,
    required: [true, "You must provide a last name"],
    minlength: [3, "The last name must have 3 characters"],
    maxlength: [80, "The last name must have less than 80 characters"],
  },
  address: {
    type: String,
    required: [true, "You must provide an address"],
    minlength: [10, "The address must have 10 characters"],
    maxlength: [200, "The address must have less than 200 characters"],
  },
  neighborhood: {
    type: String,
    required: [true, "You must provide a neighborhood"],
  },
  mobile_phone: {
    type: Number,
    required: [true, "You must provide a mobile phone"],
    minlength: [10, "The mobile phone must have 10 numbers"],
    maxlength: [10, "The mobile phone must have less than 10 numbers"],
  },
  service_capacity: {
    type: Number,
    min: [1, "The capacity must be at least 1"],
    max: [100, "The capacity must be less than 100"],
    required: false,
  },
  market_state: {
    type: String,
    enum: ["unauthorized", "authorized"],
    required: false,
  },
  passwordResetToken: {
    type: String,
    required: false,
  },
  passwordResetExpires: {
    type: Date,
    required: false,
  },
});

const User = mongoose.model("user", userSchema);

module.exports = User;
