const express = require('express');
const app = express();
const port = 3000; // Change this as needed

// Serve static files (HTML, CSS, images)
app.use(express.static('public'));

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
