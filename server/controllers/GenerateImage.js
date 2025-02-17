import axios from "axios";
import * as dotenv from "dotenv";
dotenv.config();

export const generateImage = async (req, res, next) => {
  try {
    const { prompt } = req.body;

    if (!prompt) {
      return res.status(400).json({ error: "Prompt is required" });
    }

    console.log(`Generating image for prompt: ${prompt}`);
    console.log("DeepAI API Key:", process.env.DEEPAI_API_KEY); // Debugging

    if (!process.env.DEEPAI_API_KEY) {
      return res.status(500).json({ error: "API Key is missing" });
    }

    const response = await axios.post(
      "https://api.deepai.org/api/text2img",
      { text: prompt },
      {
        headers: { "Api-Key": process.env.DEEPAI_API_KEY }, // Fix header key format
      }
    );

    if (response.data && response.data.output_url) {
      return res.status(200).json({ photo: response.data.output_url });
    } else {
      return res.status(500).json({ error: "No image generated." });
    }
  } catch (error) {
    console.error("DeepAI Error:", error.response?.data || error.message);
    res.status(500).json({ error: "Image generation failed." });
  }
};
