const User = require("../../models/user.model");

module.exports = async (req, res, next) => {
  try {
    var user = await User.findOne({ _id: req.signedCookies.userId });
  } catch (err) {
    console.log(err);
  }
  res.locals.user = user;
  req.user = user;
  if (!(user && user.isAdmin)) {
    res.status(401).json({
      success: false,
      message: "You cannot access this page.",
    });
    return;
  }
  next();
};
