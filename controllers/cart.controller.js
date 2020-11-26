const User = require("../models/user.model");
const Session = require("../models/session.model");

module.exports.index = async (req, res, next) => {
  var cart;
  var userId = req.signedCookies.userId;
  if (userId) {
    try {
      var user = await User.findOne({ _id: userId })
        .populate("cart")
        .select("cart");
    } catch (err) {
      console.log(err);
      next(err);
    }

    res.render("./cart/index", {
      cartItems: user.cart
    });
    return;
  }

  var sessionId = req.signedCookies.sessionId;

  if (!sessionId) {
    res.render("/books");
    return;
  }

  try {
    var session = await Session.findOne({ _id: sessionId })
      .populate("cart")
      .select("cart");
  } catch (err) {
    console.log(err);
    next(err);
  }

  res.render("./cart/index", {
    cartItems: session.cart
  });
};

module.exports.addToCart = async (req, res, next) => {
  var bookId = req.params.bookId;
  var userId = req.signedCookies.userId;
  if (userId) {
    try {
      await User.where({ _id: userId }).updateOne({ $push: { cart: bookId } });
    } catch (err) {
      console.log(err);
      next(err);
    }
    res.redirect("/books");
    return;
  }
  var sessionId = req.signedCookies.sessionId;
  if (!sessionId) {
    res.redirect("/books");
    return;
  }

  Session.where({ _id: sessionId }).updateOne({ $push: { cart: bookId } });
  res.redirect("/books");
};
