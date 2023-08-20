const express = require('express');
const session = require('express-session');
const flash = require('connect-flash');
const bcrypt = require('bcrypt')
const app = express();

const UserModel = require('./model/user.js');

const port = 3000; // Change this as needed

//for posting the data from signup.html to server
var http = require('http');
var path = require("path");
var bodyParser = require('body-parser');
var server = http.createServer(app);


//For Connecting the database
const ConnectDB = require('./db');
const { log } = require('console');
ConnectDB();

app.use(bodyParser.urlencoded({ extended: false }));


app.use(express.static('public'));
app.set('view engine', 'ejs');

//connect-flash for flashing messages on login and signup
app.use(session({
    secret:'geeksforgeeks',
    saveUninitialized: true,
    resave: true
}));
  
app.use(flash());
  
app.get('/', (req, res) => {
  req.flash('message', 'Teri maa ki chut Randi ke');
  res.redirect('/gfg');
});
  
app.get('/gfg', (req, res) => {
    res.send(req.flash('message'));
    
});

//



// Sample product data
const products = [
    { id: 1, name: 'Product 1', price: 19.99, description: 'Description for Product 1' },
    { id: 2, name: 'Product 2', price: 24.99, description: 'Description for Product 2' },
    // Add more products
];

// Route to display product details page
app.get('/product/:id', (req, res) => {
    const productId = parseInt(req.params.id);
    const product = products.find(item => item.id === productId);
    if (product) {
        res.render('product', { product });
    } else {
        res.status(404).send('Product not found');
    }
});

// Example API endpoint to simulate fetching products
app.get('/api/products', (req, res) => {
    const products = [
        { id: 1, name: 'Product 1', price: 19.99 },
        { id: 2, name: 'Product 2', price: 24.99 },
        // Add more products
    ];
    res.json(products);
});

// Example API endpoint to simulate placing an order
app.post('/api/orders', (req, res) => {
    // Simulate processing the order
    const order = { orderId: 123, success: true };
    res.json(order);
});

// Signup details
// app.post('/add', function(req,res){
//     console.log("lofkjdskjfndbjvsbdv");
//     res.send("Teri maa ki chut");
//   });

app.post('/api/signup', async (req, res) => {

    try {
        const { email, password } = req.body;

        const user = await UserModel.findOne({ email: email });

        if (user) {
            res.json({ message: "User already exist" });
        }
        const hashPass = await bcrypt.hash(password, 10);
        const newUser = new UserModel({ email: email, password: hashPass });
        await newUser.save();
        res.status(201).json({ message: "User Created Succesfully" });

        // res.redirect('/success');
        // res.send('Account successfully created. Please login to continue.');

    } catch (err) {
        res.status(201).json({ message: "Error In Creating user" + err });
    }

});


app.post('/api/login', async (req, res) => {

    try {
        const { email, password } = req.body;
        const user = await UserModel.findOne({ email });

        if (!user) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);

        if (!isPasswordValid) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        // Generate a JWT and send it to the frontend
        // const token = generateAuthToken(user);
        res.status(200).json({ message: "login successfully" });
    } catch (error) {
        res.status(500).json({ message: 'An error occurred' + error });
    }
});

// Start the server
// app.listen(port, () => {
//     console.log(`Server is running on port ${port}`);
// });

server.listen(3000, function () {
    console.log("Server listening on port: 3000")
});
