const express = require('express');
const auth = require('../middleware/auth');
const { createAnswer, getAnswers } = require('../controllers/answerController');

const router = express.Router();

router.post('/', auth, createAnswer);
router.get('/', getAnswers);

module.exports = router;