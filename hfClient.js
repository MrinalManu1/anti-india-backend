const axios = require("axios");

const HF_ENDPOINT = "https://Mrinal240305-anti-india-detector.hf.space/api/predict";

async function analyzeWithHF(comments) {
  // Gradio 4+ expects this format
  const payload = {
    data: [
      JSON.stringify(comments)
    ]
  };

  try {
    const response = await axios.post(HF_ENDPOINT, payload, {
      headers: { "Content-Type": "application/json" },
      timeout: 120000 // HF cold starts are slow
    });

    // Gradio response format
    return response.data.data[0];
  } catch (error) {
    console.error("HF API Error:", error.response?.data || error.message);
    throw new Error(`Hugging Face API error: ${error.response?.status || error.message}`);
  }
}

module.exports = { analyzeWithHF };