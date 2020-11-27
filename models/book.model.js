const mongoose = require("mongoose");

var bookSchema = new mongoose.Schema(
  {
    title: String,
    description: String,
    coverUrl: String,
    available: {
      type: Boolean,
      default: true,
      required: true,
    },
    type: {
      type: String,
      default: "rent",
      required: true,
    },
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  },
  { timestamps: true }
);

var Book = mongoose.model("Book", bookSchema, "books");
module.exports = Book;
