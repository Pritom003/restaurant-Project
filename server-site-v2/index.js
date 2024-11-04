const express = require('express');
const { MongoClient ,ObjectId } = require('mongodb');
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

app.post('/api/menu/:category/item', async (req, res) => {
  console.log('Received request to add item to category:', req.params.category);
  console.log('Request body:', req.body);

  const { category } = req.params; // Get the category from the URL parameters
  const { items } = req.body; // Get the items from the request body

  try {
    const database = client.db(dbName);
    const collection = database.collection(menuCollectionName);

    // Check if the category already exists
    const existingCategory = await collection.findOne({ category: category });

    if (existingCategory) {
      // If the category exists, check if it's a "Set Menu"
      if (category === "Set Menu") {
        // For "Set Menu", update it by pushing new items with included items structure
        const result = await collection.updateOne(
          { category: category },
          { $push: { items: { $each: items } } } // Push new items to the items array
        );

        if (result.modifiedCount === 0) {
          return res.status(404).json({ error: 'Failed to add item to existing Set Menu category' });
        }

        return res.status(200).json({ message: 'Item added successfully to existing Set Menu category' });
      } else {
        // For other categories, update as before
        const result = await collection.updateOne(
          { category: category },
          { $push: { items: { $each: items } } } // Push new items to the items array
        );

        if (result.modifiedCount === 0) {
          return res.status(404).json({ error: 'Failed to add item to existing category' });
        }

        return res.status(200).json({ message: 'Item added successfully to existing category' });
      }
    } else {
      // If the category does not exist, create a new one
      const newCategory = {
        category: category,
        items: items, // Add the items directly since this is a new category
      };

      const result = await collection.insertOne(newCategory);

      if (!result.acknowledged) {
        return res.status(500).json({ error: 'Failed to create new category' });
      }

      return res.status(201).json({ message: 'New category created and item added successfully' });
    }
  } catch (error) {
    console.error('Error adding item:', error);
    res.status(500).json({ error: 'Failed to add item' });
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
