const mongoose = require('mongoose');

const OrderSchema = new mongoose.Schema(
  {
    userEmail: { type: String, required: true },
    chefEmail: { type: String, required: true },
    paymentStatus: { type: String, default: 'pending' },
    items: [
      {
        name: String,
        price: Number,
        quantity: Number,
        createdAt: { type: Date, default: Date.now },
      },
    ],
    totalPrice: { type: Number, required: true },
    createdAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

const Order = mongoose.model('Order', OrderSchema);

module.exports = Order;
