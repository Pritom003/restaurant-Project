// src/app.js
const express = require('express');
const dotenv = require('dotenv');
const connectDB = require('./src/config/db');
const menuRoutes = require('./src/routes/MenuRoutes');
const cors = require('cors');

// Load environment variables
dotenv.config();

// Connect to MongoDB
connectDB();

// Create an Express application instance
const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors({ origin: 'http://localhost:5173' }));
app.use(express.json());

app.use('/api/menu', menuRoutes);

app.get('/', (req, res) => {
  res.send('Backend connected');
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
