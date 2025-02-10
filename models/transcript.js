const mongoose = require("mongoose");

const transcriptSchema = new mongoose.Schema({
    userId: String,
    read: { type: Boolean, default: false }, // Add a read field
    transcripts: [
        {
            transcript: [
                {
                    sender: String,
                    message: String,
                    timestamp: { type: Date, default: Date.now },
                },
            ],
        },
    ],
    note: String, // New field for storing notes
});

module.exports = mongoose.model("Transcript", transcriptSchema);