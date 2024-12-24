// models/referralModel.js
const mongoose = require('mongoose');

const referralSchema = new mongoose.Schema({
  referralCode: { type: String, required: true, unique: true },
  referredTeleId: { type: String, required: true },
  referredAt: { type: Date, default: Date.now }
});

const Referral = mongoose.model('Referral', referralSchema);

module.exports = Referral;
