const Question = require('../models/Question');

exports.createQuestion = async (req, res) => {
  const { title, body, tags } = req.body;
  try {
    const question = new Question({ title, body, tags, author: req.user.id });
    await question.save();
    res.json(question);
  } catch (err) {
    res.status(500).json({ msg: 'Error' });
  }
};

exports.getQuestions = async (req, res) => {
  const { search } = req.query;
  const query = search ? { $text: { $search: search } } : {};
  const questions = await Question.find(query).sort({ votes: -1, createdAt: -1 });
  res.json(questions);
};

exports.getQuestion = async (req, res) => {
  const question = await Question.findById(req.params.id);
  res.json(question);
};

exports.acceptAnswer = async (req, res) => {
  const { answerId } = req.body;
  const question = await Question.findById(req.params.id);
  if (question.author.toString() !== req.user.id) return res.status(403).json({ msg: 'Not authorized' });
  question.acceptedAnswer = answerId;
  await question.save();
  // Award rep to answer author
  const Answer = require('../models/Answer');
  const User = require('../models/User');
  const answer = await Answer.findById(answerId);
  const user = await User.findById(answer.author);
  user.reputation += 15;
  await updateBadges(user);
  await user.save();
  res.json(question);
};