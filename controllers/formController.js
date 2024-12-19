const Form = require('../models/Form');
const Response = require('../models/Response');
const crypto = require('crypto'); // For generating unique shareable URLs

// Create a new form
const createForm = async (req, res) => {
  try {
    const { title, description, questions, headerImage } = req.body;

    // Ensure that 'questions' is an array and that each question has a valid type
    if (!Array.isArray(questions)) {
      return res.status(400).json({ message: 'Questions must be an array' });
    }

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
    const { query } = req.query;

    if (!query) {
      return res.status(400).json({ message: 'Search query is required' });
    }

    const forms = await Form.find({
      $or: [
        { title: { $regex: query, $options: 'i' } },
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

    // Validate ObjectId format before querying MongoDB
    if (!isValidObjectId(id)) {
      return res.status(400).json({ message: 'Invalid form ID' });
    }

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

// Validate ObjectId
const isValidObjectId = (id) => {
  const mongoose = require('mongoose');
  return mongoose.Types.ObjectId.isValid(id);
};

// Delete a form by ID
const deleteForm = async (req, res) => {
  try {
    const { id } = req.params;

    if (!isValidObjectId(id)) {
      return res.status(400).json({ message: 'Invalid form ID' });
    }

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

    if (!isValidObjectId(id)) {
      return res.status(400).json({ message: 'Invalid form ID' });
    }

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

    if (!isValidObjectId(id)) {
      return res.status(400).json({ message: 'Invalid form ID' });
    }

    const form = await Form.findById(id);

    if (!form) {
      return res.status(404).json({ message: 'Form not found' });
    }

    const shareableToken = crypto.randomBytes(16).toString('hex');
    const shareableUrl = `${process.env.FRONTEND_URL}/form/${shareableToken}`;

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

    if (!isValidObjectId(formId)) {
      return res.status(400).json({ message: 'Invalid form ID' });
    }

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

    if (!isValidObjectId(formId)) {
      return res.status(400).json({ message: 'Invalid form ID' });
    }

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
  searchForms,
  getFormById,
  deleteForm,
  duplicateForm,
  getShareableUrl,
  submitResponse,
  getResponsesByFormId,
};
