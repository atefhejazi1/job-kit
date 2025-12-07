import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({
  apiKey: process.env.GOOGLE_API_KEY,
});

export async function generateCoverLetter(prompt: string) {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.0-flash",
      contents: prompt,
    });

    return response.text || "Error: Could not generate cover letter.";
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "Error: Could not generate cover letter.";
  }
}
