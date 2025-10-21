
import { Platform } from "react-native";
import { Asset } from "expo-asset";
import * as FileSystem from "expo-file-system";
import type { Mode, Verse } from "./types";

// Import the JSON data directly for web platforms
const kjvData = require("../assets/kjv.sample.json");

function parseRef(ref: string){
  const m = ref.match(/^([1-3]?\s*[A-Za-z]+)\s+(\d+):(\d+)(?:-(\d+))?$/)!;
  return { book: m[1].trim(), ch: +m[2], v1: +m[3], v2: m[4] ? +m[4] : +m[3] };
}

export async function loadKJVIndex(): Promise<Record<string,string>> {
  const idx: Record<string,string> = {};
  
  // For web platform, use direct import
  if (Platform.OS === 'web') {
    for (const verse of kjvData) {
      idx[`${verse.book}|${verse.chapter}|${verse.verse}`] = verse.text;
    }
    return idx;
  }
  
  // For native platforms, use the original asset loading
  try {
    const asset = Asset.fromModule(require("../assets/kjv.sample.json"));
    await asset.downloadAsync();
    const uri = asset.localUri || asset.uri;
    const text = await FileSystem.readAsStringAsync(uri!);
    const data = JSON.parse(text);
    for (const verse of data) {
      idx[`${verse.book}|${verse.chapter}|${verse.verse}`] = verse.text;
    }
    return idx;
  } catch (error) {
    console.error('Error loading KJV data:', error);
    // Fallback to imported data
    for (const verse of kjvData) {
      idx[`${verse.book}|${verse.chapter}|${verse.verse}`] = verse.text;
    }
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
