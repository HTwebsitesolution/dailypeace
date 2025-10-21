// Debug cheatsheet for Daily Peace production issues

/**
 * COMMON PRODUCTION ISSUES & SOLUTIONS
 */

// 1. CORS Issues
// Fix: Check netlify.toml headers are set correctly
// Confirm API_BASE points to: https://dailypeace.life/.netlify/functions
export const DEBUG_API_BASE = "https://dailypeace.life/.netlify/functions";

// 2. Netlify Function Logs
// Access: Netlify Dashboard → Site → Deploys → Functions tab
// Look for error logs in real-time during testing

// 3. Payload Size Issues  
// Fix: Limit verses to ≤ 6 (already implemented in selectVerses)
// Large payloads can cause function timeouts

// 4. Whisper Transcription Failures
// Common cause: Bad base64 encoding
// Debug: Check FileSystem.readAsStringAsync(uri, { encoding: Base64 })
// Minimum viable base64 should be >100 chars for audio

// 5. TTS Silent on iOS
// Cause: iOS mute switch or audio session not configured
// Solution: Tell users to check mute switch
// Alternative: Set audio session mode before Speech.speak()

/**
 * DEBUG HELPERS
 */

export function logPayloadSize(data: any, label = "Payload") {
  const size = JSON.stringify(data).length;
  console.log(`[DEBUG] ${label} size: ${size} chars`);
  if (size > 50000) console.warn(`[DEBUG] Large ${label}! Consider reducing data.`);
}

export function validateBase64Audio(base64: string): boolean {
  if (!base64 || base64.length < 100) {
    console.warn("[DEBUG] Invalid audio base64:", base64?.length || 0, "chars");
    return false;
  }
  console.log("[DEBUG] Audio base64 valid:", base64.length, "chars");
  return true;
}

export function checkAPIEndpoint() {
  const endpoint = process.env.EXPO_PUBLIC_API_BASE || DEBUG_API_BASE;
  console.log("[DEBUG] API endpoint:", endpoint);
  if (!endpoint.includes("dailypeace.life")) {
    console.warn("[DEBUG] API endpoint might be wrong! Expected: dailypeace.life");
  }
}

/**
 * PRODUCTION MONITORING
 */

export function logProductionError(context: string, error: any, metadata?: any) {
  const errorInfo = {
    context,
    message: error?.message || error,
    timestamp: new Date().toISOString(),
    metadata
  };
  
  console.error("[PRODUCTION ERROR]", errorInfo);
  
  // In production, this could also send to analytics or Sentry
  // analytics.track('production_error', errorInfo);
}

/**
 * QUICK TESTS
 */

export async function quickAPITest() {
  try {
    console.log("[DEBUG] Testing API connection...");
    const response = await fetch(`${DEBUG_API_BASE}/generate`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        user_text: "test",
        mode: "conversational", 
        verses: [{ ref: "John 3:16", text: "For God so loved the world..." }]
      })
    });
    
    console.log("[DEBUG] API Test Response:", response.status, response.statusText);
    return response.ok;
  } catch (error) {
    console.error("[DEBUG] API Test Failed:", error);
    return false;
  }
}