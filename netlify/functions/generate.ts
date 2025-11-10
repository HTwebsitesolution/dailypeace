import type { Handler } from "@netlify/functions";
import OpenAI from "openai";

declare const process: {
  env: {
    [key: string]: string | undefined;
    OPENAI_API_KEY?: string;
    PERPLEXITY_API_KEY?: string;
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

const TIMEOUT_MS = 12000;

async function withTimeout<T>(p: Promise<T>, ms = TIMEOUT_MS): Promise<T> {
  return new Promise((resolve, reject) => {
    const t = setTimeout(() => reject(new Error("timeout")), ms);
    p.then(v => { clearTimeout(t); resolve(v); })
     .catch(e => { clearTimeout(t); reject(e); });
  });
}

/* ---------- MODERATION CHECK ---------- */
async function checkModeration(text: string): Promise<boolean> {
  try {
    const openaiApiKey = process.env.OPENAI_API_KEY;
    if (!openaiApiKey) return true; // Skip if no key
    
    const mod = await fetch("https://api.openai.com/v1/moderations", {
      method: "POST",
      headers: { 
        "Content-Type": "application/json", 
        Authorization: `Bearer ${openaiApiKey}` 
      },
      body: JSON.stringify({ input: text })
    });
    const modResult = await mod.json();
    return !modResult.results?.[0]?.flagged; // Return true if not flagged
  } catch (e) {
    console.warn("[Moderation] Check failed, allowing content:", e);
    return true; // Fail open if moderation check fails
  }
}

/* ---------- PRIMARY: OPENAI ---------- */
async function callOpenAI(
  systemPrompt: string, 
  userPrompt: string, 
  mode: Mode
): Promise<any> {
  const openaiApiKey = process.env.OPENAI_API_KEY;
  if (!openaiApiKey) {
    throw new Error("OPENAI_API_KEY environment variable is not set");
  }
  
  const client = new OpenAI({ apiKey: openaiApiKey });
  const resp = await withTimeout(
    client.chat.completions.create({
      model: "gpt-4o-mini",
      temperature: 0.7,
      response_format: { type: "json_object" },
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userPrompt }
      ]
    })
  );
  
  const json = resp.choices[0]?.message?.content || "{}";
  const parsed = JSON.parse(json);
  
  // Optional moderation check on response text
  const isSafe = await checkModeration(parsed.text || "");
  if (!isSafe) {
    throw new Error("moderation flagged");
  }
  
  return parsed;
}

/* ---------- SECONDARY: PERPLEXITY (FAILOVER) ---------- */
async function callPerplexity(
  systemPrompt: string,
  userPrompt: string,
  mode: Mode
): Promise<any> {
  const perplexityKey = process.env.PERPLEXITY_API_KEY;
  if (!perplexityKey) {
    throw new Error("PERPLEXITY_API_KEY environment variable is not set");
  }

  // Build simplified prompt for Perplexity (it doesn't support JSON mode like GPT)
  const simplePrompt = `${systemPrompt}\n\n${userPrompt}\n\nReturn your response as natural text. Do not include URLs, sources, or citation marks.`;
  
  const response = await withTimeout(
    fetch("https://api.perplexity.ai/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${perplexityKey}`,
      },
      body: JSON.stringify({
        model: "sonar-medium",
        temperature: 0.7,
        max_tokens: 500,
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: userPrompt },
        ],
      }),
    })
  );

  if (!response.ok) {
    throw new Error(`perplexity:${response.status}`);
  }

  const data = await response.json();
  const text = (data.choices?.[0]?.message?.content || "")
    .replace(/\[[0-9]+\]/g, "")
    .replace(/https?:\/\/\S+/g, "")
    .replace(/<[^>]*>/g, "")
    .trim();

  // Extract citations if present in verses from the prompt
  const citations: string[] = [];
  const verseMatches = text.match(/\b([A-Z][a-z]+)\s+\d+:\d+/g);
  if (verseMatches) {
    citations.push(...verseMatches);
  }

  const result = {
    text,
    citations: citations.length > 0 ? citations : [],
    disclaimer: "AI-generated reflection inspired by Scripture (not a divine message).",
  };
  
  // Optional moderation check on Perplexity response
  const isSafe = await checkModeration(text);
  if (!isSafe) {
    throw new Error("moderation flagged");
  }
  
  return result;
}

/* ---------- ROUTER WITH FAILOVER ---------- */
async function generateWithFallback(
  systemPrompt: string,
  userPrompt: string,
  mode: Mode
): Promise<any> {
  try {
    return await callOpenAI(systemPrompt, userPrompt, mode);
  } catch (e: any) {
    const shouldFailover = /timeout|429|5\d\d|ENOTFOUND|ECONNRESET/i.test(String(e.message));
    if (!shouldFailover) throw e;
    console.log("[Generate] OpenAI failed, trying Perplexity fallback:", e.message);
    return await callPerplexity(systemPrompt, userPrompt, mode);
  }
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

    const systemPrompt = getSystemPrompt(body.mode || "conversational", body.user_text);
    const userPrompt = `User: ${body.user_text}\nScripture supplied:\n${verseContext}\nUse only these verses for grounding.`;
    
    const parsedResponse = await generateWithFallback(
      systemPrompt,
      userPrompt,
      body.mode || "conversational"
    );
    
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
