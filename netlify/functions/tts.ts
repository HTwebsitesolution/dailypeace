// netlify/functions/tts.ts
import type { Handler } from "@netlify/functions";
import crypto from "crypto";

const OPENAI_KEY = process.env.OPENAI_API_KEY!;
const OPENAI_TTS_MODEL = "tts-1"; // OpenAI TTS model
const DEFAULT_VOICE = "alloy";              // try "alloy", "echo", "fable", "onyx", "nova", "shimmer"
const MAX_CHARS = 1400;                     // bound latency/cost

function clean(text: string) {
  return (text || "").replace(/\s+/g, " ").trim().slice(0, MAX_CHARS);
}
function etagFor(payload: string) {
  return crypto.createHash("sha256").update(payload).digest("hex");
}

async function openaiTTS(text: string, voice: string) {
  const r = await fetch("https://api.openai.com/v1/audio/speech", {
    method: "POST",
    headers: { Authorization: `Bearer ${OPENAI_KEY}`, "Content-Type": "application/json" },
    body: JSON.stringify({
      model: OPENAI_TTS_MODEL,
      voice,              // e.g. "alloy", "echo", "fable", "onyx", "nova", "shimmer"
      input: text,
    }),
  });
  if (!r.ok) throw new Error(`openai:${r.status}`);
  return new Uint8Array(await r.arrayBuffer());
}

export const handler: Handler = async (event) => {
  try {
    if (event.httpMethod !== "POST") return { statusCode: 405, body: "Method Not Allowed" };
    const { text: raw, voice = DEFAULT_VOICE } = JSON.parse(event.body || "{}") as {
      text?: string; voice?: string;
    };

    const text = clean(raw || "");
    if (!text) return { statusCode: 400, body: "Missing text" };

    const etag = etagFor(`${voice}|${text}`);
    const headers = {
      "Content-Type": "audio/mpeg",
      "Cache-Control": "public, max-age=31536000, immutable",
      ETag: etag,
    } as Record<string, string>;

    if (event.headers["if-none-match"] === etag) {
      return { statusCode: 304, headers, body: "" };
    }

    const audio = await openaiTTS(text, voice);
    return {
      statusCode: 200,
      isBase64Encoded: true,
      headers,
      body: Buffer.from(audio).toString("base64"),
    };
  } catch (err: any) {
    return { statusCode: 500, body: JSON.stringify({ error: err?.message || "tts-failed" }) };
  }
};

