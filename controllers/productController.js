const Product = require("../models/product");

// Get all products
exports.getAllProducts = async (req, res) => {
  try {
    const products = await Product.find();
    res.render("index", {
      details: products,
      name: res.locals.user.name,
      login_status: res.locals.user.login_status,
      username: req.cookies.username,
    });
  } catch (err) {
    console.error("Error fetching products:", err);
    res.status(500).json({ message: "Error fetching products" });
  }
};

// Get products API
exports.getProductsApi = async (req, res) => {
  try {
    const products = await Product.find();
    res.render("api_products", {
      details: products,
      name: res.locals.user.name,
      login_status: res.locals.user.login_status,
    });
  } catch (err) {
    console.error("Error fetching products API:", err);
    res.status(500).json({ message: "Error fetching products" });
  }
};

// Add product
exports.addProduct = async (req, res) => {
  const { productName, Description, Price, image } = req.body;
  
  try {
    // Check if product already exists
    const existingProduct = await Product.findOne({ ProductName: productName });
    if (existingProduct) {
      return res.status(409).json({ message: "Product already exists" });
    }

    // Create new product
    const newProduct = new Product({
      ProductName: productName,
      Desription: Description,
      Price: Price,
      ImageUrl: image,
    });
    
    await newProduct.save();
    res.status(201).json({ message: "Product created successfully", product: newProduct });
  } catch (err) {
    console.error("Error creating product:", err);
    res.status(500).json({ message: "Error creating product" });
  }
};

// Render add product form
exports.renderAddProductForm = (req, res) => {
  res.render("add_products", { 
    name: res.locals.user.name,
    login_status: res.locals.user.login_status 
  });
};