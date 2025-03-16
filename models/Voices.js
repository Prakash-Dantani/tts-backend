const { mongoose } = require("mongoose");

const voiceSchema = new mongoose.Schema({
    language_code: { type: String, required: true },
    language_name: { type: String, required: true },
    voice_name: { type: String, required: true },
    gender: { type: String, required: true },
    default: { type: String, default: 'No' },
});

const Voices = mongoose.model("Voices", voiceSchema);

export default Voices;


