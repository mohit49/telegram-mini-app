const mongoose = require('mongoose');

// Define the schema for the Referral model
const telegramUserSchema  = new mongoose.Schema({
    telegram_id: {
    type: String,
    required: true,
    unique:true
  },
  first_name: {
    type: String,
    required: true,
  },
  last_name: {
    type: String,
    default: Date.now,
  },
  username: {
    type: String,
    default: Date.now,
  },
  profile_photo_url: {
    type: String,
    default: Date.now,
  },
  date_added: { type: Date, default: Date.now }

});

// Create the Referral model
const userSchema = mongoose.model('TelegramUserSchema', telegramUserSchema);

module.exports = userSchema;
