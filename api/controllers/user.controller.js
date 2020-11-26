const shortid = require("shortid");
const bcrypt = require("bcrypt");
const User = require("../../models/user.model");

module.exports.index = async (req, res) => {
  var q = req.query.q;
  try {
    var users = await User.find({
      userName: { $regex: q ? q : "", $options: "i" }
    });
  } catch (err) {
    console.log(err);
    res.json({ success: false, errors: [err] });
    return;
  }
  res.json({ success: true, response: users });
};

module.exports.editUser = async (req, res) => {
  var id = req.params.id;
  try {
    var user = await User.where({ _id: id }).update({
      userName: req.body.userName
    });
  } catch (err) {
    console.log(err);
    res.json({ success: false, errors: [err] });
    return;
  }
  res.json({ success: true, response: user });
};

module.exports.deleteUser = async (req, res) => {
  var id = req.params.id;
  try {
    var user = await User.deleteOne({ _id: id });
  } catch (err) {
    console.log(err);
    res.json({ success: false, errors: [err] });
    return;
  }
  res.json({ success: true, response: user });
};
