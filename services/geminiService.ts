import { GoogleGenAI } from "@google/genai";
import { ArtStyle } from "../types";

export const checkApiKey = async (): Promise<boolean> => {
  if (window.aistudio && window.aistudio.hasSelectedApiKey) {
    return await window.aistudio.hasSelectedApiKey();
  }
  return false;
};

export const promptForKeySelection = async (): Promise<void> => {
  if (window.aistudio && window.aistudio.openSelectKey) {
    await window.aistudio.openSelectKey();
  } else {
    console.error("AI Studio environment not detected.");
  }
};

export const generateTetBackground = async (style: ArtStyle): Promise<string> => {
  // We use gemini-3-pro-image-preview for high quality images.
  // We require the user to have selected an API key via window.aistudio.
  
  // Re-initialize client to pick up the latest injected key
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  
  const basePrompt = `A vertical (9:16 aspect ratio) festive background image for a Vietnamese New Year 2026 (Tet Binh Ngo - Year of the Horse) greeting card. 
  The image should have empty negative space in the CENTER or TOP CENTER to place text overlay.
  Key elements: A majestic or cute horse (depending on style), apricot blossoms (yellow), peach blossoms (pink), red lanterns, lucky money envelopes. 
  Colors: Vibrant Red and Gold. High resolution, 8k quality.
  
  Specific Style: ${style}`;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-pro-image-preview',
      contents: {
        parts: [
          {
            text: basePrompt,
          },
        ],
      },
      config: {
        imageConfig: {
          aspectRatio: "9:16",
          imageSize: "1K" // Using 1K for speed, could be upgraded if needed
        },
      },
    });

    for (const part of response.candidates?.[0]?.content?.parts || []) {
      if (part.inlineData) {
        const base64EncodeString: string = part.inlineData.data;
        return `data:image/png;base64,${base64EncodeString}`;
      }
    }
    
    throw new Error("No image data found in response.");
  } catch (error) {
    console.error("Error generating image:", error);
    throw error;
  }
};