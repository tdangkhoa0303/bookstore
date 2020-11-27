const User = require("../../models/user.model");

module.exports.requireAuth = async (req, res, next) => {
  if (!req.signedCookies.userId) {
    res.status(401).json({ success: false, error: "Unauthorized request" });
    return;
  }

  try {
    var user = await User.findOne({ _id: req.signedCookies.userId });
  } catch (err) {
    console.log(err);
  }

  if (!user) {
    res.status(401).json({ success: false, error: "Unauthorized request" });
    return;
  }
  next();
};
