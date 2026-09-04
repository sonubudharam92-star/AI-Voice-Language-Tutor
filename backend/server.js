require("dotenv").config();

const express = require("express");
const OpenAI = require("openai");

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const app = express();

app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Methods", "GET,POST,PUT,DELETE,OPTIONS");
  res.header("Access-Control-Allow-Headers", "Content-Type");
  next();
});

const PORT = 3000;

app.get("/", (req, res) => {
  res.send("AI Voice Language Tutor Backend is working! 🎉");
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});

app.get("/api/test", async (req, res) => {
  try {
    const sentence = req.query.sentence;

    if (!sentence) {
      return res.status(400).json({
        error: "Please provide a sentence.",
      });
    }

    const response = await client.responses.create({
      model: "gpt-5.6-luna",
      instructions:
        "You are a friendly language tutor. Check the learner's sentence for grammar and word choice. Give a corrected sentence and a short, simple explanation.",
      input: `Learner's sentence: "${sentence}"`,
    });

    res.json({
      feedback: response.output_text,
    });
  } catch (error) {
    console.error("LLM error:", error);
    res.status(500).json({
      error: "Failed to get feedback from the AI.",
    });
  }
});
