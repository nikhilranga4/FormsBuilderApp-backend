const express = require('express');
const router = express.Router();

// Importing the form and response routes
const formRoutes = require('./formRoutes');
const responseRoutes = require('./responseRoutes');

// Route for handling form-related requests
router.use('/forms', formRoutes);

// Route for handling response-related requests
router.use('/responses', responseRoutes);

module.exports = router;
