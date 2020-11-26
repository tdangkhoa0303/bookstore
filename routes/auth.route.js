const express = require("express");
const router = express.Router();

const controller = require("../controllers/auth.controller");
const validate = require("../validate/user.validate");

router.get("/signin", controller.signin);

router.post("/signin", controller.postSignIn);

router.get("/signUp", controller.signUp);

router.post("/signUp", validate.postSignUp, controller.postSignUp);

module.exports = router;
