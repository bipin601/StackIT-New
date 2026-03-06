const Answer = require('../models/Answer');

exports.createAnswer = async (req, res) => {
  const { body, questionId } = req.body;
  try {
    const answer = new Answer({ body, questionId, author: req.user.id });
    await answer.save();
    res.json(answer);
  } catch (err) {
    res.status(500).json({ msg: 'Error' });
  }
};

exports.getAnswers = async (req, res) => {
  const answers = await Answer.find({ questionId: req.query.questionId });
  res.json(answers);
};