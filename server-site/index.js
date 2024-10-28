// Import required libraries
const express = require('express');
const dotenv = require('dotenv');
const connectDB = require('./src/config/db');
const menuRoutes = require('./src/routes/MenuRoutes'); // Import routes

// Load environment variables
dotenv.config();

// Connect to MongoDB
connectDB();

// Create an Express application instance
const app = express();
const PORT = process.env.PORT || 3000;

// Middleware to parse JSON
app.use(express.json());

// Use routes
app.use('/api/menu', menuRoutes);

// Root route
app.get('/', (req, res) => {
  res.send('Backend connected');
});

// Listen for incoming requests
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
