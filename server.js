const express = require("express");
// const path = require('path');
const session = require("express-session");
const flash = require("connect-flash");
const bcrypt = require("bcrypt");
const app = express();

const UserModel = require("./model/user.js");
const Product = require("./model/product.js");

const port = 3000; // Change this as needed

//for posting the data from signup.html to server
var http = require("http");
var path = require("path");
var bodyParser = require("body-parser");
var server = http.createServer(app);

//For Connecting the database
const ConnectDB = require("./db");
const { log } = require("console");
ConnectDB();

app.use(bodyParser.urlencoded({ extended: false }));

app.use(express.static("public"));
app.set("view engine", "ejs");

app.use(
  session({
    secret: "geeksforgeeks",
    saveUninitialized: true,
    resave: true,
  })
);

app.use(flash());

//

// Sample product data
const products = [
  {
    id: 1,
    name: "Product 1",
    price: 19.99,
    description: "Description for Product 1",
  },
  {
    id: 2,
    name: "Product 2",
    price: 24.99,
    description: "Description for Product 2",
  },
  // Add more products
];

app.get("/", async (req, res) => {
  try {
    var login_status = "Login";
    var title = "";

    //fetch the data from database
    const response = await Product.find();
    res.render("index", {
      details: response,
      name: title,
      login_status: login_status,
    });
  } catch (err) {
    console.log("Error in getting the products");
  }
});

app.get("/signup", (req, res) => {
  var title = " ";
  var login_status = "";
  res.render("signup", { name: title, login_status: login_status });
});

app.get("/login", (req, res) => {
  var title = " ";
  var login_status = "";
  res.render("login", { name: title, login_status: login_status });
});

app.get("/profile", (req, res) => {
  var title = " ";
  var login_status = "";
  res.render("profile", { name: title, login_status: login_status });
  // res.render("profile");
});

app.get("/cart", (req, res) => {
  res.render("cart");
});

app.get("/contact", (req, res) => {
  var title = " ";
  var login_status = "";
  res.render("contact", { name: title, login_status: login_status });
});

app.get("/api/contact", (req, res) => {
  var title = " ";
  var login_status = "";
  res.render("contact", { name: title, login_status: login_status });
});

app.get("/api/add_products", (req, res) => {
  var title = " ";
  var login_status = "";
  res.render("add_products", { name: title, login_status: login_status });
});

app.get("/add_products", (req, res) => {
  var title = " ";
  var login_status = "";
  res.render("add_products", { name: title, login_status: login_status });
});

app.get("/api/profile", (req, res) => {
  var title = " ";
  var login_status = "";
  res.render("profile", { name: title, login_status: login_status });
});

app.get("/api/add_products", (req, res) => {
  var title = " ";
  var login_status = "";
  res.render("add_products", { name: title, login_status: login_status });
});

app.get("/checkout", (req, res) => {
  res.render("checkout");
});

app.post("/api/add_products", async (req, res) => {
  const { productName, Description, Price, image } = req.body;
  try {
    const product = await Product.findOne({ ProductName: productName });
    if (product) {
      return res.status(201).json({ message: "Product already Exist" });
    }

    const createProduct = new Product({
      ProductName: productName,
      Desription: Description,
      Price: Price,
      ImageUrl: image,
    });
    await createProduct.save();
    res.status(201).json({ Messgae: createProduct });
    //  res.redirect("/");
  } catch (err) {
    console.log("Error in creating the Product", err);
    res.status(404).json({ Messgae: "Error in creating Product" });
  }
});

app.post("/api/signup", async (req, res) => {
  try {
    const { name, email, password } = req.body;

    const user = await UserModel.findOne({ email: email });

    if (user) {
      res.json({ message: "User already exist" });
    }
    const hashPass = await bcrypt.hash(password, 10);
    const newUser = new UserModel({
      name: name,
      email: email,
      password: hashPass,
    });
    await newUser.save();
    // res.status(201).json({ user:req.body });
    console.log("User created Successfully");
    // res.redirect('/api/login');

    // res.redirect("/api/login");

    const response = await Product.find();

    
    var login_status = "LOGIN KAR BRO!";
    var title = "";

    res.render("index", {
      details: response,
      name: title,
      login_status: login_status,
    });

    // res.redirect("/login");
  } catch (err) {
    res.status(201).json({ message: "Error In Creating user" + err });
  }
});

app.get("/api/products", async (req, res) => {
  try {
    var login_status = "";
    var title = "";

    //fetch the data from database
    const response = await Product.find();
    res.render("api_products", {
      details: response,
      name: title,
      login_status: login_status,
    });
  } catch (err) {
    console.log("Error in getting the products");
  }
});

app.get("/api/login", (req, res) => {
  var login_status = "";
  var title = "";
  res.render("login", { name: title, login_status: login_status });

  // res.render("login");
});

app.get("/Ankit", (req, res) => {
  var login_status = "";
  var title = "";

  var ProductName = "Ankit";
  var ImageUrl = "/images/Ankit.jpg";
  var Price = "500";
  var Description = "Very lamba land";

  res.render("products", {
    name: title,
    login_status: login_status,
    ProductName: ProductName,
    ImageUrl: ImageUrl,
    Price: Price,
    Description: Description,
  });

  // res.render("login");
});

app.get("/api/signup", function (req, res) {

  var login_status = "login";
  var title = "";
  res.render("signup", { name: title, login_status: login_status });
// 
  // res.render("signup");
});

app.post("/api/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await UserModel.findOne({ email });

    if (!user) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    // Generate a JWT and send it to the frontend
    // const token = generateAuthToken(user);
    console.log(user);

    var login_status = "";
    var title = user.name;

    const response = await Product.find();

    res.render("index", {
      details: response,
      name: title,
      login_status: login_status,
    });

    // title = user.name;
    // res.render("index", {name:title});
    // res.status(200).json({ username: user });
  } catch (error) {
    res.status(500).json({ message: "An error occurred" + error });
  }
});

// Start the server
// app.listen(port, () => {
//     console.log(`Server is running on port ${port}`);
// });

server.listen(3000, function () {
  console.log("Server listening on port: 3000");
});


app.post('/api/save',async (req,res)=>{
    try{
      const [userId,productId] =  req.body;
      
      const user = await UserModel.findById(userId);
      const product = await Product.findById(productId);
      if(!user){
        res.status(404).json({message:" User Does Not exist"})
      }
      if(!product){
        res.status(404).json({message:"Product Does not exist"})
      }
     user.productArray.push(product);
     await user.save();

      res.status(200).json({message:"Product Added To Cart Sussessfully"})
    }catch(err){
      console.log('Error In saving in Products',err);
      res.status(404).json({message:err})
    }
})

app.get('/api/savedproduct',async(req,res)=>{
  try{
    const [ userId ] =  req.body;
    const user = await UserModel.findById(userId);

    if(!user){
      res.status(404).json({message:" User Does Not exist"})
    }

    const saveRecipiesId = await Product.find({
      _id:{ $in : user.productArray}
    })
    res.status(200).json({message:saveRecipiesId})
  }catch(err){
      console.log('Error In Fetching the Products',err);
      res.status(404).json({message:err})
    }
})
