const express = require('express');
const voiceRoutes = require('./VoiceRoutes');


const router = express.Router();

router.use('/voices', voiceRoutes);

module.exports = router;