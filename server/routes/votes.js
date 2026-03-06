const express = require('express');
const auth = require('../middleware/auth');
const { vote } = require('../controllers/voteController');

const router = express.Router();

router.post('/', auth, vote);

module.exports = router;