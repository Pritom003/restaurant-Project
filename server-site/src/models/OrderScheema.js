const mongoose = require('mongoose');
const OrderSchema = new mongoose.Schema({
  userEmail: { type: String, required: true },
  chefEmail: { type: String, required: true },
  items: [
    {
      name: String,
      price: String,
      quantity: Number,
      category: String,
      variant: String,
      subItems: [{ name: String }],
    },
  ],
  paymentStatus: { type: String },
  paymentMethod: { type: String },
  orderType: { type: String, required: true },
  totalPrice: { type: Number, required: true },
  spiceLevel: { type: String },
  status: { type: String },
  time: { type: Number },
}, { timestamps: true });

const Order = mongoose.model('Order', OrderSchema);

module.exports = Order;
