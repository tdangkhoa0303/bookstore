const mongoose = require("mongoose");

var sessionSchema = new mongoose.Schema({
  cart: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Book' }]
})

var Session = mongoose.model("Session", sessionSchema, "sessions");
module.exports = Session;