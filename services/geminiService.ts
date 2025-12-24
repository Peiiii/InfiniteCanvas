
import { GoogleGenAI, Type } from "@google/genai";

const API_KEY = process.env.API_KEY || "";

export const breakdownTask = async (taskTitle: string, taskDescription: string) => {
  const ai = new GoogleGenAI({ apiKey: API_KEY });
  
  const prompt = `Break down the following task into 3-5 manageable sub-tasks for a visual planner:
  Task: ${taskTitle}
  Description: ${taskDescription}
  
  Respond with a JSON array of sub-tasks, each with a 'title' and 'description'.`;

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

    return JSON.parse(response.text);
  } catch (error) {
    console.error("AI breakdown failed:", error);
    throw error;
  }
};
