const { Voices } = require("../models/Voices");

const getVoices = async (req, res) => {
    try {
        const voices = await Voices.find();
        res.status(200).json({ "message": "Successfully Get All Voices.", "voices": voices });
    } catch (error) {
        res.status(500).json({ "message": "server Error encounterd." })
    }
};

const getVoice = async (req, res) => {
    try {
        const voices = await Voices.findById(req.params.id);
        res.status(200).json({ "message": "Successfully Get Voice.", "voices": voices });
    } catch (error) {
        res.status(500).json({ "message": "server Error encounterd." })
    }
};

const getCountryVoice = async (req, res) => {
    try {
        const voices = await Voices.find({ "language_code": req.body.language_code });
        res.status(200).json({ "message": "Successfully Get Voices.", "voices": voices });
    } catch (error) {
        res.status(500).json({ "message": "server Error encounterd." })
    }
};

module.exports = { getVoices, getVoice, getCountryVoice };