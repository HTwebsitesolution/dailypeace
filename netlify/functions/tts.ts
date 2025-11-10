// netlify/functions/tts.ts
import type { Handler } from "@netlify/functions";
import crypto from "crypto";
import OpenAI from "openai";

const OPENAI_KEY = process.env.OPENAI_API_KEY!;
const OPENAI_TTS_MODEL = "tts-1"; // OpenAI TTS model
const DEFAULT_VOICE = "alloy";              // try "alloy", "echo", "fable", "onyx", "nova", "shimmer"
const MAX_CHARS = 1400;                     // bound latency/cost

const openai = new OpenAI({ apiKey: OPENAI_KEY });

function clean(text: string) {
  return (text || "").replace(/\s+/g, " ").trim().slice(0, MAX_CHARS);
}
function etagFor(payload: string) {
  return crypto.createHash("sha256").update(payload).digest("hex");
}

async function openaiTTS(text: string, voice: string) {
  const response = await openai.audio.speech.create({
    model: OPENAI_TTS_MODEL,
    voice: voice as any,
    input: text,
  });
  const buffer = Buffer.from(await response.arrayBuffer());
  return buffer;
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
      body: audio.toString("base64"),
    };
  } catch (err: any) {
    return { statusCode: 500, body: JSON.stringify({ error: err?.message || "tts-failed" }) };
  }
};

