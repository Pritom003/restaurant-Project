const express = require('express');
const { MongoClient } = require('mongodb');
const cors = require('cors');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 3000;

// MongoDB URI from environment variables
const uri = process.env.MONGODB_URI;
const dbName = 'restaurantDB';
const menuCollectionName = 'menus';

// Middleware
app.use(cors());  // Enable CORS
app.use(express.json());  // Enable JSON parsing

// MongoDB Client
let client;

async function connectToMongoDB() {
  client = new MongoClient(uri);
  try {
    await client.connect();
    console.log('Connected to MongoDB');
  } catch (error) {
    console.error('Failed to connect to MongoDB:', error);
  }
}

// Endpoint to add menu category
app.post('/api/menu', async (req, res) => {
  const { category, items } = req.body;
  
  // Check if category and items are provided
  if (!category || !Array.isArray(items)) {
    return res.status(400).json({ error: 'Menu data is required in the correct format' });
  }

  try {
    const database = client.db(dbName);
    const collection = database.collection(menuCollectionName);

    // Prepare the menu item structure
    const menuData = { category, items };

    // Insert the new category
    const result = await collection.insertOne(menuData);
    res.status(201).json({ message: 'Menu category added', id: result.insertedId });
  } catch (error) {
    console.error('Error adding menu category:', error);
    res.status(500).json({ error: 'Failed to add menu category' });
  }
});

// Endpoint to get all menu categories
app.get('/api/menu', async (req, res) => {
  try {
    const database = client.db(dbName);
    const collection = database.collection(menuCollectionName);

    const menuData = await collection.find({}).toArray(); // Get all menu categories
    res.status(200).json(menuData);
  } catch (error) {
    console.error('Error fetching menu data:', error);
    res.status(500).json({ error: 'Failed to fetch menu data' });
  }
});

// Root endpoint
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
