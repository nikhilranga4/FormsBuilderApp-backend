const Form = require('../models/Form');
const Response = require('../models/Response');
const crypto = require('crypto'); // For generating unique shareable URLs

// Create a new form
const createForm = async (req, res) => {
  try {
    const { title, description, questions, headerImage } = req.body;

    // Ensure each question has a type and image (optional)
    const formattedQuestions = questions.map(question => {
      if (!question.type || !['Text', 'Grid', 'CheckBox'].includes(question.type)) {
        return res.status(400).json({ message: 'Invalid question type' });
      }
      if (question.type === 'Grid' && (!question.columns || !question.rows)) {
        return res.status(400).json({ message: 'Grid question must have columns and rows defined' });
      }
      return question;
    });

    const newForm = new Form({
      title,
      description,
      questions: formattedQuestions,
      headerImage,
    });

    const savedForm = await newForm.save();
    res.status(201).json(savedForm);
  } catch (error) {
    console.error('Error creating form:', error.message);
    res.status(500).json({ message: 'Error creating form' });
  }
};

// Get all forms
const getForms = async (req, res) => {
  try {
    const forms = await Form.find();
    res.status(200).json(forms);
  } catch (error) {
    console.error('Error fetching forms:', error.message);
    res.status(500).json({ message: 'Error fetching forms' });
  }
};

// Search forms by title or description
const searchForms = async (req, res) => {
  try {
    const { query } = req.query;  // query parameter to search by title or description

    if (!query) {
      return res.status(400).json({ message: 'Search query is required' });
    }

    // Search forms in title or description (case-insensitive)
    const forms = await Form.find({
      $or: [
        { title: { $regex: query, $options: 'i' } },  // i = case-insensitive
        { description: { $regex: query, $options: 'i' } },
      ],
    });

    if (forms.length === 0) {
      return res.status(404).json({ message: 'No forms found matching the search criteria' });
    }

    res.status(200).json(forms);
  } catch (error) {
    console.error('Error searching for forms:', error.message);
    res.status(500).json({ message: 'Error searching for forms' });
  }
};

// Get a single form by ID
const getFormById = async (req, res) => {
  try {
    const { id } = req.params;
    const form = await Form.findById(id);

    if (!form) {
      return res.status(404).json({ message: 'Form not found' });
    }

    res.status(200).json(form);
  } catch (error) {
    console.error('Error fetching form:', error.message);
    res.status(500).json({ message: 'Error fetching form' });
  }
};

// Delete a form by ID
const deleteForm = async (req, res) => {
  try {
    const { id } = req.params;

    const deletedForm = await Form.findByIdAndDelete(id);

    if (!deletedForm) {
      return res.status(404).json({ message: 'Form not found' });
    }

    // Optionally delete all associated responses
    await Response.deleteMany({ formId: id });

    res.status(200).json({ message: 'Form deleted successfully' });
  } catch (error) {
    console.error('Error deleting form:', error.message);
    res.status(500).json({ message: 'Error deleting form' });
  }
};

// Duplicate a form by ID
const duplicateForm = async (req, res) => {
  try {
    const { id } = req.params;

    const form = await Form.findById(id);

    if (!form) {
      return res.status(404).json({ message: 'Form not found' });
    }

    const duplicatedForm = new Form({
      title: `${form.title} (Copy)`,
      description: form.description,
      questions: form.questions,
      headerImage: form.headerImage,
    });

    const savedDuplicatedForm = await duplicatedForm.save();
    res.status(201).json(savedDuplicatedForm);
  } catch (error) {
    console.error('Error duplicating form:', error.message);
    res.status(500).json({ message: 'Error duplicating form' });
  }
};

// Generate a shareable URL for a form
const getShareableUrl = async (req, res) => {
  try {
    const { id } = req.params;

    const form = await Form.findById(id);

    if (!form) {
      return res.status(404).json({ message: 'Form not found' });
    }

    // Generate a unique token or slug for the form shareable URL
    const shareableToken = crypto.randomBytes(16).toString('hex'); // Example unique token
    const shareableUrl = `${process.env.FRONTEND_URL}/form/${shareableToken}`;

    // Optionally, you could store the token in the database with the form for future reference
    res.status(200).json({ shareableUrl });
  } catch (error) {
    console.error('Error generating shareable URL:', error.message);
    res.status(500).json({ message: 'Error generating shareable URL' });
  }
};

// Submit a response to a form
const submitResponse = async (req, res) => {
  try {
    const { formId, responses } = req.body;

    const newResponse = new Response({
      formId,
      responses,
    });

    const savedResponse = await newResponse.save();
    res.status(201).json(savedResponse);
  } catch (error) {
    console.error('Error submitting response:', error.message);
    res.status(500).json({ message: 'Error submitting response' });
  }
};

// Get all responses for a specific form
const getResponsesByFormId = async (req, res) => {
  try {
    const { formId } = req.params;

    const responses = await Response.find({ formId });
    res.status(200).json(responses);
  } catch (error) {
    console.error('Error fetching responses:', error.message);
    res.status(500).json({ message: 'Error fetching responses' });
  }
};

module.exports = {
  createForm,
  getForms,
  searchForms,          // New search endpoint
  getFormById,
  deleteForm,
  duplicateForm,
  getShareableUrl,
  submitResponse,
  getResponsesByFormId,
};
