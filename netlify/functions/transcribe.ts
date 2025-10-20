
import type { Handler } from "@netlify/functions";
import OpenAI from "openai";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";

type Payload = { filename: string; base64: string; language?: string };

export const handler: Handler = async (event) => {
  if (event.httpMethod === "OPTIONS") return cors(200, {});
  if (event.httpMethod !== "POST") return cors(405, { error: "POST only" });

  try {
    const { filename, base64, language } = JSON.parse(event.body || "{}") as Payload;
    if (!base64) return cors(400, { error: "Missing base64" });

    const tmp = path.join(os.tmpdir(), filename || "audio.m4a");
    fs.writeFileSync(tmp, Buffer.from(base64, "base64"));

    const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY! });
    const transcription = await client.audio.transcriptions.create({
      file: fs.createReadStream(tmp) as any,
      model: "whisper-1",
      language: language || "en"
    });

    try { fs.unlinkSync(tmp); } catch {}

    return cors(200, { text: (transcription as any).text || "" });
  } catch (e: any) {
    console.error(e);
    return cors(500, { error: "Transcription failed", detail: String(e?.message || e) });
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
