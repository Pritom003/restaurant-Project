const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const connectToMongoDB = require('./src/config/db');
// ========================= 
const menuRoutes = require('./src/routes/MenuRoutes'); 
const orderRoutes = require('./src/routes/OrderRoutes');
const revenueRoutes = require('./src/routes/RevenueRutes');
const paymentRoutes  = require('./src/routes/PaymentRutes');
const userRoutes  = require('./src/routes/UsersRoutes');




dotenv.config(); // Ensure your .env file is loaded

const app = express();
const port = process.env.PORT || 3000;

// Middleware
app.use(express.json());
app.use(cors({
  origin: 'http://localhost:5173', // Allow only this origin
  credentials: true,              // Enable credentials
}));

// Connect to MongoDB
connectToMongoDB();
// ==============================================
// Use the imported routes
app.use(menuRoutes); // Use the menu routes here
app.use(orderRoutes); // Use the menu routes here
app.use(revenueRoutes);
app.use(paymentRoutes);
app.use(userRoutes);



// ===========================================
app.get('/', (req, res) => {
  res.send('Welcome to the Restaurant API');
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});

// Start server and connect to MongoDB
app.listen(port, async () => {
  await connectToMongoDB();
  console.log(`Server is running on http://localhost:${port}`);
});

