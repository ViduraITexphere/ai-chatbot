require("dotenv").config();
const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const { ObjectId } = mongoose.Types;
const ChatModel = require("./models/data");
const transcriptRouter = require("./routes/transcriptRoutes");
const { GoogleGenerativeAI } = require("@google/generative-ai");

// Initialize Express App
const app = express();
app.use(cors());
app.use(express.json());

// Environment Variables
const port = process.env.PORT || 5000;
const db_url = process.env.DB_URL;
const API_KEY = process.env.API_KEY;
const MODEL_NAME = "gemini-1.5-flash";

// Connect to MongoDB
mongoose.connect(db_url)
    .then(() => console.log("✅ Connected to MongoDB"))
    .catch(err => console.error("❌ MongoDB Connection Error:", err));

// Use Routes
app.use("/", transcriptRouter);

// AI Chat Function
async function runChat(userInput, chatData) {
    try {
        const genAI = new GoogleGenerativeAI(API_KEY);
        const model = genAI.getGenerativeModel({ model: MODEL_NAME });

        const generationConfig = {
            temperature: 0.9,
            maxOutputTokens: 2048,
        };

        const formattedHistory = chatData?.messages?.map(msg => ({
            role: msg.sender === "user" ? "user" : "model",
            parts: [{ text: msg.text }],
        })) || [];

        const knowledgeBase = chatData?.model?.trim() ||
            "You are a travel assistant chatbot that helps users with their itinerary.";

        const chatSession = model.startChat({ generationConfig, history: formattedHistory });

        const prompt = `
        You are a smart AI assistant named Gemini. You provide informative and helpful answers based on the provided knowledge base.
        ### Knowledge Base:
        ${knowledgeBase}
        ### User Query:
        ${userInput}
        ### AI Response:
        `;

        const result = await chatSession.sendMessage(prompt);
        return result?.response?.candidates?.[0]?.content?.parts?.[0]?.text ||
            "Sorry, I couldn't generate a response.";
    } catch (error) {
        console.error("❌ AI Chat Error:", error.message);
        return "Sorry, an error occurred while processing your request.";
    }
}

// Chat History API Endpoint
app.post("/chat-history/:id", async (req, res) => {
    try {
        const chatHistoryId = req.params.id;
        const userInput = req.body?.userInput;

        if (!ObjectId.isValid(chatHistoryId)) {
            return res.status(400).json({ error: "Invalid chat history ID" });
        }

        const chatData = await ChatModel.findById(chatHistoryId);
        if (!chatData) {
            return res.status(404).json({ error: "Chat history not found" });
        }

        if (!userInput) {
            return res.status(400).json({ error: "User input is required" });
        }

        console.log("📝 User Input:", userInput);
        const response = await runChat(userInput, chatData);
        console.log("🤖 AI Response:", response);

        res.json({ response });
    } catch (error) {
        console.error("❌ Error fetching chat history:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

// Start Server
app.listen(port, () => console.log(`🚀 Server running on port ${port}`));
