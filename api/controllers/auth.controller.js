const bcrypt = require("bcrypt");
const sgMail = require("@sendgrid/mail");
const User = require("../../models/user.model");
const { basicDetails } = require("../../helpers/user.helper");

module.exports.postSignIn = async (req, res) => {
  var email = req.body.email,
    password = req.body.password;
  try {
    var user = await User.findOne({ email: email }).populate({ path: "books" });
  } catch (err) {
    console.log(err);
  }
  if (!user) {
    res.status(401).json({
      message: "This user does not exist.",
    });
    return;
  }

  if (user.wrongLoginCount >= 4) {
    res.status(401).json({
      values: req.body,
      message:
        "Cannot login. You have entered wrong password more than 4 times.",
    });
    return;
  }
  var checkPassword = await bcrypt.compare(password, user.password);
  if (!checkPassword) {
    try {
      User.where(user).updateOne({
        wrongLoginCount: user.wrongLoginCount ? user.wrongLoginCount + 1 : 1,
      });
    } catch (err) {
      console.log(err);
    }

    if (user.wrongLoginCount === 3) {
      sgMail.setApiKey(process.env.SENDGRID_API_KEY);

      const msg = {
        to: user.email,
        from: process.env.FROM_ADDRESS,
        subject: "Securce Alert",
        html:
          "<strong>Someone are trying to access your account. Please check your account to make sure it's stil safe.</strong>",
      };
      try {
        await sgMail.send(msg);
      } catch (error) {
        console.log(error);
      }
    }
    res.status(401).json({
      values: req.body,
      message: "Wrong password.",
    });
    return;
  }

  res.cookie("userId", user._id, {
    signed: true,
    ...(process.env.LOCAL ? {} : { sameSite: "none", secure: true }),
  });
  res.json({ success: true, data: { user: basicDetails(user) } });
};

module.exports.postSignUp = async (req, res) => {
  var saltRounds = 10;
  req.body.password = await bcrypt.hash(req.body.password, saltRounds);
  req.body.isAdmin = false;
  req.body.avatarUrl =
    "https://cdn.glitch.com/aca73c48-f323-427a-a4d2-8951b055938d%2F57633af1-a357-4d7a-a693-a11426eee969.image.png?v=1589613113114";
  try {
    var user = await User.create(req.body);
  } catch (err) {
    console.log(err);
    res.json({ success: false, errors: [err] });
    return;
  }

  res.json({ success: true, respsone: basicDetails(user) });
};
