const cloudinary = require("cloudinary").v2;
const User = require("../../models/user.model");

module.exports.index = async (req, res) => {
  try {
    var user = await User.findOne({ _id: req.signedCookies.userId });
  } catch (err) {
    console.log(err);
    res.json({ success: false, errors: [err] });
    return;
  }
  res.json({ success: true, response: user });
};

module.exports.postProfile = async (req, res) => {
  try {
    var user = await User.where({ _id: req.signedCookies.userId }).updateOne(
      req.body
    );
  } catch (err) {
    console.log(err);
    res.json({ success: false, errors: [err] });
    return;
  }
  res.json({ success: true, response: user });
};

module.exports.postAvatar = async (req, res) => {
  var path = req.file.path;
  var result;
  try {
    result = await cloudinary.uploader.upload(path, {
      folder: "Coders-x/Avatars/"
    });
  } catch (err) {
    res.json({ success: false, errors: [err] });
    return;
  }
  await User.findOne({ _id: req.signedCookies.userId }).updateOne({
    avatarUrl: result.secure_url
  });
  const fs = require("fs");
  fs.unlinkSync(path);
  res.json({ success: true, response: result.secure_url });
};
