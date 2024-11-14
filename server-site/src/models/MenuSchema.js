const mongoose = require('mongoose');

// Define the schema for menu items
const menuItemSchema = new mongoose.Schema({
  name: { type: String, required: true },
  price: { type: Number, required: true },
  itemsIncluded: [{
    name: { type: String },
    quantity: { type: Number },
  }],
});

// Define the schema for the menu
const menuSchema = new mongoose.Schema({
  category: { type: String, required: true, unique: true },
  items: [menuItemSchema],
});

// Create the Menu model
const Menu = mongoose.model('Menu', menuSchema);

module.exports = Menu;
