const express = require("express");
const multer = require("multer");

const router = express.Router();
const controller = require("../controllers/profile.controller");
const validate = require("../validate/profile.validate");
const upload = multer({ dest: "./public/uploads/" });

router.get("/", controller.index);

router.post("/", validate.postProfile, controller.postProfile);

router.post("/avatar", upload.single("avatar"), controller.postAvatar);

module.exports = router;
