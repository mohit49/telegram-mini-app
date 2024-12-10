const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const Referral = require('./backend/models/referrals'); // Import the Referral model
const telegramUser = require('./backend/models/usersInfo'); // Import the Referral model

const app = express();

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

// POST endpoint to handle referrals
app.post('/api/referrals', async (req, res) => {
  try {
    const { userId, referrerId } = req.body;  // Destructure the userId and referrerId from the request body

    if (!userId || !referrerId) {
      return res.status(400).json({ message: 'userId and referrerId are required' });
    }

    // Save the referral to the database
    const savedReferral = await saveReferralToDatabase(userId, referrerId);

    // Send a successful response
    return res.status(200).json({
      message: 'Referral created successfully',
      data: savedReferral,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Internal Server Error' });
  }
});

app.post('/api/telegram-user', async (req, res) => {
    const { telegram_id, first_name, last_name, username, language_code, profile_photo_url } = req.body;

    // Check if the user already exists in the database
    const existingUser = await telegramUser.findOne({ telegram_id });

    if (existingUser) {
        return res.status(400).json({ message: 'User already exists' });
    }

    // Create a new user document
    const newUser = new telegramUser({
        telegram_id,
        first_name,
        last_name,
        username,
        language_code,
        profile_photo_url
    });

    try {
        // Save the user to the database
        await newUser.save();
        return res.status(201).json({ message: 'User saved successfully', user: newUser });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ message: 'Error saving user' });
    }
});

// Function to save the referral to the database
async function saveReferralToDatabase(userId, referrerId) {
  try {
    // Create a new referral document
    const referral = new Referral({
      userId,
      referrerId,
    });

    // Save the referral to the database
    const savedReferral = await referral.save();
    
    // Return the saved referral
    return savedReferral;
  } catch (error) {
    console.error('Error saving referral to database:', error);
    throw new Error('Unable to save referral');
  }
}



// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
