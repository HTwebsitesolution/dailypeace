#!/usr/bin/env node
/* mergeMessages.js
   Combine category JSON files into a single messages.json with validation.

   Default:
     SRC_DIR  = assets/rotations/categories
     OUT_FILE = assets/rotations/messages.json

   Usage:
     node mergeMessages.js
     node mergeMessages.js path/to/src path/to/out.json
     node mergeMessages.js --dry-run
*/

const fs = require("fs");
const path = require("path");

const argv = process.argv.slice(2);
const DRY_RUN = argv.includes("--dry-run");

const positional = argv.filter(a => !a.startsWith("-"));
const SRC_DIR = positional[0] || "assets/rotations/categories";
const OUT_FILE = positional[1] || "assets/rotations/messages.json";

function die(msg) {
  console.error("❌ " + msg);
  process.exit(1);
}
function ok(msg) {
  console.log("✅ " + msg);
}
function warn(msg) {
  console.warn("⚠️  " + msg);
}

function isPlainObj(v) {
  return v && typeof v === "object" && !Array.isArray(v);
}

function sanitizeVerses(v) {
  if (!Array.isArray(v)) return [];
  const cleaned = v
    .filter(x => typeof x === "string")
    .map(x => x.trim())
    .filter(Boolean);
  // de-dupe while preserving order
  return [...new Set(cleaned)];
}

function validateEntry(entry, srcFile, seenIds) {
  const ctx = `(${srcFile}${entry.id ? `#${entry.id}` : ""})`;
  if (!isPlainObj(entry)) die(`Entry is not an object ${ctx}`);

  const required = ["id", "category", "text", "verses"];
  for (const k of required) {
    if (!(k in entry)) die(`Missing '${k}' ${ctx}`);
  }

  if (typeof entry.id !== "string" || !entry.id.trim()) die(`Invalid id ${ctx}`);
  const id = entry.id.trim();

  if (seenIds.has(id.toLowerCase())) die(`Duplicate id '${id}' across files ${ctx}`);
  seenIds.add(id.toLowerCase());

  if (typeof entry.category !== "string" || !entry.category.trim()) {
    die(`Invalid category for id '${id}' ${ctx}`);
  }

  if (typeof entry.text !== "string" || !entry.text.trim()) {
    die(`Invalid text for id '${id}' ${ctx}`);
  }

  entry.verses = sanitizeVerses(entry.verses);
  if (entry.verses.length === 0) {
    die(`Entry '${id}' must have at least one verse ${ctx}`);
  }

  // Optional: tones object with morning/evening keys, if present
  if (entry.tones !== undefined) {
    if (!isPlainObj(entry.tones)) die(`'tones' must be an object for id '${id}' ${ctx}`);
    for (const [k, v] of Object.entries(entry.tones)) {
      if (typeof v !== "string") die(`tones['${k}'] must be a string for id '${id}' ${ctx}`);
    }
  }

  // Optional disclaimer override (rare)
  if (entry.disclaimer !== undefined && typeof entry.disclaimer !== "string") {
    die(`'disclaimer' must be a string for id '${id}' ${ctx}`);
  }

  // Normalize whitespace in text: collapse multiple spaces
  entry.text = entry.text.replace(/\s+/g, " ").trim();

  return entry;
}

function readJsonFile(filePath) {
  const raw = fs.readFileSync(filePath, "utf8");
  try {
    const data = JSON.parse(raw);
    // Allow either an array of entries or a single object (convert to array)
    if (Array.isArray(data)) return data;
    if (isPlainObj(data)) return [data];
    die(`Top-level JSON must be an array or object: ${filePath}`);
  } catch (e) {
    die(`Failed to parse JSON: ${filePath}\n${e.message}`);
  }
}

function listJsonFiles(dir) {
  if (!fs.existsSync(dir)) die(`Source directory not found: ${dir}`);
  const all = fs.readdirSync(dir);
  const files = all
    .filter(f => f.toLowerCase().endsWith(".json"))
    .map(f => path.join(dir, f))
    .sort();
  if (files.length === 0) die(`No .json files found in: ${dir}`);
  return files;
}

function summarizeByCategory(entries) {
  const map = {};
  for (const e of entries) {
    map[e.category] = (map[e.category] || 0) + 1;
  }
  const rows = Object.entries(map).sort((a, b) => a[0].localeCompare(b[0]));
  console.log("\n📊 Category summary:");
  for (const [cat, n] of rows) {
    console.log(`  - ${cat}: ${n}`);
  }
  console.log(`  Total: ${entries.length}\n`);
}

function main() {
  console.log(`🔎 Merging category files from: ${SRC_DIR}`);
  const files = listJsonFiles(SRC_DIR);

  const seenIds = new Set();
  let merged = [];

  for (const f of files) {
    const short = path.relative(process.cwd(), f);
    const entries = readJsonFile(f);
    if (entries.length === 0) {
      warn(`Empty JSON file skipped: ${short}`);
      continue;
    }
    for (const entry of entries) {
      const v = validateEntry(entry, short, seenIds);
      merged.push(v);
    }
    ok(`Loaded ${entries.length} from ${short}`);
  }

  // Sort by category, then id (natural-ish)
  merged.sort((a, b) => {
    const c = a.category.localeCompare(b.category);
    return c !== 0 ? c : a.id.localeCompare(b.id, undefined, { numeric: true });
  });

  summarizeByCategory(merged);

  // Safeguard: check target count (Daily Peace expects 90)
  const TARGET = 90;
  if (merged.length !== TARGET) {
    warn(`Expected ${TARGET} entries but got ${merged.length}. Proceeding anyway.`);
  }

  const outAbs = path.resolve(OUT_FILE);
  const outDir = path.dirname(outAbs);
  if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, { recursive: true });

  const json = JSON.stringify(merged, null, 2) + "\n";
  if (DRY_RUN) {
    console.log("📝 --dry-run: not writing file. Preview of first 2 entries:\n");
    const preview = JSON.stringify(merged.slice(0, 2), null, 2);
    console.log(preview);
    ok("Dry run complete.");
    return;
  }

  fs.writeFileSync(outAbs, json, "utf8");
  ok(`Wrote ${merged.length} reflections → ${OUT_FILE}`);
}

main();