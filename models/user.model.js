const mongoose = require("mongoose");

var userSchema = new mongoose.Schema({
  userName: String,
  email: String,
  password: String,
  isAdmin: Boolean,
  avatarUrl: String,
  wrongLoginCount: Number,
  cart: [{ type: mongoose.Schema.ObjectId, ref: 'Book' }]
})

var User = mongoose.model("User", userSchema, "users");
module.exports = User;