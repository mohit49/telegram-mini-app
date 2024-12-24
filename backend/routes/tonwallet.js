const express = require('express');
const Wallet = require('../models/tonwallet');

const router = express.Router();

// Add a transaction
router.post('/:tele_id', async (req, res) => {
    const { tele_id } = req.params;
    const { type, amount, description } = req.body;
  
    // Validate transaction type
    if (!['loss', 'profit', 'credit'].includes(type)) {
      return res.status(400).json({ error: 'Invalid transaction type' });
    }
  
    try {
      // Check if the wallet exists
      let wallet = await Wallet.findOne({ tele_id });
  
      // If not found, create a new wallet
      if (!wallet) {
        wallet = new Wallet({
          tele_id,
          tonAmount: 0, // Initialize tonAmount as 0
          transactions: [],
        });
      }
  
      // Update tonAmount based on transaction type
      if (type === 'loss') {
        wallet.tonAmount -= amount;
      } else if (type === 'profit' || type === 'credit') {
        wallet.tonAmount += amount;
      }
  
      // Add the transaction
      wallet.transactions.push({ type, amount, description });
  
      // Save the wallet
      await wallet.save();
  
      res.status(200).json({ message: 'Transaction processed successfully', wallet });
    } catch (error) {
      res.status(500).json({ error: 'Internal server error', details: error.message });
    }
  });
  


// Get all transactions
router.get('/:tele_id', async (req, res) => {
  const { tele_id } = req.params;

  try {
    const wallet = await Wallet.findOne({ tele_id });
    if (!wallet) {
      return res.status(404).json({ error: 'Wallet not found' });
    }

    res.status(200).json({ transactions: wallet });
  } catch (error) {
    res.status(500).json({ error: 'Internal server error', details: error.message });
  }
});

// Delete a transaction
router.delete('/:tele_id/:transactionId', async (req, res) => {
  const { tele_id, transactionId } = req.params;

  try {
    const wallet = await Wallet.findOne({ tele_id });
    if (!wallet) {
      return res.status(404).json({ error: 'Wallet not found' });
    }

    // Find and remove the transaction
    const transaction = wallet.transactions.id(transactionId);
    if (!transaction) {
      return res.status(404).json({ error: 'Transaction not found' });
    }

    if (transaction.type === 'loss') {
      wallet.tonAmount += transaction.amount;
    } else if (transaction.type === 'profit' || transaction.type === 'credit') {
      wallet.tonAmount -= transaction.amount;
    }

    transaction.remove();
    await wallet.save();

    res.status(200).json({ message: 'Transaction deleted successfully', wallet });
  } catch (error) {
    res.status(500).json({ error: 'Internal server error', details: error.message });
  }
});

module.exports = router;
