// Load environment variables
require("dotenv").config();

const express = require("express");
const path = require("path");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const session = require("express-session");
const flash = require("connect-flash");

// Database connection
require("./config/db");

const app = express();

// Middleware setup
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));
app.use(flash());


// Session configuration
app.use(
  session({
    secret: "gift-wala-secret-key-123", // Hard-coded for now, move to env variable in production
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: process.env.NODE_ENV === "production",
      maxAge: 24 * 60 * 60 * 1000, // 1 day
    },
  })
);

// View engine setup
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

// Routes
app.use("/", require("./routes/pageRoutes"));
app.use("/api", require("./routes/pageRoutes"));
app.use("/", require("./routes/authRoutes"));
app.use("/api", require("./routes/authRoutes"));
app.use("/", require("./routes/productRoutes"));
app.use("/api", require("./routes/productRoutes"));
app.use("/", require("./routes/cartRoutes"));
app.use("/api", require("./routes/cartRoutes"));

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).render("error", {
    message: "Something went wrong",
    name: "",
    login_status: "Login",
  });
});

module.exports = app;
