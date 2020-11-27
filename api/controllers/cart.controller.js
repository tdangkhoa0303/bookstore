const User = require("../../models/user.model");
const Session = require("../../models/session.model");
const Book = require("../../models/book.model");

const ObjectId = require("mongoose").Types.ObjectId;

module.exports.index = async (req, res) => {
  var cart;
  var userId = req.signedCookies.userId;
  if (userId) {
    try {
      var user = await User.findOne({ _id: userId })
        .populate("cart")
        .select("cart");
    } catch (err) {
      console.log(err);
      res.json({ success: false, errors: [err] });
      return;
    }

    res.json({ success: true, data: { cart: user.cart } });
    return;
  }

  var sessionId = req.signedCookies.sessionId;

  if (!sessionId) {
    res.status(401).send("Unauthorized request");
    return;
  }

  try {
    var session = await Session.findOne({ _id: sessionId })
      .populate("cart")
      .select("cart");
  } catch (err) {
    console.log(err);
    res.json({ success: false, errors: [err] });
    return;
  }

  res.json({ success: true, data: { cart: session.cart } });
};

module.exports.addToCart = async (req, res) => {
  var bookId = req.params.bookId;
  var userId = req.signedCookies.userId;
  try {
    if (userId) {
      const user = await User.findByIdAndUpdate(userId, {
        $push: { cart: bookId },
      })
        .populate("cart")
        .select("cart");
      console.log(user.cart.length);
      res.json({ success: true, data: { cart: user.cart } });
    } else {
      var sessionId = req.signedCookies.sessionId;
      if (!sessionId) {
        res.status(401).json({
          success: false,
          message: "Unauthorized request",
        });
      }

      const session = await Session.findByIdAndUpdate(sessionId, {
        $push: { cart: bookId },
      })
        .populate("cart")
        .select("cart");

      res.json({ success: true, data: { cart: session.cart } });
    }
  } catch (err) {
    console.log(err);
    return res.json({ success: false, message: err.message });
  }

  await Book.findByIdAndUpdate(bookId, {
    available: false,
  });
};

module.exports.removeFromCart = async (req, res) => {
  var bookId = req.params.bookId;
  var userId = req.signedCookies.userId;
  try {
    if (userId) {
      const user = await User.findByIdAndUpdate(userId, {
        $pull: { cart: ObjectId(bookId) },
      })
        .populate("cart")
        .select("cart");
      res.json({ success: true, data: { cart: user.cart } });
    } else {
      var sessionId = req.signedCookies.sessionId;
      if (!sessionId) {
        res.status(401).json({
          success: false,
          message: "Unauthorized request",
        });
      }

      const session = await Session.findByIdAndUpdate(sessionId, {
        $pull: { cart: ObjectId(bookId) },
      })
        .populate("cart")
        .select("cart");
      res.json({ success: true, data: { cart: session.cart } });
    }
  } catch (err) {
    console.log(err);
    return res.json({ success: false, message: err.message });
  }

  await Book.findByIdAndUpdate(bookId, {
    available: true,
  });
};
