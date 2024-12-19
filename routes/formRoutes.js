const express = require('express');
const router = express.Router();
const formController = require('../controllers/formController');

// Route for creating a new form
router.post('/create', formController.createForm);

// Route for getting all forms
router.get('/', formController.getForms);

// Route for searching forms by title or description
router.get('/search', formController.searchForms);

// Route for getting a form by ID
router.get('/:id', formController.getFormById);

// Route for deleting a form by ID
router.delete('/:id', formController.deleteForm);

// Route for duplicating a form by ID
router.post('/:id/duplicate', formController.duplicateForm);

// Route for generating a shareable URL for a form
router.get('/:id/shareable-url', formController.getShareableUrl);

// Route for submitting a response to a form
router.post('/submit-response', formController.submitResponse);

// Route for getting all responses for a specific form
router.get('/:formId/responses', formController.getResponsesByFormId);

module.exports = router;
