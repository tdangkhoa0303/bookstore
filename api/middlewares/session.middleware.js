const mongoose = require("mongoose");
const User = require("../../models/user.model");
const Session = require("../../models/session.model");

module.exports = async (req, res, next) => {
  try {
    if (!req.signedCookies.sessionId) {
      var sessionId = new mongoose.Types.ObjectId();
      res.cookie("sessionId", sessionId, {
        signed: true
      });
      await Session.create({ _id: sessionId });
    }

    if (req.signedCookies.userId) {
      var user = await User.findOne({ _id: req.signedCookies.userId });
      res.locals.user = user;
    }
  } catch (err) {
    console.log(err);
  }
  next();
};
