const getVoices = (req, res) => {
    res.json({ "message": "All voice getted" });
};

const getVoice = (req, res) => {
    res.json({ "message": "Single voice getted" });
};

module.exports = { getVoices, getVoice };