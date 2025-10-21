// lib/classifier.ts
export function classifyNeeds(text: string): string[] {
  const s = text.toLowerCase();
  const score: Record<string, number> = {};
  const add = (id: string, n=1) => (score[id] = (score[id]||0) + n);

  if (/\b(anxious|anxiety|worry|worried|fear|scared|panic)\b/.test(s)) add("fear_anxiety", 3);
  if (/\b(job|work|income|money|bills|rent|mortgage)\b/.test(s)) add("provision_finances_work", 2);
  if (/\bgrief|lost (my|our)|passed away|mourning|bereavement\b/.test(s)) add("grief_loss", 3);
  if (/\bguilty|shame|regret|i messed up|i failed\b/.test(s)) add("guilt_shame", 2);
  if (/\bforgive me|forgiveness|i wronged\b/.test(s)) add("forgiveness_needed", 2);
  if (/\bforgive (him|her|them)|resentment|bitterness|anger\b/.test(s)) add("forgiving_others", 2);
  if (/\bill|diagnosed|pain|sick|surgery|cancer\b/.test(s)) add("illness_suffering", 2);
  if (/\blonely|alone|rejected|left out\b/.test(s)) add("loneliness_rejection", 2);
  if (/\bdirection|purpose|calling|what should i do\b/.test(s)) add("purpose_direction", 2);
  if (/\bdoubt|doubting|faith crisis\b/.test(s)) add("doubt_faith", 2);
  if (/\btempted|temptation|keep sinning|addicted\b/.test(s)) add("temptation_sin", 2);
  if (/\breconcile|conflict|fight|argument\b/.test(s)) add("reconciliation_conflict", 2);
  if (/\btired|exhausted|burnout|weary|overwhelmed\b/.test(s)) add("weariness_burnout", 2);
  if (/\bgrateful|thankful|praise\b/.test(s)) add("gratitude_praise", 2);
  if (/\bdecision|decide|choose|which option\b/.test(s)) add("decision_making", 2);
  if (/\brepent|return|back to god\b/.test(s)) add("repentance_return", 2);
  if (/\bhope|joy|encourage\b/.test(s)) add("joy_hope", 1);

  const ranked = Object.entries(score).sort((a,b)=>b[1]-a[1]).map(([k])=>k);
  return ranked.length ? ranked.slice(0,2) : ["fear_anxiety"]; // sensible default
}