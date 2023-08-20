// Sample product data (replace with your actual data)
const products = [
  { id: 1, name: "Product 1", price: 19.99 },
  { id: 2, name: "Product 2", price: 24.99 },
  // Add more products
];

// Cart data
const cart = [];

// Function to add product to cart
function addToCart(productId) {
  const product = products.find((item) => item.id === productId);
  if (product) {
    cart.push(product);
    updateCart();
  }
}

// Function to update the cart display
function updateCart() {
  const cartItems = document.getElementById("cartItems");
  const cartTotal = document.getElementById("cartTotal");

  cartItems.innerHTML = cart
    .map((item) => `<li>${item.name} - $${item.price}</li>`)
    .join("");

  const totalAmount = cart
    .reduce((total, item) => total + item.price, 0)
    .toFixed(2);
  cartTotal.textContent = `$${totalAmount}`;
}

// Dynamically generate product cards
const productCards = document.getElementById("products");
productCards.innerHTML = products
  .map(
    (product) =>
      `<div class="product-card">
        <h3>${product.name}</h3>
        <p>$${product.price}</p>
        <button onclick="addToCart(${product.id})">Add to Cart</button>
    </div>`
  )
  .join("");

// ... (previous code) ...
