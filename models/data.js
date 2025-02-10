const mongoose = require("mongoose");

const dataSchema = new mongoose.Schema({
    googleId: String,
    title: String,
    model: {
        type: String,
        required: true,
    },
    transcripts: [
        {
            sender: String,
            message: String,
            timestamp: { type: Date, default: Date.now },
        },
    ],
});

const ChatModel = mongoose.model("datas", dataSchema);
module.exports = ChatModel;


