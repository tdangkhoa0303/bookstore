const express = require("express");

const router = express.Router();
const controller = require("../controllers/user.controller");


router.get("/", controller.index);

router.get("/:id/edit", controller.getEditUser);

router.post("/:id/edit", controller.editUser);

router.get("/:id/delete", controller.deleteUser);

module.exports = router;
