// backend/index.js
const express = require("express");
const cors = require("cors");
const axios = require("axios");
require("dotenv").config(); 


const app = express();
app.use(cors());
app.use(express.json());

// POST route for AI suggestion
app.post("/api/suggest", async (req, res) => {
  const formData = req.body;

  const prompt = `You are an AI resume coach. Give helpful and actionable improvement suggestions for this resume:\n
  Name: ${formData.name}\n  Email: ${formData.email}\n  Phone: ${formData.phone}\n  Skills: ${formData.skills}\n  Experience: ${formData.experience}\n  Education: ${formData.education}\n  LinkedIn: ${formData.linkedin}\n  GitHub: ${formData.github}`;

  try {
    const response = await axios.post(
      "https://api.openai.com/v1/chat/completions",
      {
        model: "gpt-3.5-turbo",
        messages: [{ role: "user", content: prompt }],
        max_tokens: 300,
      },
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
        },
      }
    );

    res.json({ suggestion: response.data.choices[0].message.content });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to get AI suggestion." });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
