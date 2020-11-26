const User = require("../models/user.model");
module.exports.postSignUp = async (req, res, next) => {
  var errors = [];
  if (req.body.userName.length >= 30) {
    errors.push("Username length cannot be longer than 30 chanracters.");
  }
  try {
    var user = User.findOne({ email: req.body.email });
  } catch (err) {
    console.log(err);
  }
  if (user) {
    errors.push("Email has been used by another user.");
  }
  if (errors.length) {
    res.render("./auth/signup", {
      errors: errors,
      values: req.body
    });
    return;
  }
  next();
};
