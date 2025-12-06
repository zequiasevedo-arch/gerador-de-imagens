
import { GoogleGenAI } from "@google/genai";

const apiKey = process.env.API_KEY || '';

// Safely initialize the AI client only when needed to handle missing keys gracefully in UI
const getAiClient = () => {
  if (!apiKey) {
    throw new Error("API Key is missing from environment variables.");
  }
  return new GoogleGenAI({ apiKey });
};

export const generateCharacterImage = async (prompt: string, referenceImages: string[] = []): Promise<string> => {
  try {
    const ai = getAiClient();
    
    const parts: any[] = [];

    // Add all provided reference images to the parts
    for (const img of referenceImages) {
      if (img) {
        // Expecting format: "data:image/png;base64,..."
        const [meta, data] = img.split(',');
        const mimeType = meta.split(':')[1].split(';')[0];
        
        parts.push({
          inlineData: {
            data: data,
            mimeType: mimeType
          }
        });
      }
    }

    parts.push({ text: prompt });
    
    // Using gemini-2.5-flash-image for standard high-quality generation
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash-image',
      contents: {
        parts: parts
      },
      config: {
        imageConfig: {
          aspectRatio: "1:1", 
          // imageSize is not supported for flash-image, defaulting to model standard
        }
      }
    });

    // Iterate to find the image part
    if (response.candidates && response.candidates[0].content && response.candidates[0].content.parts) {
      for (const part of response.candidates[0].content.parts) {
        if (part.inlineData && part.inlineData.data) {
           return `data:${part.inlineData.mimeType || 'image/png'};base64,${part.inlineData.data}`;
        }
      }
    }

    throw new Error("No image data found in response.");
  } catch (error: any) {
    console.error("Gemini Image Generation Error:", error);
    throw new Error(error.message || "Failed to generate image.");
  }
};