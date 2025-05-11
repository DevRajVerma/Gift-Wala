const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
  ProductName: {
    type: String,
    required: true,
    unique: true,
    trim: true,
  },
  Desription: {
    type: String,
    trim: true,
  },
  Price: {
    type: Number,
    require: true,
    min: 0,
  },
  ImageUrl: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },

  userOwner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    require: true,
  },
});

// Index for faster product searches
productSchema.index({ ProductName: 1 });

module.exports = mongoose.model("Product", productSchema);
