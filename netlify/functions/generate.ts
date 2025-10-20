
import type { Handler } from "@netlify/functions";
import OpenAI from "openai";

type Mode = "conversational" | "biblical" | "reflective";
type Verse = { ref: string; text: string };
type Payload = { user_text: string; mode?: Mode; verses: Verse[] };

const SYSTEM = `You are a compassionate, intelligent devotional guide. Do not impersonate Jesus.
Use only the supplied verses for grounding (Gospels). Warm, pastoral tone (8th–10th grade).
140–220 words. End with ONE gentle question. Add a short prayer TO GOD (<=60 words).
No promises beyond Scripture. Return JSON: { "text": string, "citations": string[], "disclaimer": string }.
Disclaimer must be exactly: "AI-generated reflection inspired by Scripture (not a divine message)."`;

export const handler: Handler = async (event) => {
  if (event.httpMethod === "OPTIONS") return cors(200, {});
  if (event.httpMethod !== "POST") return cors(405, { error: "POST only" });

  try {
    const body = JSON.parse(event.body || "{}") as Payload;
    const verses = body.verses ?? [];
    const verseContext = verses.map(v => `${v.ref}: ${v.text}`).join("\n");

    if (body.mode === "biblical") {
      return cors(200, { inspired_message: null, prompts: { question: null } });
    }

    const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY! });
    const resp = await client.chat.completions.create({
      model: "gpt-4o-mini",
      temperature: 0.7,
      response_format: { type: "json_object" },
      messages: [
        { role: "system", content: SYSTEM },
        { role: "user", content: `User: ${body.user_text}\nScripture supplied:\n${verseContext}\nUse only these verses for grounding.` }
      ]
    });

    const json = resp.choices[0]?.message?.content || "{}";
    return cors(200, { inspired_message: JSON.parse(json) });
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
