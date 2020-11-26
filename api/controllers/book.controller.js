const cloudinary = require("cloudinary").v2;
const Book = require("../../models/book.model");

module.exports.index = async (req, res) => {
  try {
    var books = await Book.find();
  } catch (err) {
    console.log(err);
    res.json({ success: false, errors: [err] });
    return;
  }
  res.json({ success: true, response: books });
};

module.exports.createBook = async (req, res) => {
  var path = req.file.path;
  var result;
  try {
    result = await cloudinary.uploader.upload(path, {
      folder: "Coders-x/Covers/"
    });
    req.body.coverUrl = result.secure_url;
  } catch (err) {
    res.json({ success: false, errors: [err] });
    return;
  }
  const fs = require("fs");
  fs.unlinkSync(path);

  try {
    var book = await Book.create(req.body);
  } catch (err) {
    console.log(err);
    res.json({ success: false, errors: [err] });
    return;
  }
  res.json({ success: true, response: book });
};

module.exports.deleteBook = async (req, res) => {
  var _id = req.params.id;
  try {
    var book = await Book.deleteOne({ _id: _id });
  } catch (err) {
    console.log(err);
    res.json({ success: false, errors: [err] });
    return;
  }
  res.json({ success: true, response: book });
};

module.exports.getEditBookTitle = async (req, res) => {
  var id = req.params.id;
  try {
    var book = await Book.find({ _id: id });
  } catch (err) {
    console.log(err);
    res.json({ success: false, errors: [err] });
    return;
  }
  res.json({ success: true, response: book });
};

module.exports.editBookTitle = async (req, res) => {
  var id = req.params.id,
    newTitle = req.body.title;
  try {
    var book = await Book.where({ _id: id }).updateOne({ title: newTitle });
  } catch (err) {
    console.log(err);
    res.json({ success: false, errors: [err] });
  }
  res.json({ success: true, response: book });
};
