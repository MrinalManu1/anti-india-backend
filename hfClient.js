const axios = require("axios");

const HF_ENDPOINT = "https://Mrinal240305-anti-india-detector.hf.space/run/predict";

async function analyzeWithHF(comments) {
  // HF expects TEXTBOX input → string
  const payload = {
    data: [
      JSON.stringify(comments)
    ]
  };

  const response = await axios.post(HF_ENDPOINT, payload, {
    headers: { "Content-Type": "application/json" },
    timeout: 120000 // HF cold starts are slow
  });

  // Gradio response format
  return response.data.data[0];
}

module.exports = { analyzeWithHF };
