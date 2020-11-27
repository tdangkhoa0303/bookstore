const User = require("../models/user.model");
const mongoose = require("mongoose");

const basicDetails = (user) => {
  const { _id, userName, email, avatarUrl, books } = user;
  return { _id, userName, email, avatarUrl, books };
};
