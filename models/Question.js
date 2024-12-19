const mongoose = require('mongoose');

const questionSchema = new mongoose.Schema({
  questionText: {
    type: String,
    required: true,
  },
  questionType: {
    type: String,
    enum: ['Text', 'Grid', 'CheckBox'], // Allowed types
    required: true,
  },
  options: {
    type: [String], // Options for checkbox or grid questions
    default: [],
  },
  columns: {
    type: [String], // Columns for Grid questions
    default: [],
  },
  rows: {
    type: [String], // Rows for Grid questions
    default: [],
  },
});

const Question = mongoose.model('Question', questionSchema);

module.exports = Question;
