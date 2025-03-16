const express = require('express');
const { textToSpeech } = require('../controllers/textToSpeechController');

const router = express.Router();
router.post('/', textToSpeech)

module.exports = router;