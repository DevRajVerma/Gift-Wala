const express = require("express");
// const path = require('path');
const session = require("express-session");
const flash = require("connect-flash");
const bcrypt = require("bcrypt");
const app = express();

const UserModel = require("./model/user.js");

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

//connect-flash for flashing messages on login and signup
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

app.get("/",(req,res) => {
  res.render("index");
})

app.get("/signup",(req,res) => {
  res.render("signup");
})

app.get("/login",(req,res) => {
  res.render("login");
})

app.get("/profile",(req,res) => {
  res.render("profile");
})

app.get("/cart",(req,res) => {
  res.render("cart");
})

app.get("/contact",(req,res) => {
  res.render("contact");
})

app.get("/checkout",(req,res) => {
  res.render("checkout");
})


// Route to display product details page
app.get("/product/:id", (req, res) => {
  const productId = parseInt(req.params.id);
  const product = products.find((item) => item.id === productId);
  if (product) {
    res.render("product", { product });
  } else {
    res.status(404).send("Product not found");
  }
});

// Example API endpoint to simulate fetching products
app.get("/api/products", (req, res) => {
  const products = [
    { id: 1, name: "Product 1", price: 19.99 },
    { id: 2, name: "Product 2", price: 24.99 },
    // Add more products
  ];
  res.json(products);
});

// Example API endpoint to simulate placing an order
app.post("/api/orders", (req, res) => {
  // Simulate processing the order
  const order = { orderId: 123, success: true };
  res.json(order);
});

// Signup details
// app.post('/add', function(req,res){
//     console.log("lofkjdskjfndbjvsbdv");
//     res.send("Teri maa ki chut");
//   });

app.post("/api/signup", async (req, res) => {
  try {
    const { name ,email, password } = req.body;

    const user = await UserModel.findOne({ email: email });

    if (user) {
      res.json({ message: "User already exist" });
    }
    const hashPass = await bcrypt.hash(password, 10);
    const newUser = new UserModel({name:name,email: email, password: hashPass });
    await newUser.save();
    // res.status(201).json({ user:req.body });
    console.log("User created Successfully");
    res.redirect('/api/login');
    // res.redirect("/api/login");

    // res.redirect('/success');
    // res.send('Account successfully created. Please login to continue.');
  } catch (err) {
    res.status(201).json({ message: "Error In Creating user" + err });
  }
});

app.get("/api/login", function (req, res) {
  // console.log(__dirname);

  res.sendFile(path.join(__dirname, "/public", "login.html"));
  // res.sendFile(path.join(__dirname, '/public', 'style.css'));
});

app.get("/api/signup", function (req, res) {
  // console.log(__dirname);

  res.sendFile(path.join(__dirname, "/public", "signup.html"));
  // res.sendFile(path.join(__dirname, '/public', 'style.css'));
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
    console.log(user)
    res.status(200).json({ username: user });
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
