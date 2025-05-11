const express = require("express");
const router = express.Router();
const authController = require("../controllers/authController");
const { isAuthenticated, getUserData } = require("../middleware/authMiddleware");

// Sign up routes
router.get("/signup", getUserData, (req, res) => {
  res.render("signup", { 
    name: res.locals.user.name, 
    login_status: res.locals.user.login_status 
  });
});
router.post("/signup", authController.signup);

// Login routes
router.get("/login", getUserData, (req, res) => {
  // Check if there is an error message
  const bad_auth = req.query.msg ? true : false;
  
  if (bad_auth) {
    return res.render("login", {
      error: "Invalid username or password",
      name: res.locals.user.name,
      login_status: res.locals.user.login_status,
    });
  } else {
    return res.render("login", {
      name: res.locals.user.name,
      login_status: res.locals.user.login_status,
    });
  }
});
router.post("/login", authController.login);

// Logout route
router.get("/logout", authController.logout);

// Profile routes
router.get("/profile", isAuthenticated, authController.getProfile);

module.exports = router;