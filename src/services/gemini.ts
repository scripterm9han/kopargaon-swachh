import { GoogleGenAI, Type } from "@google/genai";
import { WasteAnalysis } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || "" });

export async function analyzeWasteImage(base64Image: string, mimeType: string, lang: string = 'hi'): Promise<WasteAnalysis> {
  const model = "gemini-1.5-flash";
  
  const languageNames: Record<string, string> = {
    hi: "Hindi (हिन्दी)",
    mr: "Marathi (मराठी)",
    en: "English"
  };

  const prompt = `Analyze this image of a waste item. Identify the primary material and classify it according to the waste segregation guidelines of Kopargaon Municipal Council, Maharashtra, India.
  Recommend the correct sorting bin: Blue for dry recyclables, Green for kitchen compost, Black for general landfill, and Red for hazards/e-waste.
  Respond with ONLY a JSON object matching this exact schema:
  {
    "item_name": string,
    "material_type": "plastic" | "paper" | "glass" | "metal" | "e-waste" | "organic" | "mixed" | "other",
    "recyclable": boolean,
    "confidence": number,
    "disposal_instructions": string,
    "hazard_flag": boolean,
    "notes": string | null
  }
  
  CRITICAL: You MUST write the "item_name", "disposal_instructions", and "notes" fields in the ${languageNames[lang] || 'Hindi'} language. Keep the "material_type" in English as specified in the schema.`;

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
          item_name: { type: Type.STRING },
          material_type: { 
            type: Type.STRING,
            enum: ['plastic', 'paper', 'glass', 'metal', 'e-waste', 'organic', 'mixed', 'other']
          },
          recyclable: { type: Type.BOOLEAN },
          confidence: { type: Type.NUMBER },
          disposal_instructions: { type: Type.STRING },
          hazard_flag: { type: Type.BOOLEAN },
          notes: { type: Type.STRING }
        },
        required: ['item_name', 'material_type', 'recyclable', 'confidence', 'disposal_instructions', 'hazard_flag']
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

export async function askVoiceAssistant(query: string, lang: string = 'hi'): Promise<string> {
  const model = "gemini-1.5-flash";
  
  const languageNames: Record<string, string> = {
    hi: "Hindi (हिन्दी)",
    mr: "Marathi (मराठी)",
    en: "English"
  };

  const response = await ai.models.generateContent({
    model,
    contents: `You are Kopargaon Swachh Segregator, the official smart waste assistant for Kopargaon city in Maharashtra, India. The citizen asked: "${query}". 
    Tell them which waste category it belongs to (plastic, paper, glass, metal, e-waste, organic), which bin color to use (Blue for recyclables, Green for kitchen compost, Black for non-recyclable landfill, Red for e-waste/hazards), and a short local disposal tip aligned with Kopargaon Municipal Council standards. 
    You MUST respond in the ${languageNames[lang] || 'Hindi'} language. Keep the answer concise, friendly, and practical.`
  });

  return response.text || "I'm sorry, I couldn't process that request.";
}
