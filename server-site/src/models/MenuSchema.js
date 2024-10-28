const mongoose = require('mongoose');

// Define schema for menu items
const menuItemSchema = new mongoose.Schema({
  category: { type: String, required: true },
  name: { type: String, required: true },
  price: { type: Number, required: true }
});

// Create and export the model
const MenuItem = mongoose.model('MenuItem', menuItemSchema);
module.exports = MenuItem;
