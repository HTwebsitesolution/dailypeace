
import { API_BASE } from "./config";
import type { Mode, Verse, GenerateResult } from "./types";

export async function apiGenerate(user_text: string, mode: Mode, verses: Verse[]) {
  const res = await fetch(`${API_BASE}/generate`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ user_text, mode, verses })
  });
  if (!res.ok) throw new Error("Generate failed");
  return (await res.json()) as GenerateResult;
}

export async function apiTranscribe(filename: string, base64: string, language = "en") {
  const res = await fetch(`${API_BASE}/transcribe`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ filename, base64, language })
  });
  if (!res.ok) throw new Error("Transcribe failed");
  const json = await res.json();
  return json.text as string;
}
