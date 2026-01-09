const { Client } = require("@gradio/client");

const HF_SPACE = "Mrinal240305/anti-india-detector";

async function analyzeWithHF(comments) {
  let client;
  
  try {
    console.log(`Connecting to Gradio Space: ${HF_SPACE}...`);
    console.log(`Processing ${comments.length} comments`);

    // Connect to the Gradio space
    client = await Client.connect(HF_SPACE, {
      hf_token: process.env.HF_TOKEN || undefined // Optional: add HF token if needed
    });
    
    console.log("Connected successfully!");

    // The input to your Gradio app is a JSON string
    const inputJson = JSON.stringify(comments);
    
    console.log("Sending data to model...");
    
    // Call the prediction - Gradio Client handles the API format automatically
    const result = await client.predict("/predict", { 
      input_text: inputJson 
    });

    console.log("Received response from HF");

    // Parse the result - it comes back as a string from your api_wrapper
    const parsedResult = JSON.parse(result.data);
    
    return parsedResult;
    
  } catch (error) {
    console.error("Gradio Client Error:", {
      message: error.message,
      stack: error.stack
    });
    
    throw new Error(`Hugging Face analysis failed: ${error.message}`);
    
  } finally {
    // Clean up the connection
    if (client) {
      try {
        await client.close();
      } catch (e) {
        // Ignore cleanup errors
      }
    }
  }
}

module.exports = { analyzeWithHF };