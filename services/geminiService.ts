
import { GoogleGenAI } from "@google/genai";
import { AspectRatio } from "../types";

// In a real production app, these calls would happen on a Node.js server to protect the API Key.
// For this SPA demo, we use process.env.API_KEY as per the instructions.
const getGenAI = () => {
  if (!process.env.API_KEY) {
    throw new Error("Missing API Key. Please ensure it is configured.");
  }
  return new GoogleGenAI({ apiKey: process.env.API_KEY });
};

export const generateImage = async (
  prompt: string, 
  aspectRatio: AspectRatio = AspectRatio.SQUARE,
  baseImage?: string // Optional base64 for image-to-image
): Promise<string> => {
  const ai = getGenAI();
  const model = 'gemini-2.5-flash-image';

  try {
    const parts: any[] = [{ text: prompt }];
    
    if (baseImage) {
      // Removing data:image/png;base64, prefix if present
      const cleanBase64 = baseImage.split(',').pop() || baseImage;
      parts.push({
        inlineData: {
          data: cleanBase64,
          mimeType: 'image/png'
        }
      });
    }

    const response = await ai.models.generateContent({
      model,
      contents: { parts },
      config: {
        imageConfig: {
          aspectRatio: aspectRatio as any
        }
      }
    });

    // Find the image part in the response
    for (const part of response.candidates?.[0]?.content?.parts || []) {
      if (part.inlineData) {
        return `data:${part.inlineData.mimeType};base64,${part.inlineData.data}`;
      }
    }

    throw new Error("No image data found in model response");
  } catch (error) {
    console.error("Gemini API Error:", error);
    throw error;
  }
};
