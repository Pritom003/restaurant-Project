// src/models/User.js
const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  email: { type: String, required: true },
  name:{type:String},
  role:{type:String},
  status: String,
  timestamp: { type: Date, default: Date.now },
  // add other fields as necessary
});

module.exports = mongoose.model('User', userSchema);
