
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

const DEFAULT_NEED_ID = "fear_anxiety";

function normaliseNeedId(value: string) {
  return value.replace(/[^a-z0-9]/gi, "").toLowerCase();
}

export function resolveNeedIds(
  needSeeds: Record<string, any>,
  requestedIds: string[] = [],
  includeFallback: boolean = true
): string[] {
  if (!needSeeds) return [];

  const seedsKeys = Object.keys(needSeeds ?? {});
  if (seedsKeys.length === 0) return [];

  const normalisedIndex = new Map<string, string>();
  for (const key of seedsKeys) {
    normalisedIndex.set(normaliseNeedId(key), key);
  }

  const resolvedIds: string[] = [];
  const enqueueId = (id: string | undefined) => {
    if (!id) return;
    if (!resolvedIds.includes(id)) resolvedIds.push(id);
  };

  for (const rawNeedId of requestedIds ?? []) {
    if (!rawNeedId) continue;
    if (needSeeds[rawNeedId]) {
      enqueueId(rawNeedId);
      continue;
    }

    const normalised = normaliseNeedId(rawNeedId);
    const directMatch = normalisedIndex.get(normalised);
    if (directMatch) {
      enqueueId(directMatch);
      continue;
    }

    const fuzzyMatch = seedsKeys.find((key) =>
      normaliseNeedId(key).includes(normalised)
    );
    if (fuzzyMatch) enqueueId(fuzzyMatch);
  }

  if (includeFallback && !resolvedIds.length) {
    const fallbackKey =
      needSeeds[DEFAULT_NEED_ID] ? DEFAULT_NEED_ID : seedsKeys.find(Boolean);
    if (fallbackKey) enqueueId(fallbackKey);
  }

  return resolvedIds;
}

export async function selectVerses(
  mode: Mode,
  needSeeds: Record<string, any>,
  kjvIdx: Record<string, string>,
  needIds: string[]
): Promise<Verse[]> {
  if (!needSeeds || !kjvIdx) return [];

  const preferUnit = mode !== "reflective";
  const globalLimit = Math.min(mode === "biblical" ? 5 : mode === "reflective" ? 2 : 3, 6);

  const resolvedIds = resolveNeedIds(needSeeds, needIds);

  const verses: Verse[] = [];
  const usedRefs = new Set<string>();

  for (const needId of resolvedIds) {
    const seed = needSeeds[needId];
    if (!seed || !Array.isArray(seed.candidates) || !seed.candidates.length) {
      continue;
    }

    const policyMax =
      typeof seed.policy?.max_verses === "number" && seed.policy.max_verses > 0
        ? seed.policy.max_verses
        : undefined;
    const needLimit = Math.min(globalLimit, policyMax ?? globalLimit);

    const candidates = [...seed.candidates].sort(
      (a: any, b: any) => (b.priority ?? 0) - (a.priority ?? 0)
    );

    let addedForNeed = 0;
    for (const candidate of candidates) {
      const ref = candidate.ref ?? candidate.unit;
      const unit = candidate.unit ?? candidate.ref;
      if (!ref || !unit) continue;
      if (usedRefs.has(ref)) continue;

      const text = fetchText(preferUnit ? unit : ref, kjvIdx);
      verses.push({ ref, text });
      usedRefs.add(ref);
      addedForNeed += 1;

      if (addedForNeed >= needLimit) break;
      if (verses.length >= globalLimit) break;
    }

    if (verses.length >= globalLimit) break;
  }

  return verses;
}
