const mongoose = require("mongoose");

var transactionSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  book: { type: mongoose.Schema.Types.ObjectId, ref: 'Book' },
  isComplete: Boolean
})

var Transaction = mongoose.model("Transaction", transactionSchema, "transactions");
module.exports = Transaction;