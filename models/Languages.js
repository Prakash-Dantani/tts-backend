const { mongoose } = require("mongoose");

const languageSchema = mongoose.Schema({
    language_code: { type: String, required: true },
    language_name: { type: String, required: true },
});

const Languages = mongoose.model('languages', languageSchema);

module.exports = Languages;