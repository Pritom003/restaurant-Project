const mongoose = require('mongoose');

const OrderSchema = new mongoose.Schema(
  {
    userEmail: { type: String, required: true },
    chefEmail: { type: String, required: true },

    items: [
      {
        name: String,
        price: String,
        quantity: Number,
        createdAt: { type: Date, default: Date.now },
        // createdAt: { type: Date, default: new Date('2024-11-13T00:00:00Z') },
      },
    ],
    paymentStatus: { type: String, }, // Required for tracking payment status
    paymentMethod: { type: String, },
    orderType: { type: String, required: true },
    totalPrice: { type:String, required: true },
    createdAt: { type: Date, default: Date.now },
    spiceLevel: { type: String, },
    status: { type: String, },
    time: { type: Number, },
    // createdAt: { type: Date, default: new Date('2024-11-13T00:00:00Z') },
  },
  { timestamps: true , default:30 }
);

const Order = mongoose.model('Order', OrderSchema);

module.exports = Order;
