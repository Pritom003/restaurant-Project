// Import the required libraries
const express = require('express'); // Import Express framework for building web applications
const mongoose = require('mongoose'); // Import Mongoose for MongoDB object modeling
const dotenv = require('dotenv'); // Import dotenv to manage environment variables

// Load environment variables from the .env file
dotenv.config();

// Create an instance of the Express application
const app = express(); 
// Set the port number to listen on, defaulting to 3000 if not specified in environment variables
const PORT = process.env.PORT || 3000;

// Middleware to parse incoming JSON requests
app.use(express.json()); 

// Connect to the MongoDB database using the connection URI from the environment variables
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB connected")) // Log success message if connected
  .catch((error) => console.error("MongoDB connection error:", error)); // Log error message if connection fails

// Define a route for the root URL
app.get('/', (req, res) => {
  res.send('Backend connected'); // Send a response when this route is accessed
});

// Start the server and listen for incoming requests
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`); // Log the server address
});
