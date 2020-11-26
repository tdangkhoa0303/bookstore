const bcrypt = require("bcrypt");
const sgMail = require("@sendgrid/mail");
const User = require("../models/user.model");

module.exports.signin = (req, res) => {
  res.render("../views/auth/signin");
};

module.exports.postSignIn = async (req, res, next) => {
  var email = req.body.email,
    password = req.body.password;
  try {
    var user = await User.findOne({ email: email });
  } catch (err) {
    console.log(err);
    next(err);
  }
  if (!user) {
    res.render("../views/auth/signin", {
      values: req.body,
      errors: ["This user does not exist."]
    });
    return;
  }

  if (user.wrongLoginCount >= 4) {
    res.render("../views/auth/signin", {
      values: req.body,
      errors: [
        "Cannot login. You have entered wrong password more than 4 times."
      ]
    });
    return;
  }
  var checkPassword = await bcrypt.compare(password, user.password);
  if (!checkPassword) {
    try {
      User.where(user).updateOne({
        wrongLoginCount: user.wrongLoginCount ? user.wrongLoginCount + 1 : 1
      });
    } catch (err) {
      console.log(err);
      next(err);
    }

    if (user.wrongLoginCount === 3) {
      sgMail.setApiKey(process.env.SENDGRID_API_KEY);

      const msg = {
        to: user.email,
        from: process.env.FROM_ADDRESS,
        subject: "Securce Alert",
        html:
          "<strong>Someone are trying to access your account. Please check your account to make sure it's stil safe.</strong>"
      };
      try {
        await sgMail.send(msg);
      } catch (error) {
        console.log(error);
      }
    }
    res.render("../views/auth/signin", {
      values: req.body,
      errors: ["Wrong password."]
    });
    return;
  }

  res.cookie("userId", user._id, {
    signed: true
  });
  res.redirect("/books");
};

module.exports.signUp = async (req, res) => {
  res.render("./auth/signup");
};

module.exports.postSignUp = async (req, res, next) => {
  var saltRounds = 10;
  req.body.password = await bcrypt.hash(req.body.password, saltRounds);
  req.body.isAdmin = false;
  req.body.avatarUrl =
    "https://cdn.glitch.com/aca73c48-f323-427a-a4d2-8951b055938d%2F57633af1-a357-4d7a-a693-a11426eee969.image.png?v=1589613113114";
  try {
    await User.create(req.body);
  } catch (err) {
    console.log(err);
    next(err);
  }

  res.redirect("/auth/signin");
};
