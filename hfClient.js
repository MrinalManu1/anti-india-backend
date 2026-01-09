const axios = require("axios");

const HF_ENDPOINT = "https://Mrinal240305-anti-india-detector.hf.space/api/predict";

async function analyzeWithHF(comments) {
  try {
    // Your Gradio app expects a JSON string as input
    const payload = {
      data: [
        JSON.stringify(comments) // Must be stringified JSON
      ]
    };

    console.log("Sending to HF:", {
      endpoint: HF_ENDPOINT,
      commentCount: comments.length,
      samplePayload: JSON.stringify(comments).substring(0, 200)
    });

    const response = await axios.post(HF_ENDPOINT, payload, {
      headers: { 
        "Content-Type": "application/json"
      },
      timeout: 120000 // 2 minutes for cold starts
    });

    console.log("HF Response received:", response.data);

    // Gradio returns data in response.data.data array
    const result = response.data.data[0];
    
    // The result should already be the parsed JSON object
    return result;
    
  } catch (error) {
    console.error("HF API Error Details:", {
      status: error.response?.status,
      statusText: error.response?.statusText,
      data: error.response?.data,
      message: error.message,
      endpoint: HF_ENDPOINT
    });
    
    // More specific error messages
    if (error.response?.status === 405) {
      throw new Error("Hugging Face endpoint not accessible. The Space might be sleeping or the API format changed.");
    } else if (error.code === 'ECONNABORTED') {
      throw new Error("Hugging Face request timed out. The model might be loading (cold start).");
    }
    
    throw new Error(`Hugging Face API error: ${error.response?.status || error.message}`);
  }
}

module.exports = { analyzeWithHF };