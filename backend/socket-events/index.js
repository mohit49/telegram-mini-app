
const SocketUser = require('../models/socketuser'); // Assuming you have a model to store the mapping
const connectionEvents = require('./connectionEvents');

module.exports = (io) => {
  console.log("events-working");

  io.on('connection', (socket) => {
    console.log('A user connected:', socket.id);

    // Call event handlers (like 'message', etc.)
    connectionEvents(socket);

    // Listen for the 'authenticate' event to associate the user with the socket
    socket.on('authenticate', async (userId) => {
        console.log(userId)
      try {
        // Save or update the userId and socketId mapping in MongoDB
        const existingUser = await SocketUser.findOne({ userId });

        if (existingUser) {
          // If user already exists, update the socketId
          existingUser.socketId = socket.id;
          existingUser.lastUpdated = Date.now(); // Update the timestamp
          await existingUser.save();
        } else {
          // If user doesn't exist, create a new mapping
          const newSocketUser = new SocketUser({ userId, socketId: socket.id });
          await newSocketUser.save();
        }

        console.log(`User ${userId} authenticated and mapped to socketId ${socket.id}`);
      } catch (err) {
        console.error('Error saving user socket mapping:', err);
      }
    });

    // Handle disconnection of the socket
    socket.on('disconnect', async () => {
      try {
        const user = await SocketUser.findOne({ socketId: socket.id });
        if (user) {
          await SocketUser.deleteOne({ socketId: socket.id }); // Optionally delete the mapping on disconnect
          console.log(`User with socketId ${socket.id} disconnected`);
        }
      } catch (err) {
        console.error('Error removing socket mapping on disconnect:', err);
      }
    });
  });
};

