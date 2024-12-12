const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const Referral = require('./backend/models/referrals'); // Import the Referral model
const telegramUser = require('./backend/models/usersInfo'); // Import the Referral model

const app = express();

// Mtele_iddleware to parse JSON bodies
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
    const { tele_id, first_name, last_name, username,  photo_url } = req.body;

    // Check if the user already exists in the database
    const existingUser = await telegramUser.findOne({ tele_id });
console.log(existingUser)
    if (existingUser) {
      console.log("already")
        return res.status(400).json({ message: 'User already exists' });
      
    }

    // Create a new user document
    const newUser = new telegramUser({
      tele_id,
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


app.delete('/telegram-user/:id', async (req, res) => {
  console.log("DELETE /telegram-user/:id");
  const { id } = req.params;

  try {
    const result = await telegramUser.findByIdAndDelete(id);

    if (!result) {
      return res.status(404).json({ message: 'User not found' });
    }

    return res.status(200).json({ message: 'User deleted successfully' });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Error deleting user' });
  }
});

// Route to get a single Telegram user by tele_id
app.get('/telegram-user/:tele_id', async (req, res) => {
  const { tele_id } = req.params;
  console.log(`GET /telegram-user/${tele_id}`);
  try {
    const user = await telegramUser.findOne({ tele_id });
    if (!user) {
      return res.status(200).json({ message: 'User not found' });
    }
    return res.status(200).json(user);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Error retrieving user' });
  }
});


app.put('/telegram-user/update-referrer-details', async (req, res) => {
  const { tele_id, referrerDetails } = req.body;

  if (!tele_id || !Array.isArray(referrerDetails) || referrerDetails.length === 0) {
    return res.status(400).json({ message: 'tele_id and referrerDetails array are required' });
  }

  try {
    // Check if the user exists in the database
    const existingUser = await telegramUser.findOne({ tele_id });

    if (!existingUser) {
      return res.status(404).json({ message: 'User not found' });
    }
const rfferedUser = referrerDetails[0].tele_id;

    const alreadyHaveAccount = await telegramUser.findOne({'tele_id': rfferedUser});

 const teleIdExist =  existingUser.referrerDetails.filter( (existingReferrer) => existingReferrer.tele_id  == referrerDetails[0].tele_id)

console.log(teleIdExist.length)
    // If any duplicates are found, don't add anything and return
    if (teleIdExist.length > 0) {
      return res.status(200).json({
        message: 'Duplicate referrerDetails found. No changes were made.',
        user: existingUser,
      });
    }
    else {
 // Append new referrerDetails to the array
 existingUser.referrerDetails.push(...referrerDetails);

 // Save the updated user back to the database
 await existingUser.save();

 return res.status(200).json({
   message: 'Referrer details updated successfully',
   user: existingUser,
 });
    }

   
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Error updating referrer details' });
  }
});

















// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
