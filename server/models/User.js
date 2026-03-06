const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  reputation: { type: Number, default: 1 },
  badges: { type: [String], default: [] },
  followedTags: { type: [String], default: [] },
});

module.exports = mongoose.model('User', userSchema);