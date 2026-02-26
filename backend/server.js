import express from "express";
import fetch from "node-fetch";
import cors from "cors";
import dotenv from "dotenv";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

const HF_API_URL = "https://api-inference.huggingface.co/models/Lykon/DreamShaper";

app.post("/generate", async (req, res) => {
  try {
    const { prompt } = req.body;

    if (!prompt) {
      return res.status(400).json({ error: "Prompt required" });
    }

    if (!process.env.HF_API_KEY) {
      console.error("HF_API_KEY not set in environment");
      return res.status(500).json({
        error: "Server misconfiguration: HF_API_KEY not set",
      });
    }

    const response = await fetch(HF_API_URL, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.HF_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        inputs: prompt,
        options: { wait_for_model: true },
      }),
      timeout: 120000, // 2 minute timeout for model to load
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("HuggingFace Error:", errorText);
      return res.status(500).json({ error: errorText });
    }

    const contentType = response.headers.get("content-type");

    if (!contentType || !contentType.startsWith("image")) {
      const errorText = await response.text();
      console.error("Non-image response from HuggingFace:", errorText);
      return res.status(500).json({
        error: "Hugging Face did not return an image",
        details: errorText,
      });
    }

    const arrayBuffer = await response.arrayBuffer();
    const base64Image = Buffer.from(arrayBuffer).toString("base64");

    res.json({ image: base64Image });
  } catch (err) {
    console.error("Server Error:", err);
    res.status(500).json({ error: "Server error" });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on ${PORT}`));
