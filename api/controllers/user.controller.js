const shortid = require("shortid");
const bcrypt = require("bcrypt");
const User = require("../../models/user.model");

module.exports.index = async (req, res) => {
  var q = req.query.q;
  try {
    var users = await User.find({
      userName: { $regex: q ? q : "", $options: "i" },
    });
  } catch (err) {
    console.log(err);
    res.json({ success: false, message: err.message });
    return;
  }
  res.json({ success: true, response: users });
};

module.exports.getUser = (req, res) => {
  const user = req.user;
  if (!user)
    return res.status(404).json({ success: false, message: "No information" });
  res.status(200).json({ success: true, data: { user } });
};

module.exports.editUser = async (req, res) => {
  var id = req.params.id;
  try {
    var user = await User.where({ _id: id }).update({
      userName: req.body.userName,
    });
  } catch (err) {
    console.log(err);
    res.json({ success: false, message: err.message });
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
    res.json({ success: false, message: err.message });
    return;
  }
  res.json({ success: true, response: user });
};
