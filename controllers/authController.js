const bcrypt = require("bcrypt");
const UserModel = require("../models/user");
const Product = require("../models/product");

// User registration
exports.signup = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // Check if user already exists
    const existingUser = await UserModel.findOne({ email });
    if (existingUser) {
      return res.json({ message: "User already exists" });
    }

    // Hash password and create new user
    const hashPass = await bcrypt.hash(password, 10);
    const newUser = new UserModel({
      name,
      email,
      password: hashPass,
    });
    
    await newUser.save();
    console.log("User created successfully");

    // Fetch products for homepage
    const products = await Product.find();

    // Render homepage with login prompt
    res.render("index", {
      details: products,
      name: "PLEASE LOGIN FIRST----->----->",
      login_status: "Login",
    });
  } catch (err) {
    console.error("Error creating user:", err);
    res.status(500).json({ message: "Error creating user: " + err.message });
  }
};

// User login
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    
    // Find user by email
    const user = await UserModel.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    // Check password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    // Set cookie and prepare response data
    res.cookie("username", user.email);
    
    // Fetch products for homepage
    const products = await Product.find();

    // Render homepage with user data
    res.render("index", {
      details: products,
      name: user.name,
      login_status: "",
    });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ message: "An error occurred: " + error.message });
  }
};

// User logout
exports.logout = (req, res) => {
  res.clearCookie("username");
  res.redirect("/login");
};

// User profile
exports.getProfile = async (req, res) => {
  try {
    const email = req.cookies.username;
    
    // Find user by email
    const user = await UserModel.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    // Render profile page with user data
    res.render("profile", {
      name: user.name,
      login_status: "",
      usermail: user.email,
    });
  } catch (error) {
    console.error("Profile error:", error);
    res.status(500).json({ message: "An error occurred: " + error.message });
  }
};