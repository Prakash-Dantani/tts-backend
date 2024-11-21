const express = require('express');
const tts = require('./voice-rss-tts/index.js');

const app = express();

app.get('/tts', (req, res) => {
    tts.speech({
        key: 'c11c660046c947c6b435567697b95b50',
        hl: 'en-us',
        v: 'Linda',
        src: 'Hello, World!',
        r: 0,
        c: 'mp3',
        f: '44khz_16bit_stereo',
        ssml: false,
        b64: true,
        callback: function (error, content) {
            console.log(content.toString('utf-8'));
            res.send(error || content);
            return res.status(200).send({ message: "Successfully Audio Generated.", data: content });
        }
    });
});

const port = process.env.port || 3000;
app.listen(port, () => console.log(`App Listening on Port http://localhost:${port}`))