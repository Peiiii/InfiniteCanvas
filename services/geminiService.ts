
import { GoogleGenAI, Type } from "@google/genai";

// Removed local API_KEY variable to follow guidelines for process.env.API_KEY usage

export const expandIdea = async (title: string, description: string) => {
  // Always use a named parameter and access process.env.API_KEY directly
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  
  const prompt = `Act as a creative synthesizer. Expand on the following concept into 3-4 deeply related branches or exploratory paths for a visual thinking space:
  Concept: ${title}
  Context: ${description}
  
  Each branch should offer a new perspective or a concrete next step for exploration.
  Respond with a JSON array of objects, each with a 'title' and 'description'.`;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              title: { type: Type.STRING },
              description: { type: Type.STRING },
            },
            required: ["title", "description"],
          },
        },
      },
    });

    // response.text is a property, not a method. Using it with a fallback.
    return JSON.parse(response.text || "[]");
  } catch (error) {
    console.error("AI synthesis failed:", error);
    throw error;
  }
};
