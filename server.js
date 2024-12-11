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




// telegram user api

app.post('/telegram-user', async (req, res) => {
  console.log("post-hp")
    const { id, first_name, last_name, username,  photo_url } = req.body;

    // Check if the user already exists in the database
    const existingUser = await telegramUser.findOne({ username });
console.log(existingUser)
    if (existingUser) {
      console.log("already")
        return res.status(400).json({ message: 'User already exists' });
      
    }

    // Create a new user document
    const newUser = new telegramUser({
      id,
        first_name,
        last_name,
        username,
       
        photo_url
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


// Route to get all Telegram users
app.get('/telegram-user', async (req, res) => {
  console.log("GET /telegram-user");
  try {
    const users = await telegramUser.find();
    return res.status(200).json(users);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Error retrieving users' });
  }
});

// Route to get a single Telegram user by ID
app.get('/telegram-user/:id', async (req, res) => {
  const { id } = req.params;
  console.log(`GET /telegram-user/${id}`);
  try {
    const user = await telegramUser.findOne({ id });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    return res.status(200).json(user);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Error retrieving user' });
  }
});


app.put('/telegram-user/update-referrer-details', async (req, res) => {
  const { username, referrerDetails } = req.body;

  if (!username || !Array.isArray(referrerDetails) || referrerDetails.length === 0) {
    return res.status(400).json({ message: 'Username and referrerDetails array are required' });
  }

  try {
    // Check if the user exists in the database
    const existingUser = await telegramUser.findOne({ username });

    if (!existingUser) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Filter out referrerDetails where the username already exists in the database
    const uniqueReferrerDetails = referrerDetails.filter((newReferrer) => {
      return !existingUser.referrerDetails.some(
        (existingReferrer) => existingReferrer.username === newReferrer.username
      );
    });

    if (uniqueReferrerDetails.length === 0) {
      return res.status(200).json({ message: 'No new referrer details to add', user: existingUser });
    }

    // Update the referrerDetails array by adding only the unique entries
    const updatedUser = await telegramUser.findOneAndUpdate(
      { username }, // Match the username
      { $addToSet: { referrerDetails: { $each: uniqueReferrerDetails } } }, // Add unique entries
      { new: true } // Return the updated document
    );

    return res.status(200).json({
      message: 'Referrer details updated successfully',
      user: updatedUser,
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Error updating referrer details' });
  }
});





// POST endpoint to handle referrals
app.post('/referrals', async (req, res) => {
  try {
    const { userId, referrerId } = req.body;  // Destructure the userId and referrerId from the request body

    if (!userId || !referrerId) {
      return res.status(400).json({ message: 'userId and referrerId are required' });
    }
    const checkReferralExists = await Referral.find({ referrerId });
    
  
    if (checkReferralExists) {
      return res.status(400).json({ message: 'Referral with this referrerId already exists' });
    }
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

app.get('/referrals/:referrerId', async (req, res) => {
  try {
      const { referrerId } = req.params; // Extract the referrerId from the URL parameters

      // Validate referrerId
      if (!referrerId) {
          return res.status(400).json({ message: 'referrerId is required' });
      }

      // Fetch referrals from the database
      const referrals = await Referral.find({ referrerId });

      // If no referrals found, return an appropriate message
      if (referrals.length === 0) {
          return res.status(404).json({ message: 'No referrals found for the given referrerId' });
      }

      // Send a successful response with the referrals
      return res.status(200).json({
          message: 'Referrals fetched successfully',
          data: referrals,
      });
  } catch (error) {
      console.error(error);
      return res.status(500).json({ message: 'Internal Server Error' });
  }
});

//telegram user api end




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
