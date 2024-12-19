const Question = require('../models/Question');

// Create a new question
const createQuestion = async (req, res) => {
  try {
    const { questionText, questionType, options, columns, rows } = req.body;

    // Validate questionType
    if (!['Text', 'Grid', 'CheckBox'].includes(questionType)) {
      return res.status(400).json({ message: 'Invalid question type' });
    }

    const newQuestion = new Question({
      questionText,
      questionType,
      options,
      columns,
      rows,
    });

    const savedQuestion = await newQuestion.save();
    res.status(201).json(savedQuestion);
  } catch (error) {
    console.error('Error creating question:', error.message);
    res.status(500).json({ message: 'Error creating question' });
  }
};

// Get all questions
const getQuestions = async (req, res) => {
  try {
    const questions = await Question.find();
    res.status(200).json(questions);
  } catch (error) {
    console.error('Error fetching questions:', error.message);
    res.status(500).json({ message: 'Error fetching questions' });
  }
};

module.exports = {
  createQuestion,
  getQuestions,
};
