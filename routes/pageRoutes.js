const express = require("express");
const router = express.Router();
const pageController = require("../controllers/pageController");
const { getUserData } = require("../middleware/authMiddleware");
const Product = require("../models/product")

// Home page
router.get("/", getUserData, async (req, res) => {
  try {
    // Fetch products
    const products = await Product.find();
    
    res.render("index", {
      details: products,
      name: res.locals.user.name,
      login_status: res.locals.user.login_status,
      username: req.cookies.username,
    });
  } catch (err) {
    console.error("Error loading homepage:", err);
    res.status(500).render("error", {
      message: "Failed to load homepage",
      name: "",
      login_status: "Login",
    });
  }
});

// Static pages
router.get("/about", getUserData, (req, res) => {
  res.render("about", { 
    name: res.locals.user.name, 
    login_status: res.locals.user.login_status 
  });
});

router.get("/contact", getUserData, (req, res) => {
  res.render("contact", { 
    name: res.locals.user.name, 
    login_status: res.locals.user.login_status 
  });
});

router.get("/welcome", getUserData, (req, res) => {
  const username = req.cookies.username;
  
  res.render("welcome", { 
    username,
    name: res.locals.user.name, 
    login_status: res.locals.user.login_status 
  });
});

module.exports = router;