const Transaction = require("../models/transaction.model");
const User = require("../models/user.model");

module.exports.index = async (req, res, next) => {
  var userId = req.signedCookies.userId;
  var page = parseInt(req.query.page) || 1;
  var perPage = 4;
  var transactions = await Transaction.find({ user: userId })
    .populate("book")
    .limit(perPage)
    .skip(perPage * (page - 1))
    .sort("_id");
  try {
    var count = await Transaction.countDocuments({ user: userId });
  } catch (err) {
    console.log(err);
    next(err);
  }

  res.render("transactions/index", {
    transactions: transactions,
    maxPageNum: Math.round(count / perPage),
    currentPage: page,
    perPage: perPage
  });
};

module.exports.createTransactions = async (req, res, next) => {
  var userId = req.signedCookies.userId;
  try {
    var user = await User.findOne({ _id: userId })
      .populate("cart")
      .select("cart");
    user.cart.forEach(
      async book => await Transaction.create({ user: userId, book: book })
    );
    await User.findOne({ _id: userId }).updateOne({ cart: [] });
  } catch (err) {
    console.log(err);
    next(err);
  }
  res.redirect("/transactions");
};

module.exports.completeTransaction = async (req, res, next) => {
  var transactionId = req.params.id;
  try {
    var transaction = await Transaction.findOne({ _id: transactionId });
    if (!transaction) {
      res.redirect("/transactions");
      return;
    }

    await Transaction.where({ _id: transactionId }).updateOne({
      isComplete: true
    });
  } catch (err) {
    console.log(err);
    next(err);
  }
  res.redirect("/transactions");
};
