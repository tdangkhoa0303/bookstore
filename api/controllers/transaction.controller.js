const Transaction = require("../../models/transaction.model");
const User = require("../../models/user.model");
const mongoose = require("mongoose");

module.exports.index = async (req, res) => {
  var userId = req.signedCookies.userId;
  var page = parseInt(req.query.page) || 1;
  var perPage = 4;
  try {
    var transactions = await Transaction.find({ user: userId })
      .populate("book")
      .limit(perPage)
      .skip(perPage * (page - 1))
      .sort("_id");
    var count = await Transaction.countDocuments({ user: userId });
  } catch (err) {
    res.json({ success: false, message: err.message });
    return;
  }
  var start = (page - 1) * perPage;
  var end = page * perPage;

  res.json({
    succes: true,
    transactions: transactions,
    maxPageNum: Math.round(count / perPage),
    currentPage: page,
    perPage: perPage,
  });
};

module.exports.createTransactions = async (req, res) => {
  var userId = req.signedCookies.userId;
  try {
    var user = await User.findOne({ _id: userId })
      .populate("cart")
      .select("cart");
    user.cart.forEach(
      async (book) => await Transaction.create({ user: userId, book: book })
    );
    var transaction = await User.findOne({ _id: userId }).updateOne({
      cart: [],
    });
  } catch (err) {
    console.log(err);
    res.json({ success: false, errors: [err] });
    return;
  }
  res.json({ success: true, response: transaction });
};

module.exports.completeTransaction = async (req, res) => {
  var transactionId = req.params.id;
  try {
    var transaction = await Transaction.findOne({ _id: transactionId });
    if (!transaction) {
      res.redirect("/transactions");
      return;
    }

    var transaction = await Transaction.where({ _id: transactionId }).updateOne(
      {
        isComplete: true,
      }
    );
  } catch (err) {
    console.log(err);
    res.json({ success: false, errors: [err] });
    return;
  }
  res.json({ success: true, response: transaction });
};
