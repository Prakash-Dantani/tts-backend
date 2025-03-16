const express = require('express');
const tts = require('./voice-rss-tts/index.js');
const cors = require('cors');
const routess = require('./routes/index.js');
const { mongoose } = require('mongoose');
require('dotenv').config();

const app = express();

app.use(express.json())
app.use("/api", routess);

app.use(cors());

mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
    .then(() => console.log('Database Successfully connected.'))
    .catch((error) => console.error('Database Not connected : ', error));

// app.get('/tts', (req, res) => {
//     tts.speech({
//         key: 'c11c660046c947c6b435567697b95b50',
//         hl: 'en-us',
//         // v: 'puja',
//         src: "My friend list prakash, Mohit, Hitesh, Sagar, Tauhid, Vijay, Parita, Gazala, Payal, and last is Naresh. My boss name is S.A. Sabarinathan",
//         r: 0,
//         c: 'mp3',
//         f: '44khz_16bit_stereo',
//         ssml: false,
//         b64: true,
//         callback: function (error, content) {
//             // res.send(error || content);
//             // var aaa = toPhonetic("My friend list prakash, Mohit, Hitesh, Sagar, Tauhid, Vijay, Parita, Gazala, Payal, and last is Naresh. My boss name is S.A. Sabarinathan");
//             // alert(aaa);
//             return res.status(200).send({ message: "Successfully Audio Generated.", data: content.toString('utf-8') });
//         }
//     });

// function toPhonetic(text) {
//     const phonetics = {
//         a: "ay", b: "bee", c: "see", d: "dee", e: "ee",
//         f: "ef", g: "gee", h: "aitch", i: "eye", j: "jay",
//         k: "kay", l: "el", m: "em", n: "en", o: "oh",
//         p: "pee", q: "cue", r: "ar", s: "ess", t: "tee",
//         u: "you", v: "vee", w: "double-you", x: "ex",
//         y: "why", z: "zee",
//     };

//     return text
//         .split("")
//         .map(char => phonetics[char.toLowerCase()] || char)
//         .join(" ");
// }


// });

const port = process.env.port || 3000;
app.listen(port, () => console.log(`App Listening on Port http://localhost:${port}`))