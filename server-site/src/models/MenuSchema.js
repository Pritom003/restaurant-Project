const mongoose = require('mongoose');

// Schema for included items (Set Menu items)
const IncludedItemSchema = new mongoose.Schema({
  name: { type: String, required: true },
  quantity: { type: String, required: true }
}, { _id: false });;

// Schema for varieties (Variants of items with name and price)
const VarietySchema = new mongoose.Schema({
  name: { type: String, required: true },
  price: { type: Number, required: true }
}, { _id: false });

// Schema for each menu item
const ItemSchema = new mongoose.Schema({
  name: { type: String, required: true },
  price: { type: Number, required: true },
  varieties: [VarietySchema], // Array to hold item varieties
  itemsIncluded: [IncludedItemSchema] // Supports Set Menu nested items
});

// Schema for menu category
const MenuSchema = new mongoose.Schema({
  category: { type: String, required: true, unique: true },
  items: [ItemSchema] // Array to hold menu items
});

module.exports = mongoose.model('MenuItem', MenuSchema);