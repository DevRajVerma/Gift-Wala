const express = require("express");
const router = express.Router();
const cartController = require("../controllers/cartController");
const { isAuthenticated, getUserData } = require("../middleware/authMiddleware");
const paymentController = require("../controllers/paymentController");

const Product = require("../models/product");
const UserModel = require("../models/user");
const crypto = require("crypto");
const razorpay = require("../config/razorpay");

// Cart routes
router.get("/cart", getUserData, async (req, res) => {
  try {
    const email = req.cookies.username;
    
    if (!email) {
      return res.redirect("/login");
    }
    
    // Find user and fetch only needed fields
    const user = await UserModel.findOne(
      { email },
      { name: 1, productArray: 1 }
    );
    
    if (!user) {
      return res.render("login", {
        name: "",
        login_status: "",
      });
    }
    
    // Fetch all user's cart products in a single query
    const cartProducts = await Product.find({ _id: { $in: user.productArray } });
    
    res.render("cart", {
      display: cartProducts,
      name: user.name,
      login_status: "",
    });
  } catch (error) {
    console.error("Cart error:", error);
    res.status(500).render("error", { 
      message: "Error loading cart", 
      name: "", 
      login_status: "Login" 
    });
  }
});

router.post("/addtocart", async (req, res) => {
  try {
    const { ProductName } = req.body;
    const email = req.cookies.username;
    
    if (!email) {
      // Return to homepage with login prompt if not logged in
      const products = await Product.find();
      return res.render("index", {
        details: products,
        name: "PLEASE LOGIN FIRST----->----->",
        login_status: "Login",
        username: null
      });
    }
    
    // Find user and product
    const user = await UserModel.findOne({ email });
    const product = await Product.findOne({ ProductName });
    
    if (!product) {
      return res.status(404).json({ message: "Product not available" });
    }
    
    if (user) {
      // Add product to user's cart if not already there
      if (!user.productArray.includes(product._id)) {
        user.productArray.push(product);
        await user.save();
      }
      
      // Fetch products and render homepage
      const products = await Product.find();
      res.render("index", {
        details: products,
        name: user.name,
        login_status: "",
        username: email
      });
    } else {
      // Redirect to login if user not found
      res.redirect("/login");
    }
  } catch (err) {
    console.error("Error adding to cart:", err);
    res.status(500).json({ message: "Error adding item to cart: " + err.message });
  }
});

// Checkout route
router.get("/checkout", getUserData, (req, res) => {
  res.render("checkout", {
    name: res.locals.user.name,
    login_status: res.locals.user.login_status
  });
});

// Payment routes
router.post("/create-order", async (req, res) => {
  const options = {
    amount: req.body.amount * 100, // Amount in smallest currency unit (paise for INR)
    currency: "INR",
    receipt: `order_${Date.now()}`,
  };

  try {
    const order = await razorpay.orders.create(options);
    res.json(order);
  } catch (error) {
    console.error("Error creating order:", error);
    res.status(500).json({ message: "Failed to create order", error: error.message });
  }
});

router.post("/verify-payment", (req, res) => {
  const signature = req.headers["x-razorpay-signature"];
  
  // Create a signature to verify the request
  const shasum = crypto.createHmac("sha256", process.env.RAZORPAY_KEY_SECRET || "your-razorpay-secret");
  shasum.update(JSON.stringify(req.body));
  const digest = shasum.digest("hex");

  // Compare signatures
  if (signature === digest) {
    // Payment is verified
    res.json({ status: "Payment verified" });
  } else {
    // Payment verification failed
    res.status(400).json({ status: "Payment verification failed" });
  }
});

// API routes
router.post("/save", async (req, res) => {
  try {
    const [userId, productId] = req.body;
    
    // Find user and product
    const user = await UserModel.findById(userId);
    const product = await Product.findById(productId);
    
    if (!user) {
      return res.status(404).json({ message: "User does not exist" });
    }
    
    if (!product) {
      return res.status(404).json({ message: "Product does not exist" });
    }
    
    // Add product to user's cart
    user.productArray.push(product);
    await user.save();
    
    res.status(200).json({ message: "Product added to cart successfully" });
  } catch (err) {
    console.error("Error saving product:", err);
    res.status(500).json({ message: err.message });
  }
});

router.get("/savedproduct", async (req, res) => {
  try {
    const [userId] = req.body;
    const user = await UserModel.findById(userId);
    
    if (!user) {
      return res.status(404).json({ message: "User does not exist" });
    }
    
    // Find all products saved by user
    const savedProducts = await Product.find({
      _id: { $in: user.productArray },
    });
    
    res.status(200).json({ products: savedProducts });
  } catch (err) {
    console.error("Error fetching saved products:", err);
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;