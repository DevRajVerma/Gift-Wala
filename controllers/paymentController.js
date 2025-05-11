const crypto = require("crypto");
const razorpay = require("../config/razorpay");

// Create a new order
exports.createOrder = async (req, res) => {
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
};

// Verify payment
exports.verifyPayment = (req, res) => {
  const signature = req.headers["x-razorpay-signature"];
  
  // Create a signature to verify the request
  const shasum = crypto.createHmac("sha256", process.env.RAZORPAY_KEY_SECRET);
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
};