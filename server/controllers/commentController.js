const Comment = require('../models/Comment');

exports.createComment = async (req, res) => {
  const { body, type, postId } = req.body;
  try {
    const comment = new Comment({ body, type, postId, author: req.user.id });
    await comment.save();
    res.json(comment);
  } catch (err) {
    res.status(500).json({ msg: 'Error' });
  }
};

exports.getComments = async (req, res) => {
  const { type, postId } = req.query;
  const comments = await Comment.find({ type, postId });
  res.json(comments);
};