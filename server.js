require("dotenv").config();

const express = require("express");
const app = express();

const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const mongoose = require("mongoose");

const bookRoute = require("./routes/book.route");
const userRoute = require("./routes/user.route");
const transactionRoute = require("./routes/transaction.route");
const authRoute = require("./routes/auth.route");
const profileRoute = require("./routes/profile.route");
const cartRoute = require("./routes/cart.route");

// API Route
const authAPI = require("./api/routes/auth.route");
const transactionAPI = require("./api/routes/transaction.route");
const bookAPI = require("./api/routes/book.route");
const userAPI = require("./api/routes/user.route");
const profileAPI = require("./api/routes/profile.route");
const cartAPI = require("./api/routes/cart.route");

// API Middlewares
const authMiddlewareAPI = require("./api/middlewares/auth.middleware");
const authorizeMiddlewareAPI = require("./api/middlewares/authorize.middleware");

const authMiddleware = require("./middlewares/auth.middleware");
const authorizeMiddleware = require("./middlewares/authorize.middleware");
const sessionMiddleware = require("./middlewares/session.middleware");

mongoose.connect(process.env.MONGO_URL, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  dbName: "bookManager"
});
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cookieParser(process.env.SESSION_SECRET));
app.use(express.static("./public"));
app.use(sessionMiddleware);

app.set("view engine", "pug");
app.set("views", "./views");

app.get("/", (request, response) => {
  response.render("./index");
});

app.use("/books", bookRoute);
app.use("/users", authorizeMiddleware, userRoute);
app.use("/transactions", authMiddleware.requireAuth, transactionRoute);
app.use("/profile", authMiddleware.requireAuth, profileRoute);
app.use("/auth", authRoute);
app.use("/cart", cartRoute);

app.use("/api/", authAPI);
app.use("/api/transactions", transactionAPI);
app.use("/api/books", bookAPI);
app.use("/api/users", authorizeMiddlewareAPI, userAPI);
app.use("/api/transactions", authMiddlewareAPI.requireAuth, transactionAPI);
app.use("/api/profile", authMiddlewareAPI.requireAuth, profileAPI);
app.use("/api/cart", cartAPI);

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).render("./errors/500");
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log("Server listening on port: " + PORT));
