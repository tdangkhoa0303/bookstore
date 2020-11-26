const express = require("express");
const router = express.Router();

const controller = require("../controllers/cart.controller");

router.get("/:bookId/add", controller.addToCart);
router.get("/", controller.index);

module.exports = router;
