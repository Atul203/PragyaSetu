import { GoogleGenerativeAI } from "@google/generative-ai";

export async function POST(req) {
  try {
    const body = await req.json();
    const { category, difficulty } = body;

    // ✅ Validation
    if (!category || !difficulty) {
      return new Response(
        JSON.stringify({ error: "Missing required fields" }),
        {
          status: 400,
          headers: { "Content-Type": "application/json" },
        }
      );
    }

    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

    const model = genAI.getGenerativeModel({
      model: "gemini-3-flash-preview",
    });

    const prompt = `
Generate 3 unique project ideas for:

Category: ${category}
Difficulty: ${difficulty}

Return ONLY a valid JSON array like this:

[
  {
    "title": "Project Title",
    "description": "Short description",
    "techStack": ["React", "Node"],
    "features": ["Feature 1", "Feature 2"]
  }
]
`;

    const result = await model.generateContent(prompt);
    const text = result.response.text();

    // ✅ Clean markdown if present
    const cleaned = text
      .replace(/```json/g, "")
      .replace(/```/g, "")
      .trim();

    // ✅ Extract only JSON array (very important)
    const jsonStart = cleaned.indexOf("[");
    const jsonEnd = cleaned.lastIndexOf("]") + 1;

    if (jsonStart === -1 || jsonEnd === -1) {
      throw new Error("No JSON array found in AI response");
    }

    const jsonString = cleaned.slice(jsonStart, jsonEnd);

    const projects = JSON.parse(jsonString);

    return new Response(JSON.stringify(projects), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });

  } catch (error) {
    console.error("API Error:", error);

    return new Response(
      JSON.stringify({ error: "Failed to generate projects" }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      }
    );
  }
}
