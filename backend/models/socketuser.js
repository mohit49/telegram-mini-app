const mongoose = require('mongoose');
const socketUserSchema = new mongoose.Schema({
    userId: { type: String, required: true, unique: true },
    socketId: { type: String, required: true },
    lastUpdated: { type: Date, default: Date.now }
  });

  const SocketUser = mongoose.model('SocketUser', socketUserSchema);

module.exports = SocketUser;