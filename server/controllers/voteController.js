const Question = require('../models/Question');
const Answer = require('../models/Answer');
const User = require('../models/User');

async function updateBadges(user) {
  if (user.reputation >= 100 && !user.badges.includes('Bronze')) user.badges.push('Bronze');
  if (user.reputation >= 500 && !user.badges.includes('Silver')) user.badges.push('Silver');
  // Add more
}

exports.vote = async (req, res) => {
  const { type, id, direction } = req.body;
  const delta = direction === 'up' ? 10 : -2;
  let post, authorField = 'author';

  if (type === 'question') {
    post = await Question.findById(id);
  } else if (type === 'answer') {
    post = await Answer.findById(id);
  }

  if (!post) return res.status(404).json({ msg: 'Not found' });

  // Simple vote: no check for duplicates, etc.
  post.votes += delta;
  await post.save();

  const user = await User.findById(post[authorField]);
  user.reputation += delta;
  await updateBadges(user);
  await user.save();

  res.json({ votes: post.votes });
};