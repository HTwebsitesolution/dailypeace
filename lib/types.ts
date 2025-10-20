
export type Mode = "conversational" | "biblical" | "reflective";
export interface Verse { ref: string; text: string }
export interface InspiredMessage { text: string; citations: string[]; disclaimer: string }
export interface GenerateResult { inspired_message: InspiredMessage | null }
