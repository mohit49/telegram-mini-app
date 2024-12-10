const mongoose = require('mongoose');

// Define the schema for the Referral model
const referralSchema = new mongoose.Schema({
  userId: {
    type: String,
    required: true,
  },
  referrerId: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// Create the Referral model
const Referral = mongoose.model('Referral', referralSchema);

module.exports = Referral;
