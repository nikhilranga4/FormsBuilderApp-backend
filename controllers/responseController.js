const Form = require('../models/Form');
const Response = require('../models/Response');
const crypto = require('crypto'); // For generating unique shareable URLs

// Create a new form response
const submitResponse = async (req, res) => {
  try {
    const { formId, responses } = req.body;

    // Check if form exists
    const form = await Form.findById(formId);
    if (!form) {
      return res.status(404).json({ message: 'Form not found' });
    }

    // Save the response to the database
    const newResponse = new Response({
      formId,
      responses,
      // Include token when submitting a response
      token: crypto.randomBytes(16).toString('hex'), // Generate a unique token
    });

    const savedResponse = await newResponse.save();
    res.status(201).json(savedResponse);
  } catch (error) {
    console.error('Error submitting response:', error.message);
    res.status(500).json({ message: 'Error submitting response' });
  }
};

// Get all responses for a specific form by formId
const getResponsesByFormId = async (req, res) => {
  try {
    const { formId } = req.params;

    // Fetch responses for the given formId
    const responses = await Response.find({ formId });

    if (responses.length === 0) {
      return res.status(404).json({ message: 'No responses found for this form' });
    }

    res.status(200).json(responses);
  } catch (error) {
    console.error('Error fetching responses:', error.message);
    res.status(500).json({ message: 'Error fetching responses' });
  }
};

// Generate a shareable URL for a form response
const getShareableUrl = async (req, res) => {
  try {
    const { formId } = req.params;

    const form = await Form.findById(formId);
    if (!form) {
      return res.status(404).json({ message: 'Form not found' });
    }

    // Generate a unique token for the response sharing URL
    const shareableToken = crypto.randomBytes(16).toString('hex'); // Example unique token

    // Save the token in the response model (you should already have saved it during response submission)
    const response = await Response.findOne({ formId });
    if (response) {
      response.token = shareableToken; // Update token for the response
      await response.save();
    }

    const shareableUrl = `${process.env.FRONTEND_URL}/form/${formId}/response/${shareableToken}`;
    res.status(200).json({ shareableUrl });
  } catch (error) {
    console.error('Error generating shareable URL:', error.message);
    res.status(500).json({ message: 'Error generating shareable URL' });
  }
};

// Get a specific response by formId and response token
const getResponseByToken = async (req, res) => {
  try {
    const { formId, token } = req.params;

    // Retrieve response by formId and token
    const response = await Response.findOne({ formId, token });

    if (!response) {
      return res.status(404).json({ message: 'Response not found' });
    }

    res.status(200).json(response);
  } catch (error) {
    console.error('Error fetching response:', error.message);
    res.status(500).json({ message: 'Error fetching response' });
  }
};

module.exports = {
  submitResponse,
  getResponsesByFormId,
  getShareableUrl,
  getResponseByToken,
};
