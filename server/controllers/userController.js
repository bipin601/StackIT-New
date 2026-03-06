const User = require('../models/User');

exports.getUser = async (req, res) => {
  const id = req.params.id === 'me' ? req.user.id : req.params.id;
  const user = await User.findById(id).select('-password');
  res.json(user);
};

exports.followTag = async (req, res) => {
  const { tag } = req.body;
  const user = await User.findById(req.user.id);
  if (!user.followedTags.includes(tag)) user.followedTags.push(tag);
  await user.save();
  res.json(user);
};