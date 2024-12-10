const mongoose = require('mongoose');

// Connect to MongoDB
const mongoURI = 'mongodb://localhost:27017/minAppDb'; // Replace this with your MongoDB URI

mongoose.connect(mongoURI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log('Connected to MongoDB');
  })
  .catch((err) => {
    console.error('Error connecting to MongoDB', err);
  });
