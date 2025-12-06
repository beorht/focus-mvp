import { GoogleGenAI } from "@google/genai";

const gak = "AIzaSyBftd0C_yf4KyD0Nk2Vt9YXSO3aBhmwDRk"

// The client gets the API key from the environment variable.
const ai = new GoogleGenAI({apiKey: gak});

export const generate_content = async ( prompt ) => {
    const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: prompt,
    });

    return response.text;
}
