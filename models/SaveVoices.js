const { mongoose } = require("mongoose");

const saveVoiceSchema = new mongoose.Schema({
    language_code: { type: String, required: true },
    text_to_convert: { type: String, required: true },
    voice_name: { type: String, required: true },
    voice: { type: String, required: true },
    key: String,
    url: String,
    uploadedAt: { type: Date, default: Date.now },

});

const SaveVoice = mongoose.model('SaveVoice', saveVoiceSchema);

module.exports.SaveVoice = SaveVoice;