const mongoose = require('mongoose');

// Define schema for Form
const formSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      required: true,
      trim: true,
    },
    questions: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Question', // Assuming you have a separate Question model
        required: true,
      },
    ],
    headerImage: {
      type: String, // Optional field for header image URL
      default: '',
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
    updatedAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true, // Automatically manages createdAt and updatedAt
  }
);

// Create and export Form model
const Form = mongoose.model('Form', formSchema);

module.exports = Form;
