const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');


const app = express();
const teleUser = require('./backend/services/profile');
const transactionsRouter = require('./backend/services/tonwallet');
const referralRoutes = require('./routes/referralRoutes');
const creditRoutes = require('./routes/creditRoutes');

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
app.use('/api/', teleUser);

// telegram TonWallet
app.use('/api/transactions', transactionsRouter);




















// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
