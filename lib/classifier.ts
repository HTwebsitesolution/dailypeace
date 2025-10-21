import type { Mode } from "./types";

// Enhanced spiritual needs classifier with comprehensive pattern matching
export function classifyNeeds(text: string, mode: Mode = "conversational"): string[] {
  const s = text.toLowerCase();
  const score: Record<string, number> = {};
  const add = (id: string, n=1) => (score[id] = (score[id]||0) + n);

  // Core emotional and spiritual needs with enhanced patterns
  if (/\b(anxious|anxiety|worry|worried|fear|scared|panic|afraid|terrified|nervous|overwhelmed|stress|restless)\b/.test(s)) add("fear_anxiety", 3);
  if (/\b(sad|depressed|depression|hopeless|empty|numb|crying|tears|despair|darkness|worthless|down|blue)\b/.test(s)) add("depression_sadness", 3);
  if (/\b(angry|mad|furious|frustrated|rage|bitter|resentment|hate|annoyed|fed up|livid|wrath)\b/.test(s)) add("anger_frustration", 3);
  if (/\b(lonely|alone|isolated|abandoned|rejected|nobody understands|no friends|disconnected|outcast)\b/.test(s)) add("loneliness_isolation", 3);
  
  // Faith and spiritual struggles
  if (/\b(doubt|doubting|faith crisis|don't believe|losing faith|where is god|prayers unanswered|spiritual dryness)\b/.test(s)) add("doubt_faith_crisis", 3);
  if (/\b(guilty|guilt|shame|ashamed|regret|remorse|sin|sinned|wrong|bad person|unworthy|condemned|failed)\b/.test(s)) add("guilt_shame", 3);
  
  // Life circumstances
  if (/\b(grief|died|death|passed away|funeral|miss them|loss|mourning|bereavement|departed|gone forever)\b/.test(s)) add("grief_loss", 3);
  if (/\b(job|work|unemployed|fired|quit|boss|career|workplace|deadline|burnout|workload|income|salary)\b/.test(s)) add("work_stress", 2);
  if (/\b(money|broke|debt|bills|rent|mortgage|financial|poor|budget|bankruptcy|loan|expenses)\b/.test(s)) add("financial_worry", 2);
  if (/\b(sick|illness|disease|cancer|pain|hospital|doctor|healing|health|surgery|diagnosis|treatment)\b/.test(s)) add("healing_health", 2);
  
  // Relationships and family
  if (/\b(marriage problems|divorce|fighting|argument|relationship|spouse|husband|wife|breakup|family issues)\b/.test(s)) add("relationship_conflict", 2);
  if (/\b(family|children|parents|kids|son|daughter|parenting|teenager|sibling|raising children)\b/.test(s)) add("family_relationships", 2);
  
  // Spiritual growth and guidance
  if (/\b(purpose|meaning|why am I here|calling|direction|lost|what's the point|life purpose|destiny|confused about life)\b/.test(s)) add("purpose_meaning", 2);
  if (/\b(forgive|forgiveness|can't forgive|hurt me|betrayed|wronged|mercy|reconcile|make amends|apologize)\b/.test(s)) add("forgiveness", 2);
  if (/\b(don't know|confused|decision|choice|wisdom|guidance|what should I do|help me decide|crossroads|clarity)\b/.test(s)) add("wisdom_guidance", 2);
  if (/\b(weak|tired|exhausted|give up|can't go on|need strength|courage|perseverance|determination|motivation)\b/.test(s)) add("strength_courage", 2);
  
  // Positive spiritual states
  if (/\b(thankful|grateful|blessed|praise|thank god|appreciate|blessing|favor|miracle|answered prayer|joy)\b/.test(s)) add("gratitude_praise", 2);
  if (/\b(prayer|bible|church|worship|serve|ministry|spiritual|grow closer to god|discipleship|devotion)\b/.test(s)) add("spiritual_growth", 2);

  // Mode-specific adjustments for enhanced relevance
  if (mode === "biblical") {
    // Boost scripture-focused categories in biblical mode
    if (score.doubt_faith_crisis) score.doubt_faith_crisis *= 1.3;
    if (score.spiritual_growth) score.spiritual_growth *= 1.2;
    if (score.forgiveness) score.forgiveness *= 1.2;
    if (score.purpose_meaning) score.purpose_meaning *= 1.1;
  } else if (mode === "reflective") {
    // Boost introspective categories in reflective mode  
    if (score.purpose_meaning) score.purpose_meaning *= 1.3;
    if (score.wisdom_guidance) score.wisdom_guidance *= 1.2;
    if (score.gratitude_praise) score.gratitude_praise *= 1.2;
    if (score.spiritual_growth) score.spiritual_growth *= 1.1;
  }

  const ranked = Object.entries(score).sort((a,b)=>b[1]-a[1]).map(([k])=>k);
  
  // Enhanced fallback logic based on mode
  if (ranked.length === 0) {
    return mode === "biblical" ? ["spiritual_growth", "fear_anxiety"] : 
           mode === "reflective" ? ["purpose_meaning", "gratitude_praise"] :
           ["fear_anxiety", "strength_courage"];
  }
  
  return ranked.slice(0, 3); // Return top 3 matches for better verse selection
}