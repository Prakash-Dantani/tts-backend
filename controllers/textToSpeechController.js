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

module.exports = { textToSpeech };