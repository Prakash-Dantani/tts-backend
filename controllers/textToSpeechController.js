const { SaveVoice } = require('../models/SaveVoices.js');
const User = require('../models/User.js');
const tts = require('../voice-rss-tts/index.js');
// require("../voice-rss-tts")

const textToSpeech = (req, res) => {
    try {
        tts.speech({
            key: process.env.TTS_KEY,
            hl: req.body.language_code,
            v: req.body.voice_name,
            src: req.body.text_to_convert,
            r: 0,
            c: 'mp3',
            f: '44khz_16bit_stereo',
            ssml: false,
            b64: true,
            callback: function (error, content) {

                return res.status(200).send({ message: "Successfully Audio Generated.", data: content.toString('utf-8') });
            }
        });
    } catch (error) {
        return res.status(500).json({ "message": `Error While Text Converted to Speech : ${error}` })

    }
}

// Save Voice
const saveVoice = async (req, res) => {
    try {
        // console.log('user id : ',)
        const saveData = await SaveVoice.create({
            language_code: req.body.language_code,
            voice_name: req.body.voice_name,
            text_to_convert: req.body.text_to_convert,
            voice: req.body.voice,
            googleId: 123
        });

        return res.status(200).send({ message: "Successfully Audio Saved." });
    } catch (error) {
        return res.status(500).json({ "message": `Error While Text Converted to Speech : ${error}` })

    }
}

// get Save Voice
const getSaveVoice = async (req, res) => {
    try {
        console.log('Request comes to saved voice method');
        const savedVoice = await SaveVoice.find();

        return res.status(200).send({ message: "Successfully Saved Audio fetched.", "voices": savedVoice });
    } catch (error) {
        return res.status(500).json({ "message": `Error While Text Converted to Speech : ${error}` })

    }
}

module.exports = { textToSpeech, saveVoice, getSaveVoice };