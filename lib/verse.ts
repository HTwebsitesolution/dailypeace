
import { Asset } from "expo-asset";
import * as FileSystem from "expo-file-system";
import type { Mode, Verse } from "./types";

function parseRef(ref: string){
  const m = ref.match(/^([1-3]?\s*[A-Za-z]+)\s+(\d+):(\d+)(?:-(\d+))?$/)!;
  return { book: m[1].trim(), ch: +m[2], v1: +m[3], v2: m[4] ? +m[4] : +m[3] };
}

export async function loadKJVIndex(): Promise<Record<string,string>> {
  const asset = Asset.fromModule(require("../assets/kjv.sample.jsonl"));
  await asset.downloadAsync();
  const uri = asset.localUri || asset.uri;
  const text = await FileSystem.readAsStringAsync(uri!);
  const idx: Record<string,string> = {};
  for (const line of text.split("\n").filter(Boolean)) {
    const o = JSON.parse(line);
    idx[`${o.book}|${o.chapter}|${o.verse}`] = o.text;
  }
  return idx;
}

function fetchText(refOrUnit: string, idx: Record<string,string>) {
  const { book, ch, v1, v2 } = parseRef(refOrUnit);
  const parts: string[] = [];
  for (let v = v1; v <= v2; v++) parts.push(idx[`${book}|${ch}|${v}`] ?? `[Missing ${book} ${ch}:${v}]`);
  return parts.join(" ");
}

export async function selectVerses(mode: Mode, needSeeds: any, kjvIdx: Record<string,string>, needIds: string[]): Promise<Verse[]> {
  // Payload size safeguard: limit to 6 verses max for API stability
  const count = Math.min(mode === "biblical" ? 5 : mode === "reflective" ? 2 : 3, 6);
  const preferUnit = mode !== "reflective";
  const verses: Verse[] = [];
  for (const needId of needIds) {
    const cands = [...needSeeds[needId].candidates].sort((a: any,b: any)=> b.priority - a.priority);
    for (const c of cands) {
      const text = fetchText(preferUnit ? c.unit : c.ref, kjvIdx);
      verses.push({ ref: c.ref, text });
      if (verses.length >= count) break;
    }
    if (verses.length >= count) break;
  }
  return verses;
}
