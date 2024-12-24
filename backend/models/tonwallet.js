const mongoose = require('mongoose');

// Define the schema for the Referral model
const Wallet = new mongoose.Schema({
  tele_id: {
    type: String,
    required: true,
  },
  tonAmount: {
    type: Number,
    required: true,
  },
  transactions: [
    {
      type: {
        type: String,
        enum: ['loss', 'profit', 'credit'], // Define valid transaction types
        required: true,
      },
      amount: {
        type: Number,
        required: true,
      },
      date: {
        type: Date,
        default: Date.now,
      },
      description: {
        type: String,
        default: '',
      },
    },
  ],
});


// Create the Referral model
const tonWallet = mongoose.model('TonWallet', Wallet);

module.exports = tonWallet;
