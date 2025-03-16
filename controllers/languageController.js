const Languages = require("../models/Languages");

const getLanguages = async (req, res) => {
    try {
        const languages = await Languages.find();
        res.status(200).json({ "message": "Successfully Get All Languages.", languages: languages })

    } catch (error) {
        res.status(500).json({ "message": "Error While Fetching Languages" });
    }
};

module.exports = { getLanguages };