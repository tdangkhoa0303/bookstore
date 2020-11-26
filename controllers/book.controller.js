const cloudinary = require("cloudinary").v2;
const Book = require("../models/book.model");

module.exports.index = async (req, res, next) => {
  try {
    var books = await Book.find();
  } catch (err) {
    console.log(err);
    next(err);
  }
  res.render("books/index", {
    books: books
  });
};

module.exports.createBook = async (req, res, next) => {
  var path = req.file.path;
  var result;
  try {
    result = await cloudinary.uploader.upload(path, {
      folder: "Coders-x/Covers/"
    });
    req.body.coverUrl = result.secure_url;
  } catch (err) {
    res.send(err);
    return;
  }
  const fs = require("fs");
  fs.unlinkSync(path);

  try {
    await Book.create(req.body);
  } catch (err) {
    console.log(err);
    next(err);
  }
  res.redirect("/books");
};

module.exports.deleteBook = async (req, res, next) => {
  var _id = req.params.id;
  try {
    await Book.deleteOne({ _id: _id });
  } catch (err) {
    console.log(err);
    next(err);
  }
  res.redirect("/books");
};

module.exports.getEditBookTitle = async (req, res, next) => {
  var id = req.params.id,
    newTitle = req.body.title;
  try {
    var book = await Book.find({ _id: id });
  } catch (err) {
    console.log(err);
    next(err);
  }
  res.render("books/edit", {
    book: book
  });
};

module.exports.editBookTitle = async (req, res, next) => {
  var id = req.params.id,
    newTitle = req.body.title;
  try {
    await Book.where({ _id: id }).updateOne({ title: newTitle });
  } catch (err) {
    console.log(err);
    next(err);
  }
  res.redirect("/books");
};
