const cloudinary = require("cloudinary").v2;
const User = require("../models/user.model");

module.exports.index = async (req, res, next) => {
  try {
    var user = await User.findOne({ _id: req.signedCookies.userId });
  } catch (err) {
    console.log(err);
    next(err);
  }
  res.render("./profile/index", { user: user });
};

module.exports.updateAvatar = async (req, res, next) => {
  try {
    var user = await User.findOne({ _id: req.signedCookies.userId });
  } catch (err) {
    console.log(err);
    next(err);
  }
  res.render("./profile/avatar", { user: user });
};

module.exports.postProfile = async (req, res, next) => {
  try {
    var user = await User.where({ _id: req.signedCookies.userId }).updateOne(
      req.body
    );
  } catch (err) {
    console.log(err);
    next(err);
  }
  res.redirect("/profile");
};

module.exports.postAvatar = async (req, res) => {
  var path = req.file.path;
  var result;
  try {
    result = await cloudinary.uploader.upload(path, {
      folder: "Coders-x/Avatars/"
    });
  } catch (err) {
    res.send(err);
    return;
  }
  await User.findOne({ _id: req.signedCookies.userId }).updateOne({
    avatarUrl: result.secure_url
  });
  const fs = require("fs");
  fs.unlinkSync(path);
  res.redirect("/profile");
};
