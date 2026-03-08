import { GoogleGenAI, Type } from "@google/genai";
import { WasteAnalysis } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || "" });

export async function analyzeWasteImage(base64Image: string, mimeType: string): Promise<WasteAnalysis> {
  const model = "gemini-3-flash-preview";
  
  const prompt = `Analyze this image of a waste item. Identify the item and classify it into one of these categories: Recyclable, Organic, Non-Recyclable, or E-Waste.
  
  Determine the correct bin color:
  - Recyclable: Blue
  - Organic: Green
  - Non-Recyclable: Black
  - E-Waste: Red (Special collection)
  
  Provide clear disposal instructions and one helpful environmental tip.`;

  const response = await ai.models.generateContent({
    model,
    contents: [
      {
        parts: [
          { text: prompt },
          {
            inlineData: {
              data: base64Image.split(',')[1] || base64Image,
              mimeType: mimeType
            }
          }
        ]
      }
    ],
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          itemName: { type: Type.STRING },
          category: { 
            type: Type.STRING,
            enum: ['Recyclable', 'Organic', 'Non-Recyclable', 'E-Waste']
          },
          binColor: {
            type: Type.STRING,
            enum: ['Blue', 'Green', 'Black', 'Red']
          },
          disposalInstruction: { type: Type.STRING },
          environmentalTip: { type: Type.STRING }
        },
        required: ['itemName', 'category', 'binColor', 'disposalInstruction', 'environmentalTip']
      }
    }
  });

  try {
    return JSON.parse(response.text || "{}") as WasteAnalysis;
  } catch (error) {
    console.error("Failed to parse Gemini response:", error);
    throw new Error("Could not analyze the image. Please try again.");
  }
}

export async function askVoiceAssistant(query: string): Promise<string> {
  const model = "gemini-3-flash-preview";
  
  const response = await ai.models.generateContent({
    model,
    contents: `You are a Smart Waste Assistant. The user asked: "${query}". 
    Tell them which waste category it belongs to (Recyclable, Organic, Non-Recyclable, or E-Waste), 
    which bin color to use (Blue, Green, Black, or Red), and a short disposal tip. 
    Keep the answer concise and friendly.`
  });

  return response.text || "I'm sorry, I couldn't process that request.";
}
