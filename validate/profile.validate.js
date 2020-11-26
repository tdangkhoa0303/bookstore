const User = require("../models/user.model")
module.exports.postProfile = async (req, res, next) => {
  var errors = [];
  if (req.body.userName.length >= 30) {
    errors.push("Username length cannot be longer than 30 chanracters.");
  }
  try{
    var user = User.findOne({ email: req.body.email });
  }catch(err){
    console.log(err);
  }
  if (user && user._id !== req.signedCookies.userId) {
    errors.push("Email has been used by another user.");
  }
  if (errors.length) {
    res.render("./profile", {
      errors: errors,
      values: req.body
    });
    return;
  }
  next();
};

