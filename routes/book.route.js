const express = require("express");
const router = express.Router();
const multer = require("multer");

const authorizeMiddleware = require("../middlewares/authorize.middleware");

const controller = require("../controllers/book.controller");
const upload = multer({ dest: "./public/uploads/" });

router.get("/", controller.index);

router.post(
  "/create",
  authorizeMiddleware,
  upload.single("cover"),
  controller.createBook
);

router.get("/:id/delete", authorizeMiddleware, controller.deleteBook);

router.get("/:id/edit", authorizeMiddleware, controller.getEditBookTitle);

router.post("/:id/edit", authorizeMiddleware, controller.editBookTitle);

module.exports = router;
