// In your app.js/server.js
const express = require('express');
const cors = require('cors');
const http = require('http'); // Required for Socket.IO
const { Server } = require('socket.io');
const dotenv = require('dotenv');
const connectToMongoDB = require('./src/config/db');
const menuRoutes = require('./src/routes/MenuRoutes'); 
const orderRoutes = require('./src/routes/OrderRoutes');
const revenueRoutes = require('./src/routes/RevenueRutes');
const paymentRoutes  = require('./src/routes/PaymentRutes');
const userRoutes  = require('./src/routes/UsersRoutes');
const SpecialMenuRoutes  = require('./src/routes/SpecialMenuRouter');

dotenv.config(); // Ensure your .env file is loaded

const app = express();
const server = http.createServer(app); // Create an HTTP server for Socket.IO
const io = new Server(server, {
  cors: {
    origin: 'http://localhost:5173', // Your frontend URL
    credentials: true,
  },
});

const port = process.env.PORT || 3000;

// Middleware
app.use(express.json());
app.use(cors({
  origin: 'http://localhost:5173', // Allow only this origin
  credentials: true,              // Enable credentials
}));

// Socket.IO middleware (attach io to req object)
app.use((req, res, next) => {
  req.io = io; // Attach io to request
  next(); // Pass control to the next middleware/route handler
});

// Use the imported routes
app.use(menuRoutes); 
app.use(orderRoutes); 
app.use(revenueRoutes);
app.use(paymentRoutes);
app.use(userRoutes);
app.use(SpecialMenuRoutes);

// Welcome route
app.get('/', (req, res) => {
  res.send('Welcome to the Restaurant API');
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});

// Start the server and connect to MongoDB
server.listen(port, async () => {
  await connectToMongoDB();
  console.log(`Server is running on http://localhost:${port}`);
});
