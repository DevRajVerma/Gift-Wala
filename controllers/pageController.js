const Product = require("../models/product");
const UserModel = require("../models/user");

// Home page
exports.getHomePage = async (req, res) => {
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
};

// About page
exports.getAboutPage = (req, res) => {
  res.render("about", { 
    name: res.locals.user.name, 
    login_status: res.locals.user.login_status 
  });
};

// Login page
exports.getLoginPage = (req, res) => {
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
};

// Signup page
exports.getSignupPage = (req, res) => {
  res.render("signup", { 
    name: res.locals.user.name, 
    login_status: res.locals.user.login_status 
  });
};

// Contact page
exports.getContactPage = (req, res) => {
  res.render("contact", { 
    name: res.locals.user.name, 
    login_status: res.locals.user.login_status 
  });
};

// Welcome page
exports.getWelcomePage = (req, res) => {
  const username = req.cookies.username;
  
  res.render("welcome", { username });
};