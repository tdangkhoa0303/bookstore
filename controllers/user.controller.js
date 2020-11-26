const User = require("../models/user.model");

module.exports.index = async (req, res, next) => {
  if (req.query.q) {
    var q = req.query.q;
    try {
      var users = await User.find({ userName: { $regex: q, $options: "i" } });
    } catch (err) {
      console.log(err);
      next(err);
    }
    res.render("./users/index", {
      users: users
    });
    return;
  }
  try {
    var users = await User.find();
  } catch (err) {
    console.log(err);
    next(err);
  }
  res.render("./users/index", {
    users: users
  });
};

module.exports.getEditUser = async (req, res, next) => {
  var id = req.params.id;
  try {
    var user = await User.find({ _id: id });
  } catch (err) {
    console.log(err);
    next(err);
  }
  res.render("./users/edit", {
    user: user
  });
};

module.exports.editUser = async (req, res, next) => {
  var id = req.params.id;
  try {
    await User.where({ _id: id }).update({ userName: req.body.userName });
  } catch (err) {
    console.log(err);
    next(err);
  }
  res.redirect("/users");
};

module.exports.deleteUser = async (req, res, next) => {
  var id = req.params.id;
  try {
    await User.deleteOne({ _id: id });
  } catch (err) {
    console.log(err);
    next(err);
  }
  res.redirect("/users");
};
