const express = require('express');
const voiceRoutes = require('./VoiceRoutes');
const languageRoutes = require('./LanguageRoutes');
const textToSpeechRoutes = require('./TextToSpeech');

const router = express.Router();

router.use('/voices', voiceRoutes);
router.use('/languages', languageRoutes);
router.use('/text-to-speech', textToSpeechRoutes)

module.exports = router;