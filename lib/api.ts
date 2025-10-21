
import { API_BASE } from "./config";
import type { Mode, Verse, GenerateResult } from "./types";

export async function apiGenerate(user_text: string, mode: Mode, verses: Verse[]) {
  try {
    // Debug: Log API call details
    console.log(`[API] Calling ${API_BASE}/generate with ${verses.length} verses`);
    
    const res = await fetch(`${API_BASE}/generate`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ user_text, mode, verses })
    });
    
    if (!res.ok) {
      const errorText = await res.text().catch(() => "Unknown error");
      console.error(`[API] Generate failed ${res.status}: ${errorText}`);
      throw new Error(`Generate failed: ${res.status} ${errorText}`);
    }
    
    return await res.json() as GenerateResult;
  } catch (error: any) {
    console.error("[API] Network error:", error.message);
    throw new Error(`API Error: ${error.message}`);
  }
}

export async function apiTranscribe(filename: string, base64: string, language = "en") {
  try {
    // Debug: Log transcription attempt with base64 size
    console.log(`[API] Transcribing ${filename}, base64 size: ${base64.length} chars`);
    
    const res = await fetch(`${API_BASE}/transcribe`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ filename, base64, language })
    });
    
    if (!res.ok) {
      const errorText = await res.text().catch(() => "Unknown error");
      console.error(`[API] Transcribe failed ${res.status}: ${errorText}`);
      throw new Error(`Transcribe failed: ${res.status} ${errorText}`);
    }
    
    const json = await res.json();
    console.log(`[API] Transcription result: ${json.text?.length || 0} chars`);
    return json.text as string;
  } catch (error: any) {
    console.error("[API] Transcription error:", error.message);
    throw new Error(`Whisper Error: ${error.message}`);
  }
}
