const express = require('express');
const router = express.Router();
const responseController = require('../controllers/responseController');

// Route for submitting a response to a form
router.post('/submit-response', responseController.submitResponse);

// Route for getting all responses for a specific form by formId
router.get('/:formId/responses', responseController.getResponsesByFormId);

// Route for generating a shareable URL for a form response
router.get('/:formId/response/:token/shareable-url', responseController.getShareableUrl);

// Route for getting a specific response by formId and response token
router.get('/:formId/response/:token', responseController.getResponseByToken);

module.exports = router;
