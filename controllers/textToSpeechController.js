const { PutObjectCommand } = require('@aws-sdk/client-s3');
const s3 = require('../config/AwsS3.js');
const { SaveVoice } = require('../models/SaveVoices.js');
const User = require('../models/User.js');
const tts = require('../voice-rss-tts/index.js');
// require("../voice-rss-tts")
require('dotenv').config({ path: '.env.development' });

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
        const voice = req.body.voice;
        const googleId = '123';

        const base64String = voice.split(';base64,').pop();
        const buffer = Buffer.from(base64String, 'base64');
        const key = `${Date.now()}-${googleId}`;
        const filename = `${Date.now()}-${googleId}.mp3`;

        // upload paramter to s3
        const uploadParams = {
            Bucket: process.env.S3_BUCKET_NAME,
            Key: key,
            Body: buffer,
            ACL: 'public-read',
            ContentEncoding: 'base64',
            ContentType: 'audio/mpeg'
        };

        // uploading files to s3
        const command = new PutObjectCommand(uploadParams);
        await s3.send(command);
        // return res.status(200).send(uploadParams);

        // const result = await s3.send(params).promise();

        const fileUrl = `https://${process.env.S3_BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/${key}`;


        // Store data into Mongo db
        const saveData = await SaveVoice.create({
            language_code: req.body.language_code,
            voice_name: req.body.voice_name,
            text_to_convert: req.body.text_to_convert,
            voice: req.body.voice,
            googleId: 123,
            key: key,
            url: fileUrl
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