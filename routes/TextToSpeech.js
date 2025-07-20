const express = require('express');
const { textToSpeech, saveVoice, getSaveVoice } = require('../controllers/textToSpeechController');

const router = express.Router();
router.post('/', textToSpeech);
router.post('/save-voice', saveVoice);
router.get('/saved-voices', getSaveVoice);


module.exports = router;