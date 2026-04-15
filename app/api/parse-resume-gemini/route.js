import { GoogleGenerativeAI } from "@google/generative-ai";
import pdf from "pdf-parse";

export const runtime = "nodejs";

// Initialize Gemini
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

export async function POST(req) {
  try {
    const formData = await req.formData();
    const file = formData.get("file");

    if (!file) {
      return new Response(
        JSON.stringify({ error: "No file uploaded" }),
        { status: 400 }
      );
    }

    // Convert PDF to text
    const buffer = Buffer.from(await file.arrayBuffer());
    const pdfData = await pdf(buffer);
    const resumeText = pdfData.text;

    // Load Gemini model
    const model = genAI.getGenerativeModel({
      model: "gemini-3-flash-preview",
    });

    // AI Prompt
    const prompt = `
You are a professional AI resume analyzer.

Analyze the following resume text and return ONLY valid JSON in this structure:

{
  "personalInfo": {
    "name": "",
    "email": "",
    "phone": "",
    "location": ""
  },
  "skills": {
    "technical": [],
    "soft": []
  },
  "experience": [
    {
      "title": "",
      "company": "",
      "duration": "",
      "description": ""
    }
  ],
  "projects": [
    {
      "name": "",
      "tech": [],
      "description": ""
    }
  ],
  "education": [
    {
      "degree": "",
      "institution": "",
      "year": "",
      "cgpa": ""
    }
  ],
  "certifications": [],
  "summary": "",
  "analysis": {
    "employabilityScore": 0,
    "strengths": [],
    "improvements": [],
    "matchedRoles": [],
    "salaryRange": ""
  }
}

Resume Text:
${resumeText}
`;

    const result = await model.generateContent(prompt);
    const responseText = result.response.text();

    // Remove markdown formatting if Gemini adds it
    const cleanedText = responseText
      .replace(/```json/g, "")
      .replace(/```/g, "")
      .trim();

    return new Response(cleanedText, { status: 200 });

  } catch (error) {
    console.error("Gemini Parsing Error:", error);

    return new Response(
      JSON.stringify({ error: "AI parsing failed" }),
      { status: 500 }
    );
  }
}
