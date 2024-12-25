// In your app.js/server.js
const express = require('express');
const cors = require('cors');
const http = require('http'); // Required for Socket.IO
const { Server } = require('socket.io');
const dotenv = require('dotenv');
const escpos = require("escpos");
escpos.USB = require("escpos-usb");
const bodyParser = require("body-parser");
const connectToMongoDB = require('./src/config/db');
const menuRoutes = require('./src/routes/MenuRoutes');
const orderRoutes = require('./src/routes/OrderRoutes');
const revenueRoutes = require('./src/routes/RevenueRutes');
const paymentRoutes = require('./src/routes/PaymentRutes');
const userRoutes = require('./src/routes/UsersRoutes');
const SpecialMenuRoutes = require('./src/routes/SpecialMenuRouter');
const DeliveryLocationRoutes = require('./src/routes/LocationRoutes');
const OpenandcloseRoutes = require('./src/routes/OpenAndCLose');

dotenv.config(); // Ensure your .env file is loaded

const app = express();
const server = http.createServer(app); // Create an HTTP server for Socket.IO
const io = new Server(server, {
  cors: {
    origin: 'http://localhost:5173', // Your frontend URL
    credentials: true,
  },
});
app.use(bodyParser.json());
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
app.use(OpenandcloseRoutes);

app.use(DeliveryLocationRoutes);
// Welcome route
app.get('/', (req, res) => {
  res.send('Welcome to the Restaurant API');
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});

app.post("/print", (req, res) => {
  const order = req.body;

  try {
    // Initialize the printer
    const device = new escpos.USB(); // Ensure the correct printer is connected via USB
    const printer = new escpos.Printer(device);

    device.open((error) => {
      if (error) {
        console.error("Error opening device:", error);
        return res.status(500).json({ error: "Failed to connect to printer" });
      }

      try {
        // Print header
        printer
          .font("a")
          .align("ct")
          .style("b")
          .size(1, 1)
          .text("Deedar Uk")
          .text(`Address: ${order.address}`)
          .text(`Zip Code: ${order.zipcode}`)
          .text(`Area: ${order.area}`)
          .text(`Contact No: ${order.mobile}`)
          .text("---------------")
          .text(`Order Number: ${order.orderNumber}`)
          .text(`Created At: ${order.createdAt}`)
          .text("---------------");

        // Print table header
        printer.tableCustom([
          { text: "Qty", align: "LEFT", width: 0.2 },
          { text: "Item", align: "CENTER", width: 0.5 },
          { text: "Price", align: "RIGHT", width: 0.3 },
        ]);

        // Print each item
        order.items.forEach((item) => {
          printer.tableCustom([
            { text: item.quantity.toString(), align: "LEFT", width: 0.2 },
            { text: item.name, align: "CENTER", width: 0.5 },
            { text: `£ ${item.price.toFixed(2)}`, align: "RIGHT", width: 0.3 },
          ]);
        });

        // Print totals and payment info
        printer
          .text("---------------")
          .tableCustom([
            { text: "Delivery Charge:", align: "LEFT", width: 0.7 },
            { text: `£ ${order.extraCharge.toFixed(2)}`, align: "RIGHT", width: 0.3 },
          ])
          .tableCustom([
            { text: "Subtotal:", align: "LEFT", width: 0.7 },
            { text: `£ ${order.totalPrice.toFixed(2)}`, align: "RIGHT", width: 0.3 },
          ])
          .tableCustom([
            { text: "Total:", align: "LEFT", width: 0.7 },
            { text: `£ ${order.totalPrice.toFixed(2)}`, align: "RIGHT", width: 0.3 },
          ])
          .text("---------------")
          .text(`Payment Method: ${order.paymentMethod}`)
          .text(`Payment Status: ${order.paymentStatus}`)
          .text("---------------")
          .text("Customer Copy")
          .text("Thanks for visiting!")
          .cut()
          .close();

        // Respond to the client
        res.status(200).json({ message: "Print successful" });
      } catch (printError) {
        console.error("Printing Error:", printError);
        res.status(500).json({ error: "Failed to print receipt" });
      }
    });
  } catch (error) {
    console.error("General Error:", error);
    res.status(500).json({ error: "An unexpected error occurred" });
  }
});


// Start the server and connect to MongoDB
server.listen(port, async () => {
  await connectToMongoDB();
  console.log(`Server is running on http://localhost:${port}`);
});
