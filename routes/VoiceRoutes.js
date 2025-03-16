const express = require('express');

const { getVoices } = require('../controllers/voiceController');

const router = express.Router();

router.get('/', getVoices);

module.exports = router;
