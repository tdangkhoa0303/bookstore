const cloudinary = require("cloudinary").v2;
const Book = require("../../models/book.model");
const User = require("../../models/user.model");

module.exports.index = async (req, res) => {
  const perPage = process.env.PER_PAGE || 10;
  const { p: page = 1 } = req.query;

  try {
    var books = await Book.find()
      .limit(perPage)
      .skip((page - 1) * perPage);
    var count = await Book.countDocuments();
  } catch (err) {
    console.log(err);
    res.status(500).json({ success: false, message: "Something went wrong." });
    return;
  }
  res.status(200).json({
    success: true,
    data: {
      data: books,
      maxPageNum: Math.round(count / perPage),
      currentPage: page,
      perPage: perPage,
    },
  });
};

module.exports.createBook = async (req, res) => {
  console.log(req.body);
  var path = req.file.path;
  const user = req.user;
  var result;
  try {
    result = await cloudinary.uploader.upload(path, {
      folder: "Coders-x/Covers/",
    });
    req.body.coverUrl = result.secure_url;
  } catch (err) {
    res.json({ success: false, errors: [err] });
    return;
  }
  const fs = require("fs");
  fs.unlinkSync(path);
  req.body.owner = user._id;
  try {
    var book = await Book.create(req.body);
  } catch (err) {
    console.log(err);
    res.json({ success: false, message: err.message });
    return;
  }
  await User.findByIdAndUpdate(user._id, { $push: { books: book._id } });
  res.json({ success: true, data: { book } });
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
