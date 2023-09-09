const express = require("express");
// const path = require('path');
const session = require("express-session");
const flash = require("connect-flash");
var nodemailer = require("nodemailer");
const bcrypt = require("bcrypt");
const cookieparser = require("cookie-parser");

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
app.use(cookieparser());
app.use(express.static("public"));
app.set("view engine", "ejs");

app.use(flash());

// render the ejs views
app.set("views", path.join(__dirname, "views"));

app.get("/", async (req, res) => {
  try {
    let username = req.cookies.username;
    var email = username;

    const user = await UserModel.findOne({ email });

    // if (!user) {
    //   return res.status(401).json({ message: "Invalid credentials" });
    // }

    if (user) {
      var title = user.name;
      var login_status = "";
    } else {
      var title = "";
      var login_status = "Login";
    }

    // check if user is logged in, by checking cookie

    //fetch the data from database
    const response = await Product.find();
    res.render("index", {
      details: response,
      name: title,
      login_status: login_status,
      username,
    });
  } catch (err) {
    console.log("Error in getting the products");
  }
});

app.get("/logout", (req, res) => {
  // clear the cookie
  res.clearCookie("username");
  // redirect to login
  return res.redirect("/login");
});

app.get("/products", async (req, res) => {
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
  // check if there is a msg query
  let bad_auth = req.query.msg ? true : false;
  var title = " ";
  var login_status = "";

  // if there exists, send the error.
  if (bad_auth) {
    return res.render("login", {
      error: "Invalid username or password",
      name: title,
      login_status: login_status,
    });
  } else {
    // else just render the login
    return res.render("login", {
      name: title,
      login_status: login_status,
    });
  }
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

app.get("/api/profile", async (req, res) => {
  let username = req.cookies.username;
  var email = username;

  const user = await UserModel.findOne({ email });

  if (!user) {
    return res.status(401).json({ message: "Invalid credentials" });
  }

  var title = user.name;
  var login_status = "";
  var usermail = user.email;

  res.render("profile", {
    name: title,
    login_status: login_status,
    usermail: usermail,
  });
  // res.render("profile", { name: title, login_status: login_status });
  // res.render("profile");
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

    const response = await Product.find();

    var login_status = "Login";
    var title = "PLEASE LOGIN FIRST----->login----->----->login----->";

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

app.get("/api/secret/products", async (req, res) => {
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

app.get("/api/signup", function (req, res) {
  var login_status = "login";
  var title = "";
  res.render("signup", { name: title, login_status: login_status });
  //
  // res.render("signup");
});

app.get("/profile", async (req, res) => {
  let username = req.cookies.username;
  var email = username;
  var usermail = email;

  const user = await UserModel.findOne({ email });

  if (!user) {
    return res.status(401).json({ message: "Invalid credentials" });
  }

  var title = user.name;
  var login_status = "";

  res.render("profile", {
    name: title,
    login_status: login_status,
    usermail: usermail,
  });
  res.render("profile", { name: title, login_status: login_status });
  // res.render("profile");
});

app.get("/welcome", (req, res) => {
  // get the username
  let username = req.cookies.username;

  // render welcome page
  return res.render("welcome", {
    username,
  });
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
    // console.log(user);

    var login_status = "";
    var title = user.name;
    var username = user.email;

    const response = await Product.find();

    res.cookie("username", username);

    res.render("index", {
      details: response,
      name: title,
      login_status: login_status,
    });
  } catch (error) {
    res.status(500).json({ message: "An error occurred" + error });
  }
});

app.get("/welcome", (req, res) => {
  // get the username
  let username = req.cookies.username;

  // render welcome page
  return res.render("welcome", {
    username,
  });
});

//Database Code by Ankush Mehra
app.post("/api/save", async (req, res) => {
  try {
    const [userId, productId] = req.body;

    const user = await UserModel.findById(userId);
    const product = await Product.findById(productId);
    if (!user) {
      res.status(404).json({ message: " User Does Not exist" });
    }
    if (!product) {
      res.status(404).json({ message: "Product Does not exist" });
    }
    user.productArray.push(product);
    await user.save();

    res.status(200).json({ message: "Product Added To Cart Sussessfully" });
  } catch (err) {
    console.log("Error In saving in Products", err);
    res.status(404).json({ message: err });
  }
});

//Database Code by Ankush Mehra
app.get("/api/savedproduct", async (req, res) => {
  try {
    const [userId] = req.body;
    const user = await UserModel.findById(userId);

    if (!user) {
      res.status(404).json({ message: " User Does Not exist" });
    }

    const saveRecipiesId = await Product.find({
      _id: { $in: user.productArray },
    });
    res.status(200).json({ message: saveRecipiesId });
  } catch (err) {
    console.log("Error In Fetching the Products", err);
    res.status(404).json({ message: err });
  }
});

app.post("/api/contact", async (req, res) => {
  try {
    const { email } = req.body;

    const user = await UserModel.findOne({ email });

    if (!user) {
      return res.status(401).json({ message: "You are not logged in" });
    }

    console.log(user);

    // const hashPass = await bcrypt.hash(password, 10);
    // const newUser = new UserModel({
    //   name: name,
    //   email: email,
    //   password: hashPass,
    // });
    // await newUser.save();
    // res.status(201).json({ user:req.body });
    console.log("This user is logged in");

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

app.post("/addtocart", async (req, res) => {
  try {
    const { ProductName } = req.body;
    let username = req.cookies.username;
    var email = username;

    const product1 = await Product.findOne({ ProductName });

    const user = await UserModel.findOne({ email });

    // if (!user) {
    //   return res.status(401).json({ message: "Invalid credentials" });
    // }

    if (user) {
      var title = user.name;
      var login_status = "";

      // console.log(username);
      // console.log();

      if (product1) {
        var Id = product1._id;

        user.productArray.push(product1);

        await user.save();

        // console.log(user.productArray);
        // return res
        //   .status(200)
        //   .json({ message: "Item added to cart successfully" });
      } else {
        return res.status(404).json({ message: "Product not available" });
      }
    } 
    
    else {
      var title = "PLEASE LOGIN FIRST----->login----->----->login----->";
      var login_status = "Login";
    }

    // check if user is logged in, by checking cookie

    //fetch the data from database
    const response = await Product.find();
    res.render("index", {
      details: response,
      name: title,
      login_status: login_status,
      username,
    });

    // console.log("Product Added Successfully");
    

  } catch (err) {
    res.status(201).json({ message: "Error In Adding item to cart" + err });
  }
});

app.get("/api/cart", async (req, res) => {
  let username = req.cookies.username;
  var email = username;

  const user = await UserModel.findOne({ email });

  if (user) {
    var title = user.name;
    var login_status = "";

    var savedproducts = user.productArray;

    var size = savedproducts.length;

    // console.log(size);

    var display = new Array();
    //fetch the data from database
    // const response = await Product.find();

    for (let i = 0; i < size; i++) {
      var _id = savedproducts[i];

      const product = await Product.findOne({ _id });
      display.push(product);
    }

    res.render("cart", {
      display: display,
      name: title,
      login_status: login_status,
    });

    
  } else {
    var title = "";
    var login_status = "";

    res.render("login", {
      name: title,
      login_status: login_status,
    });
  }

  // res.render("cart");
});

app.get("/cart", async (req, res) => {
  let username = req.cookies.username;
  var email = username;

  const user = await UserModel.findOne({ email });

  if (user) {
    var title = user.name;
    var login_status = "";

    var savedproducts = user.productArray;

    var size = savedproducts.length;

    // console.log(size);

    var display = new Array();
    //fetch the data from database
    // const response = await Product.find();

    for (let i = 0; i < size; i++) {
      var _id = savedproducts[i];

      const product = await Product.findOne({ _id });
      display.push(product);
    }

    res.render("cart", {
      display: display,
      name: title,
      login_status: login_status,
    });

   
  } else {
    var title = "";
    var login_status = "";

    res.render("login", {
      name: title,
      login_status: login_status,
    });
  }

  // res.render("cart");
});

server.listen(3000, function () {
  console.log("Server listening on port: 3000");
});
