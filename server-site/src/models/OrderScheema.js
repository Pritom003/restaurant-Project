const mongoose = require('mongoose');

const OrderSchema = new mongoose.Schema(
  {
    userEmail: { type: String, required: true },
    chefEmail: { type: String, required: true },
  
    items: [
      {
        name: String,
        price: Number,
        quantity: Number,
        createdAt: { type: Date, default: Date.now },
        // createdAt: new Date('2024-10-02T00:00:00Z')
      },
    ],
    paymentStatus: { type: String, required: true }, // Required for tracking payment status
    paymentMethod: { type: String, required: true },
    totalPrice: { type: Number, required: true },
    createdAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

const Order = mongoose.model('Order', OrderSchema);

module.exports = Order;
