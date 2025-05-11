/**
 * Format price with currency symbol
 * @param {Number} price - Price to format
 * @param {String} currency - Currency code (default: INR)
 * @returns {String} Formatted price
 */
exports.formatPrice = (price, currency = 'INR') => {
  if (!price) return '0';
  
  // Format based on currency
  switch (currency) {
    case 'INR':
      return `₹${parseFloat(price).toFixed(2)}`;
    case 'USD':
      return `$${parseFloat(price).toFixed(2)}`;
    default:
      return `${parseFloat(price).toFixed(2)} ${currency}`;
  }
};

/**
 * Generate a unique order ID
 * @returns {String} Unique order ID
 */
exports.generateOrderId = () => {
  const timestamp = Date.now().toString();
  const randomNum = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
  return `ORD-${timestamp.substring(timestamp.length - 6)}-${randomNum}`;
};

/**
 * Check if an email is valid
 * @param {String} email - Email to validate
 * @returns {Boolean} Whether email is valid
 */
exports.isValidEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

/**
 * Calculate cart total
 * @param {Array} products - Array of product objects with price
 * @returns {Number} Total cart value
 */
exports.calculateCartTotal = (products) => {
  if (!products || !products.length) return 0;
  return products.reduce((total, product) => total + (parseFloat(product.Price) || 0), 0);
};

/**
 * Parse user data from request
 * @param {Object} req - Express request object
 * @returns {Object} User data or default values
 */
exports.getUserDataFromRequest = (req) => {
  // Default values
  const defaultData = {
    name: '',
    login_status: 'Login',
    isLoggedIn: false
  };

  // If no cookie, return default
  if (!req.cookies || !req.cookies.username) {
    return defaultData;
  }

  // Return user data if logged in
  return {
    name: req.user ? req.user.name : '',
    email: req.cookies.username,
    isLoggedIn: Boolean(req.user)
  };
};