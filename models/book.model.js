const mongoose = require("mongoose");

var bookSchema = new mongoose.Schema(
  {
    title: String,
    description: String,
    coverUrl: String,
    available: Boolean,
  },
  { timestamps: true }
);

var Book = mongoose.model("Book", bookSchema, "books");
module.exports = Book;
