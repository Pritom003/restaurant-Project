const express = require("express");
const mongoose = require("mongoose");
const router = express.Router();

// Restaurant model (simplified)
const Restaurant = mongoose.model("Restauranttime", new mongoose.Schema({
  isOpen: { type: Boolean, default: true },
 NewopeningTime: { type: String, default: "08:00" },
 NewclosingTime: { type: String, default: "22:00" },
}));

// Endpoint to update restaurant status
router.post("/api/restaurant/status", async (req, res) => {
  try {
    const { isOpen, NewopeningTime, NewclosingTime } = req.body;
    const restaurant = await Restaurant.findOneAndUpdate(
      {},
      { isOpen,NewopeningTime,NewclosingTime },
      { new: true, upsert: true }
    );
    res.status(200).json(restaurant);
  } catch (error) {
    res.status(500).json({ message: "Error updating restaurant status." });
  }
});
// Endpoint to get the current restaurant status
router.get("/api/restaurant/status", async (req, res) => {
    try {
      const restaurant = await Restaurant.findOne();
      if (!restaurant) {
        return res.status(404).json({ message: "Restaurant status not found." });
      }
      res.status(200).json(restaurant);
    } catch (error) {
      res.status(500).json({ message: "Error fetching restaurant status." });
    }
  });
  
module.exports = router;
