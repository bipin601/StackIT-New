const express = require('express');
const auth = require('../middleware/auth');
const { getUser, followTag } = require('../controllers/userController');

const router = express.Router();

router.get('/:id', auth, getUser);
router.post('/follow-tag', auth, followTag);

module.exports = router;