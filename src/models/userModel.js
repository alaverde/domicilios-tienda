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
    minlength: [8, "Must have 8 characters"],
  },
});

const User = mongoose.model("user", userSchema);

module.exports = User;
