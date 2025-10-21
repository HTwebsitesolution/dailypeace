
import type { Handler } from "@netlify/functions";
import OpenAI from "openai";

declare const process: {
  env: {
    [key: string]: string | undefined;
    OPENAI_API_KEY?: string;
  };
};

type Mode = "conversational" | "biblical" | "reflective";
type Verse = { ref: string; text: string };
type Payload = { user_text: string; mode?: Mode; verses: Verse[] };

function getSystemPrompt(mode: Mode, userText: string): string {
  if (mode === "conversational") {
    return `You are a compassionate, intelligent devotional guide offering spiritual encouragement. Do not impersonate Jesus or speak as God.

Use the supplied Bible verses as your foundation. Provide warm, pastoral guidance in accessible language (8th-10th grade level).

Instructions:
- Write 140-220 words of thoughtful, encouraging response
- Reference the provided verses naturally in your guidance
- Address the user's specific concern with biblical wisdom
- End with ONE gentle, open-ended question for reflection
- Include a brief prayer TO GOD (not as God) in 40-60 words
- Maintain hope while being realistic about struggles
- Avoid making promises beyond what Scripture teaches

Response format: JSON with "text", "citations", and "disclaimer" fields.
Citations: List verse references used (e.g., ["John 14:1", "Psalm 23:4"])
Disclaimer: "AI-generated reflection inspired by Scripture (not a divine message)."`;
  }
  
  if (mode === "reflective") {
    return `You are a thoughtful spiritual guide helping with contemplative reflection. Do not impersonate Jesus or speak as God.

Use the supplied Bible verses for deep spiritual contemplation. Provide meditative, introspective guidance in accessible language.

Instructions:
- Write 80-120 words focused on deeper spiritual meaning
- Draw insights from the provided verses for contemplation
- Help the user reflect on God's character and spiritual truths
- End with TWO thoughtful reflection questions for personal meditation
- No prayer needed - focus on contemplative insights
- Encourage spiritual growth and deeper understanding
- Connect verses to broader spiritual themes

Response format: JSON with "text", "citations", and "disclaimer" fields.
Citations: List verse references used (e.g., ["Romans 8:28", "Jeremiah 29:11"])
Disclaimer: "AI-generated reflection inspired by Scripture (not a divine message)."`;
  }

  return ""; // biblical mode returns verses only
}

export const handler: Handler = async (event) => {
  if (event.httpMethod === "OPTIONS") return cors(200, {});
  if (event.httpMethod !== "POST") return cors(405, { error: "POST only" });

  try {
    const body = JSON.parse(event.body || "{}") as Payload;
    const verses = body.verses ?? [];
    const verseContext = verses.map(v => `${v.ref}: ${v.text}`).join("\n");

    if (body.mode === "biblical") {
      // Biblical mode: Return only verses, no AI-generated text
      return cors(200, { 
        inspired_message: null,
        mode: "biblical",
        verses_only: true,
        message: "Scripture speaks for itself - meditate on these verses for guidance."
      });
    }

    const openaiApiKey = process.env.OPENAI_API_KEY;
    if (!openaiApiKey) {
      throw new Error("OPENAI_API_KEY environment variable is not set");
    }
    const client = new OpenAI({ apiKey: openaiApiKey });
    const systemPrompt = getSystemPrompt(body.mode || "conversational", body.user_text);
    const resp = await client.chat.completions.create({
      model: "gpt-4o-mini",
      temperature: 0.7,
      response_format: { type: "json_object" },
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: `User: ${body.user_text}\nScripture supplied:\n${verseContext}\nUse only these verses for grounding.` }
      ]
    });

    const json = resp.choices[0]?.message?.content || "{}";
    const parsedResponse = JSON.parse(json);
    
    return cors(200, { 
      inspired_message: parsedResponse,
      mode: body.mode || "conversational",
      verses_count: verses.length
    });
  } catch (e: any) {
    console.error(e);
    return cors(500, { error: "Generation failed", detail: String(e?.message || e) });
  }
};

function cors(status: number, body: any) {
  return {
    statusCode: status,
    headers: {
      "Content-Type": "application/json",
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Headers": "Content-Type, Authorization",
      "Access-Control-Allow-Methods": "POST, OPTIONS"
    },
    body: JSON.stringify(body)
  };
}
