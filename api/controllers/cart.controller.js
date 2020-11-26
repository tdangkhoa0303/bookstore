const User = require("../../models/user.model");
const Session = require("../../models/session.model");

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

    res.json({ success: true, response: user.cart });
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

  res.json({ success: true, response: session.cart });
};

module.exports.addToCart = async (req, res) => {
  var bookId = req.params.bookId;
  var userId = req.signedCookies.userId;
  if (userId) {
    try {
      var user = await User.where({ _id: userId }).updateOne({
        $push: { cart: bookId }
      });
    } catch (err) {
      console.log(err);
      res.json({ success: false, errors: [err] });
      return;
    }
    res.json({ success: true, response: user.cart });
  }
  var sessionId = req.signedCookies.sessionId;
  if (!sessionId) {
    res.status(401).send("Unauthorized request");
    return;
  }

  try {
    var session = await Session.where({ _id: sessionId }).updateOne({
      $push: { cart: bookId }
    });
  } catch (err) {
    console.log(err);
    res.json({ success: false, errors: [err] });
    return;
  }
  res.json({ success: true, response: session.cart });
};
