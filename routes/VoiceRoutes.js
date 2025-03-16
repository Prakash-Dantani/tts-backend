const express = require('express');

const { getVoices, getVoice, getCountryVoice } = require('../controllers/voiceController');

const router = express.Router();

router.get('/', getVoices);
router.get('/:id', getVoice);
router.post('/get-country-voice', getCountryVoice);

module.exports = router;
