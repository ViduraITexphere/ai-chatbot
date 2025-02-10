const express = require("express");
const router = express.Router();
const transcriptController = require("../controllers/transcriptController");

router.post("/save-transcript", transcriptController.saveTranscript);
router.put("/transcripts/:id/read", transcriptController.markAsRead); // Add this route
router.delete("/transcripts/:id", transcriptController.deleteTranscript); // Add this route
router.post("/transcripts/:id/note", transcriptController.addNoteToTranscript);

module.exports = router;