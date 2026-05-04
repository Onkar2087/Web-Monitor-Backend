import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY)

export const generateSummary = async (diffText) => {
    try {
        const model = genAI.getGenerativeModel({
            model: "gemini-1.5-flash"
        })

        const prompt = `
        Summarize the key changes from the following diff.
        Be concise, factual and clear.
        Highlight only meaningful changes.
        Also include exact evidence lines.

        Diff:
        ${diffText}
        `

        const result = await model.generateContent(prompt)
        const response = await result.response

        return response.text()

    } catch (error) {
        console.error("Gemini Error:", error.message);
        return "No summary generated (LLM unavailable)"
    }
}