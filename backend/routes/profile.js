
const express = require('express');
const telegramUser = require('../models/usersInfo'); // Import the Referral model

const router = express.Router();

router.post('/telegram-user', async (req, res) => {
    console.log("post-hp")
      const { tele_id, first_name, last_name, username,  photo_url , credit , referredby, lastLogin , refferUnlock } = req.body;
  
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
          credit,
          photo_url,
          referredby,
          lastLogin,
          refferUnlock
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
  router.get('/telegram-user', async (req, res) => {
    console.log("GET /telegram-user");
    try {
      const users = await telegramUser.find();
      return res.status(200).json(users);
    } catch (err) {
      console.error(err);
      return res.status(500).json({ message: 'Error retrieving users' });
    }
  });
  
  
  router.delete('/telegram-user/:id', async (req, res) => {
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
  router.get('/telegram-user/:tele_id', async (req, res) => {
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
  
  
  router.put('/update-credit/:tele_id', async (req, res) => {
    console.log("put-update-credit");
  
    const { tele_id } = req.params; // Extract tele_id from URL
    const { credit, transactionType, reason, referralId } = req.body; // Extract credit, transactionType, reason, and referralId
  
    // Validate that the credit field is provided
    if (credit == null) {
      return res.status(400).json({ message: 'Credit is required' });
    }
  
    // Validate that the transactionType is provided and is one of the allowed types
    if (!['dailylogin', 'referral', 'gameplay', 'new_user'].includes(transactionType)) {
      return res.status(400).json({ message: 'Invalid transaction type' });
    }
  
    // If the transaction type is 'referral', referralId is required
    if (transactionType === 'referral' && !referralId) {
      return res.status(400).json({ message: 'Referral ID is required for referral transactions' });
    }
  
    try {
      // Find the user by tele_id
      const user = await telegramUser.findOne({ tele_id });
  
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }
  
      // Calculate the updated credit
      let updatedCredit = user.credit + credit;
  
      // Create the transaction object to log
      const transaction = {
        amount: credit,
        transactionType: transactionType,
        reason: reason || 'No reason provided',
        referralId: transactionType === 'referral' ? referralId : undefined, // Only include referralId if it's a referral transaction
        timestamp: new Date(),
      };
  
      // Update the user's credit and log the transaction
      const updatedUser = await telegramUser.findOneAndUpdate(
        { tele_id },
        {
          credit: updatedCredit,
          $push: { creditTransactions: transaction }, // Push the new transaction into the creditTransactions array
        },
        { new: true } // Return the updated document
      );
  
      return res.status(200).json({
        message: 'Credit updated successfully',
        user: updatedUser
      });
    } catch (err) {
      console.error(err);
      return res.status(500).json({ message: 'Error updating credit' });
    }
  });
  
  
  router.put('/last-login/:tele_id', async (req, res) => {
    console.log("put-update-credit");
  
    const { tele_id } = req.params; // Extract tele_id from URL
    const { lastLogin } = req.body;   // Extract credit from request body
  
    // Validate that the credit field is provided
    if (lastLogin == null) {
        return res.status(400).json({ message: 'login value req is required' });
    }
  
    try {
        // Find the user by tele_id
        const user = await telegramUser.findOne({ tele_id });
  
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
  
        // Calculate the updated credit
      
  
        // Update the user's credit field
        const updatedUser = await telegramUser.findOneAndUpdate(
            { tele_id },
            { lastLogin },
            { new: true } // Return the updated document
        );
  
        return res.status(200).json({ 
            message: 'lastLogin updated successfully', 
            user: updatedUser 
        });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ message: 'Error updating lastlogin' });
    }
  });
  
  router.put('/update-referredBy/:tele_id', async (req, res) => {
    console.log("put-update-credit");
  
    const { tele_id } = req.params; // Extract tele_id from URL
    const { refferedby } = req.body;   // Extract credit from request body
  
    // Validate that the credit field is provided
    if (refferedby == null) {
        return res.status(400).json({ message: 'referredby is required' });
    }
  
    try {
        // Find the user by tele_id and update the credit field
        const updatedUser = await telegramUser.findOneAndUpdate(
            { tele_id },
            { refferedby },
            { new: true } // Return the updated document
        );
  
        if (!updatedUser) {
            return res.status(404).json({ message: 'User not found' });
        }
  
        return res.status(200).json({ message: 'details updated successfully', user: updatedUser });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ message: 'Error updating credit' });
    }
  });
  
  router.put('/update-referalUnlock/:tele_id', async (req, res) => {
    console.log("put-update-referalUnlock");
  
    const { tele_id } = req.params; // Extract tele_id from URL
    const { refferUnlock } = req.body; // Extract referalUnlock from request body
  
    // Validate that the referalUnlock field is provided
    if (refferUnlock == null) {
        return res.status(400).json({ message: 'ReferalUnlock is required' });
    }
  
    try {
        // Find the user by tele_id and update the referalUnlock field
        const updatedUser = await telegramUser.findOneAndUpdate(
            { tele_id },
            { refferUnlock },
            { new: true } // Return the updated document
        );
  
        if (!updatedUser) {
            return res.status(404).json({ message: 'User not found' });
        }
  
        return res.status(200).json({ message: 'ReferalUnlock updated successfully', user: updatedUser });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ message: 'Error updating referalUnlock' });
    }
  });
  
  
  router.put('/telegram-user/update-referrer-details', async (req, res) => {
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
  
  router.put('/last-game-played/:tele_id', async (req, res) => {
    console.log("last-game-played");
  
    const { tele_id } = req.params; // Extract tele_id from URL
    function getCurrentDateTimeCustom() {
      const now = new Date();
    
      // Format date as DD-MM-YYYY
      const day = String(now.getDate()).padStart(2, '0');
      const month = String(now.getMonth() + 1).padStart(2, '0'); // Month is 0-indexed
      const year = now.getFullYear();
    
      // Format time as HH:MM:SS
      const hours = String(now.getHours()).padStart(2, '0');
      const minutes = String(now.getMinutes()).padStart(2, '0');
      const seconds = String(now.getSeconds()).padStart(2, '0');
    
      return `${day}-${month}-${year} ${hours}:${minutes}:${seconds}`;
    }
    lastGamePlay  = getCurrentDateTimeCustom();   // Extract credit from request body
  
    // Validate that the credit field is provided
    if (lastGamePlay == null) {
        return res.status(400).json({ message: 'referredby is required' });
    }
  
    try {
        // Find the user by tele_id and update the credit field
        const updatedUser = await telegramUser.findOneAndUpdate(
            { tele_id },
            { lastGamePlay },
            { new: true } // Return the updated document
        );
  
        if (!updatedUser) {
            return res.status(404).json({ message: 'User not found' });
        }
  
        return res.status(200).json({ message: 'Last Game Played Updated', user: updatedUser });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ message: 'Error updating Last Game Played' });
    }
  });


  module.exports = router;