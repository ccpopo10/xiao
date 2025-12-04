import { GoogleGenAI, Type } from "@google/genai";
import { ScriptResponse } from "../types";

// Initialize Gemini AI Client
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

/**
 * Generates the 6-frame storyboard script using a text model.
 */
export const generateStoryboardScript = async (
  productName: string,
  productDescription: string,
  tone: string
): Promise<ScriptResponse> => {
  const model = "gemini-3-pro-preview"; // Using Pro for better reasoning and advertising logic

  const systemInstruction = `
    You are an award-winning TVC (Television Commercial) Director and Cinematographer.
    Your task is to create a professional 6-frame storyboard sequence for a product.
    
    The sequence must follow standard advertising logic:
    1. Hook (Attention Grabber)
    2. Problem/Need
    3. Product Introduction (The Solution)
    4. Benefit/Feature Demonstration (Key Visual)
    5. Emotional Payoff/Lifestyle Connection
    6. Call to Action / Logo Reveal

    For each frame, you MUST provide:
    - frame_number: The sequence order (1-6).
    - shot_type: e.g., "Wide Shot", "Extreme Close Up", "Dutch Angle", "Over the Shoulder".
    - action_description: The director's visual instructions.
    - voiceover_script: The exact spoken words (VO) or audio description (e.g., "Music swells", "Sound of engine roaring").
    - estimated_duration: The duration of the shot (e.g., "2s", "1.5s").
    - visual_generation_prompt: A highly detailed, vivid image generation prompt suitable for an AI image generator. 
      Include details about lighting (e.g., "cinematic lighting", "golden hour", "volumetric fog"), 
      composition (e.g., "rule of thirds", "symmetrical", "depth of field"), camera type (e.g., "Arri Alexa", "35mm lens"), 
      and color grading (e.g., "teal and orange", "high contrast").
      
    Ensure the visual style is cohesive across all 6 frames.
  `;

  const prompt = `
    Product Name: ${productName}
    Product Description: ${productDescription}
    Desired Tone: ${tone}

    Generate a 6-frame storyboard in JSON format with voiceover and timing.
  `;

  try {
    const response = await ai.models.generateContent({
      model,
      contents: prompt,
      config: {
        systemInstruction,
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            storyboard: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  frame_number: { type: Type.INTEGER },
                  shot_type: { type: Type.STRING },
                  action_description: { type: Type.STRING },
                  visual_generation_prompt: { type: Type.STRING },
                  voiceover_script: { type: Type.STRING },
                  estimated_duration: { type: Type.STRING },
                },
                required: [
                  "frame_number", 
                  "shot_type", 
                  "action_description", 
                  "visual_generation_prompt",
                  "voiceover_script",
                  "estimated_duration"
                ],
              },
            },
          },
        },
      },
    });

    const text = response.text;
    if (!text) throw new Error("No script generated");
    
    return JSON.parse(text) as ScriptResponse;
  } catch (error) {
    console.error("Error generating script:", error);
    throw error;
  }
};

/**
 * Generates a single image frame using the image model.
 */
export const generateImageFrame = async (
  visualPrompt: string,
  aspectRatio: "16:9" | "1:1" | "9:16" = "16:9"
): Promise<string> => {
  const model = "gemini-2.5-flash-image";

  try {
    const response = await ai.models.generateContent({
      model,
      contents: {
        parts: [{ text: visualPrompt }],
      },
      config: {
        imageConfig: {
          aspectRatio: aspectRatio,
          // count: 1 (default)
        },
      },
    });

    let base64Image = "";
    
    // Iterate to find the image part
    for (const part of response.candidates?.[0]?.content?.parts || []) {
      if (part.inlineData && part.inlineData.data) {
        base64Image = part.inlineData.data;
        break; 
      }
    }

    if (!base64Image) {
      throw new Error("No image data returned in response");
    }

    return `data:image/png;base64,${base64Image}`;
  } catch (error) {
    console.error("Error generating image:", error);
    throw error;
  }
};