const express = require("express");
const router = express.Router();

const controller = require("../controllers/auth.controller");
const validate = require("../validate/user.validate");

router.post("/signin", controller.postSignIn);

router.post("/signup", validate.postSignUp, controller.postSignUp);

module.exports = router;
