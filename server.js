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
app.use('/api', routes); // Prefix allconst express = require('express');
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

// MongoDB connection using the environment variable for MongoDB URI
const mongoURI = process.env.MONGO_URI;

if (!mongoURI) {
  console.error('Error: MongoDB URI is not defined');
  process.exit(1);
}

mongoose.connect(mongoURI, { 
  useNewUrlParser: true,
  useUnifiedTopology: true 
})
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.log('Error connecting to MongoDB:', err));

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
 routes with /api

// MongoDB connection (using the MongoDB URI from environment variables)
mongoose.connect(process.env.MONGODB_URI, { 
  useNewUrlParser: true,
  useUnifiedTopology: true 
})
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.log('Error connecting to MongoDB:', err));

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
