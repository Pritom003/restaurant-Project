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
        // createdAt: { type: Date, default: new Date('2024-11-13T00:00:00Z') },
      },
    ],
    paymentStatus: { type: String, }, // Required for tracking payment status
    paymentMethod: { type: String, },
    orderType: { type: String, required: true },
    totalPrice: { type: Number, required: true },
    createdAt: { type: Date, default: Date.now },
    spiceLevel: { type: String, },
    Status: { type: String, },
    confirmedTime: Number
    // createdAt: { type: Date, default: new Date('2024-11-13T00:00:00Z') },
  },
  { timestamps: true }
);

const Order = mongoose.model('Order', OrderSchema);

module.exports = Order;
