const express = require("express");

const router = express.Router();
const controller = require("../controllers/user.controller");

router.get("/", controller.index);

router.get("/profile", controller.getUser);

router.post("/:id/delete", controller.deleteUser);

module.exports = router;
