const telegramUserSchema = new mongoose.Schema({
  tele_id: {
    type: String,
    required: true,
    unique: true
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
  photo_url: {
    type: String,
    default: Date.now,
  },
  credit: {
    type: Number,
    default: 0,
  },
  creditTransactions: [
    {
      amount: {
        type: Number,
        required: true,
      },
      transactionType: {
        type: String,
        enum: ['dailylogin', 'referral', 'gameplay', 'new_user'], // Updated transaction types
        required: true
      },
      reason: {
        type: String,
      },
      referralId: {
        type: String,
        required: function() { return this.transactionType === 'referral'; } // Only required for 'referral' type
      },
      timestamp: {
        type: Date,
        default: Date.now
      }
    }
  ],
  refferedby: {
    type: String,
  },
  refferUnlock: {
    type: Boolean,
  },
  lastGamePlay: {
    type: String,
  },
  lastLogin: {
    type: String,
  },
  referrerDetails: [
    {
      tele_id: String,
      referId: String,
    },
  ],
  date_added: { type: Date, default: Date.now }
});

const userSchema = mongoose.model('TelegramUserSchema', telegramUserSchema);

module.exports = userSchema;
