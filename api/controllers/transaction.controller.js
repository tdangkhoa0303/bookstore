const Transaction = require("../../models/transaction.model");
const User = require("../../models/user.model");
const mongoose = require("mongoose");
const Book = require("../../models/book.model");

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
    success: true,
    data: {
      transactions: transactions,
      maxPageNum: Math.round(count / perPage),
      currentPage: page,
      perPage: perPage,
    },
  });
};

module.exports.createTransactions = async (req, res) => {
  var userId = req.signedCookies.userId;
  try {
    var user = await User.findOne({ _id: userId })
      .populate("cart")
      .select("cart");
    // user.cart.map(
    //   async (book) => await Transaction.create({ user: userId, book: book })
    // );

    await Promise.all(
      user.cart.map((book) => Transaction.create({ user: userId, book: book }))
    );

    await User.findOne({ _id: userId }).updateOne({
      cart: [],
    });
  } catch (err) {
    console.log(err);
    res.json({ success: false, message: err.message });
    return;
  }
  res.json({ success: true });
};

module.exports.completeTransaction = async (req, res) => {
  var transactionId = req.params.id;
  try {
    var transaction = await Transaction.findOne({ _id: transactionId });
    if (!transaction) {
      res.redirect("/transactions");
      return;
    }

    await Transaction.where({ _id: transactionId }).updateOne({
      isComplete: true,
    });

    const book = await Book.findById(transaction.book);
    if (book.type !== "giveaway") {
      await Book.findByIdAndUpdate(transaction.book, {
        available: true,
      });
    }
  } catch (err) {
    console.log(err);
    res.json({ success: false, message: err.message });
    return;
  }
  res.json({ success: true, data: { transaction } });
};
