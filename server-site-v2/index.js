const express = require('express');
const { MongoClient, ObjectId } = require('mongodb');
const cors = require('cors');
require('dotenv').config();
const axios = require('axios');
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const moment = require('moment'); 
const app = express();
const port = process.env.PORT || 5000;

// MongoDB URI from environment variables
const uri = process.env.MONGODB_URI;
const dbName = 'restaurantDB';
const menuCollectionName = 'menus';
const orderCollectionName = 'orders';

// Middleware
app.use(express.json()); // Enable JSON parsing
const corsOptions = {
  origin: process.env.FRONTEND_URL || 'http://localhost:5173', // Set this dynamically
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type'],
};
app.use(cors(corsOptions));

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

// Stripe: Create payment intent
app.post('/api/create-payment-intent', async (req, res) => {
  const { totalPrice } = req.body;

  if (!totalPrice || totalPrice <= 0) {
    return res.status(400).json({ error: 'Invalid total price' });
  }

  try {
    const paymentIntent = await stripe.paymentIntents.create({
      amount: totalPrice * 100, 
      currency: 'usd',
      payment_method_types: ['card'],
    });

    res.status(200).json({
      clientSecret: paymentIntent.client_secret,
    });
  } catch (error) {
    console.error('Error creating payment intent:', error);
    res.status(500).json({ error: 'Failed to create payment intent' });
  }
});







// Order collection endpoint
app.post('/api/orders', async (req, res) => {
  const { userEmail, chefEmail, paymentStatus, items, totalPrice } = req.body;

  if (!userEmail || !items || items.length === 0) {
    return res.status(400).json({ error: 'User email and items are required' });
  }

  const orderData = {
    chefEmail,
    userEmail,
    paymentStatus,
    items: items.map(item => ({
      name: item.name,
      price: item.price,
      quantity: item.quantity,
      createdAt: new Date(), 
    })),
    totalPrice,
    createdAt: new Date(),
  };
console.log(orderData);
  try {
    const database = client.db(dbName);
    const ordersCollection = database.collection(orderCollectionName);

    const result = await ordersCollection.insertOne(orderData);
    if (result.acknowledged) {
      // Send the order data to Zapier
      const zapierWebhookUrl = 'https://hooks.zapier.com/hooks/catch/20636785/25h17fq/'; // Replace with your Zapier webhook URL
      try {
        const zapierResponse = await axios.post(zapierWebhookUrl, orderData);
        console.log('Zapier response:', zapierResponse.data);
      } catch (error) {
        console.error('Error sending to Zapier:', error.response ? error.response.data : error.message);
      }

      res.status(201).json({ message: 'Order placed successfully' });
    } else {
      res.status(500).json({ error: 'Failed to place order' });
    }
  } catch (error) {
    console.error('Error placing order:', error);
    res.status(500).json({ error: 'Failed to place order' });
  }
});

// Endpoint to get all orders
app.get('/api/orders', async (req, res) => {
  try {
    const database = client.db(dbName);
    const ordersCollection = database.collection(orderCollectionName);

    const orders = await ordersCollection.find().toArray();  // Get all orders from the database
    res.status(200).json(orders);
  } catch (error) {
    console.error('Error fetching orders:', error);
    res.status(500).json({ error: 'Failed to fetch orders' });
  }
});

// Endpoint to delete an order
app.delete('/api/orders/:id', async (req, res) => {
  const { id } = req.params;

  try {
    const database = client.db(dbName);
    const ordersCollection = database.collection(orderCollectionName);

    const result = await ordersCollection.deleteOne({ _id: new ObjectId(id) });

    if (result.deletedCount === 1) {
      return res.status(200).json({ message: 'Order deleted successfully' });
    } else {
      return res.status(404).json({ error: 'Order not found' });
    }
  } catch (error) {
    console.error('Error deleting order:', error);
    res.status(500).json({ error: 'Failed to delete order' });
  }
});





// revenue 
// Revenue: Weekly
app.get('/api/revenue/weekly', async (req, res) => {
  try {
    const startOfWeek = moment().startOf('week').toDate();  // Start of the current week (Sunday)
    const endOfWeek = moment().endOf('week').toDate();      // End of the current week (Saturday)

    const database = client.db(dbName);
    const ordersCollection = database.collection(orderCollectionName);

    // Perform aggregation to calculate the total revenue for the week
    const revenue = await ordersCollection.aggregate([
      {
        $match: {
          createdAt: { $gte: startOfWeek, $lte: endOfWeek },  // Match orders within the current week
          paymentStatus: "success",  // Optionally filter for paid orders
        },
      },
      {
        $group: {
          _id: null,  // No grouping needed, just sum everything
          totalRevenue: { $sum: '$totalPrice' },  // Sum the totalPrice for all matched orders
        },
      },
    ]).toArray();  // Convert the aggregation result into an array

    res.json({ revenue: revenue.length ? revenue[0].totalRevenue : 0 });
  } catch (error) {
    console.error('Error fetching weekly revenue:', error);
    res.status(500).json({ message: 'Server Error' });
  }
});

app.get('/api/revenue/monthly', async (req, res) => {
  try {
    const startOfMonth = moment().startOf('month').toDate();  // Start of the current month
    const endOfMonth = moment().endOf('month').toDate();      // End of the current month

    const database = client.db(dbName);
    const ordersCollection = database.collection(orderCollectionName);

    // Perform aggregation to calculate the total revenue for the month
    const revenue = await ordersCollection.aggregate([
      {
        $match: {
          createdAt: { $gte: startOfMonth, $lte: endOfMonth },  // Match orders within the current month
          paymentStatus: "success",  // Optionally filter for paid orders
        },
      },
      {
        $group: {
          _id: null,  // No grouping needed, just sum everything
          totalRevenue: { $sum: '$totalPrice' },  // Sum the totalPrice for all matched orders
        },
      },
    ]).toArray();  // Convert the aggregation result into an array

    res.json({ revenue: revenue.length ? revenue[0].totalRevenue : 0 });
  } catch (error) {
    console.error('Error fetching monthly revenue:', error);
    res.status(500).json({ message: 'Server Error' });
  }
});


// POST for all menu items
app.post('/api/menu/:category/item', async (req, res) => {
  const { category } = req.params;
  const { items } = req.body;

  if (!items || items.length === 0) {
    return res.status(400).json({ error: 'Items are required' });
  }

  try {
    const database = client.db(dbName);
    const collection = database.collection(menuCollectionName);

    // Check if the category already exists
    const existingCategory = await collection.findOne({ category });

    if (existingCategory) {
      // If the category exists, update it by pushing new items
      const result = await collection.updateOne(
        { category },
        { $push: { items: { $each: items } } } // Push new items to the items array
      );

      if (result.modifiedCount === 0) {
        return res.status(404).json({ error: 'Failed to add item to existing category' });
      }

      return res.status(200).json({ message: 'Item added successfully to existing category' });
    } else {
      // If the category does not exist, create a new one
      const newCategory = {
        category,
        items, // Add the items directly since this is a new category
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
