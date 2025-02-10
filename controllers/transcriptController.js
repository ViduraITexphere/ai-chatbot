const mongoose = require("mongoose");
const TranscriptModel = require("../models/transcript");

exports.saveTranscript = async (req, res) => {
    console.log("req.body:", req.body);
    try {
        const { objectId, transcript } = req.body;
        console.log("objectId:", objectId);
        console.log("transcript:", transcript);

        const newChatData = new TranscriptModel({
            userId: objectId,
            transcripts: [{ transcript }],
        });

        await newChatData.save();
        return res.status(201).json({ message: "Transcript saved successfully" });
    } catch (error) {
        console.error("Error saving transcript:", error);
        return res.status(500).json({ error: "Internal Server Error" });
    }
};

// exports.markAsRead = async (req, res) => {
//   const { id } = req.params;
//   console.log(`Received request to mark transcript ${id} as read`); // Add this line
//   try {
//     const transcript = await TranscriptModel.findOneAndUpdate(
//       { "transcripts._id": id },
//       { $set: { "transcripts.$.read": true } },
//       { new: true }
//     );

//     if (!transcript) {
//       return res.status(404).json({ error: "Transcript not found" });
//     }

//     console.log(`Transcript ${id} marked as read`); // Add this line
//     return res
//       .status(200)
//       .json({ message: "Transcript marked as read", transcript });
//   } catch (error) {
//     console.error("Error marking transcript as read:", error);
//     return res.status(500).json({ error: "Internal Server Error" });
//   }
// };

exports.markAsRead = async (req, res) => {
    console.log("markAsRead called");
    const { id } = req.params;
    try {
        const transcript = await TranscriptModel.findById(id);
        if (!transcript) {
            return res.status(404).json({ error: "Transcript not found" });
        }
        transcript.read = true;
        await transcript.save();
        return res.status(200).json({ message: "Transcript marked as read" });
    } catch (error) {
        console.error("Error marking transcript as read:", error);
        return res.status(500).json({ error: "Internal Server Error" });
    }
};

exports.deleteTranscript = async (req, res) => {
    const { id } = req.params;
    console.log("Delete request received for ID:", id);
    try {
        const deletedTranscript = await TranscriptModel.findOneAndDelete({
            _id: id,
        });
        if (!deletedTranscript) {
            console.log("Transcript not found for ID:", id);
            return res.status(404).json({ error: "Transcript not found" });
        }
        console.log("Transcript deleted successfully for ID:", id);
        return res.status(200).json({ message: "Transcript deleted successfully" });
    } catch (error) {
        console.error("Error deleting transcript:", error);
        return res.status(500).json({ error: "Internal Server Error" });
    }
};

exports.addNoteToTranscript = async (req, res) => {
    const { id } = req.params;
    const { note } = req.body;

    try {
        const updatedTranscript = await TranscriptModel.findByIdAndUpdate(
            id,
            { note },
            { new: true }
        );

        if (!updatedTranscript) {
            return res.status(404).json({ error: "Transcript not found" });
        }

        return res
            .status(200)
            .json({
                message: "Note added successfully",
                transcript: updatedTranscript,
            });
    } catch (error) {
        console.error("Error adding note to transcript:", error);
        return res.status(500).json({ error: "Internal Server Error" });
    }
};