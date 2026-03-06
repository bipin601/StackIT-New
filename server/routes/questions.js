const express = require('express');
const auth = require('../middleware/auth');
const { createQuestion, getQuestions, getQuestion, acceptAnswer } = require('../controllers/questionController');

const router = express.Router();

router.post('/', auth, createQuestion);
router.get('/', getQuestions);
router.get('/:id', getQuestion);
router.put('/:id/accept', auth, acceptAnswer);

module.exports = router;