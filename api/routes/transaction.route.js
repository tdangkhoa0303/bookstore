const express = require("express");
const router = express.Router();
const shortid = require("shortid");

const controller = require("../controllers/transaction.controller");

router.get("/", controller.index);

router.get("/create", controller.createTransactions);

router.get("/:id/complete", controller.completeTransaction);

module.exports = router;
