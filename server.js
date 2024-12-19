const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const dotenv = require('dotenv');
const cors = require('cors');
const routes = require('./routes'); // Import routes from the /routes directory

// Load environment variables from .env file
dotenv.config();

// Create an instance of the Express app
const app = express();

// Middleware
app.use(bodyParser.json()); // To parse incoming JSON requests
app.use(cors()); // Enable Cross-Origin Request sharing (if necessary)

// Use routes defined in /routes/index.js (forms and responses)
app.use('/api', routes); // Prefix all routes with /api

// MongoDB connection (removing deprecated options)
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/formApp')
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.log('Error connecting to MongoDB:', err));

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
