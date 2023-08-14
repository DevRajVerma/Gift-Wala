const express = require('express');
const app = express();
const port = 3000; // Change this as needed

// Serve static files (HTML, CSS, images)
app.use(express.static('public'));
app.set('view engine', 'ejs');

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

// Start the server
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
