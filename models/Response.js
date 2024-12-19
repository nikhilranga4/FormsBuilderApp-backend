const mongoose = require('mongoose');

// Define schema for Response
const responseSchema = new mongoose.Schema({
  formId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Form', // Reference to the Form model
    required: true,
  },
  responses: [
    {
      questionId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Question', // Reference to the Question model
        required: true,
      },
      answer: {
        type: mongoose.Schema.Types.Mixed, // Store the response as any type (e.g., String, Number, Array, etc.)
        required: true,
      },
    }
  ],
  token: {
    type: String,
    required: true,
    unique: true, // Ensure the token is unique
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

// Create and export Response model
const Response = mongoose.model('Response', responseSchema);

module.exports = Response;
