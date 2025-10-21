
import { Platform } from "react-native";
import { Asset } from "expo-asset";
import * as FileSystem from "expo-file-system";
import type { Mode, Verse } from "./types";

// Import the full KJV JSON data
const kjvData = require("../assets/kjv.json");

function parseRef(ref: string){
  const m = ref.match(/^([1-3]?\s*[A-Za-z]+)\s+(\d+):(\d+)(?:-(\d+))?$/)!;
  return { book: m[1].trim(), ch: +m[2], v1: +m[3], v2: m[4] ? +m[4] : +m[3] };
}

export async function loadKJVIndex(): Promise<Record<string,string>> {
  const idx: Record<string,string> = {};
  
  try {
    // Use the imported full KJV data (works for all platforms)
    for (const verse of kjvData) {
      idx[`${verse.book}|${verse.chapter}|${verse.verse}`] = verse.text;
    }
    
    console.log(`✅ Loaded ${Object.keys(idx).length} verses from full KJV Bible`);
    return idx;
  } catch (error) {
    console.error('❌ Error loading KJV data:', error);
    
    // Fallback to a minimal set for development
    idx["John|14|1"] = "Let not your heart be troubled: ye believe in God, believe also in me.";
    idx["John|14|27"] = "Peace I leave with you, my peace I give unto you: not as the world giveth, give I unto you. Let not your heart be troubled, neither let it be afraid.";
    idx["Philippians|4|6"] = "Be careful for nothing; but in every thing by prayer and supplication with thanksgiving let your requests be made known unto God.";
    idx["Philippians|4|7"] = "And the peace of God, which passeth all understanding, shall keep your hearts and minds through Christ Jesus.";
    
    console.log(`⚠️ Using fallback verses (${Object.keys(idx).length})`);
    return idx;
  }
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
