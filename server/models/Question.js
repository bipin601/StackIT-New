const mongoose = require('mongoose');

const questionSchema = new mongoose.Schema({
  title: { type: String, required: true },
  body: { type: String, required: true },
  author: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  tags: { type: [String], default: [] },
  votes: { type: Number, default: 0 },
  acceptedAnswer: { type: mongoose.Schema.Types.ObjectId, ref: 'Answer', default: null },
}, { timestamps: true });

questionSchema.index({ title: 'text', body: 'text', tags: 'text' });

module.exports = mongoose.model('Question', questionSchema);