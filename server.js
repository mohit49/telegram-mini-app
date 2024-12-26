const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const http = require('http');
const socketIo = require('socket.io'); // Import socket.io
const connectSocket = require("./backend/socket-events")
const app = express();
const server = http.createServer(app); // Create an HTTP server with Express
const io = socketIo(server); // Initialize socket.io with the server

// Import routes
const teleUser = require('./backend/routes/profile');
const transactionsRouter = require('./backend/routes/tonwallet');

// Middleware to parse JSON bodies
app.use(bodyParser.json());

// MongoDB connection
const mongoURI = 'mongodb://localhost:27017/minAppDb'; // Replace with your MongoDB URI
mongoose.connect(mongoURI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log('Connected to MongoDB');
  })
  .catch((err) => {
    console.error('Error connecting to MongoDB', err);
  });

// Set up Socket.IO connection
connectSocket(io)

// Telegram user API
app.use('/', teleUser);

// Middleware for logging requests
app.use((req, res, next) => {
  console.log(`Request received: ${req.method} ${req.url}`);
  next();
});

// Telegram TonWallet API
app.use('/transactions', transactionsRouter);

// Start the server (using server to support WebSocket and HTTP)
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
