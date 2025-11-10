import { PostHog } from "posthog-react-native";
import Constants from "expo-constants";

let client: PostHog | null = null;

export function analytics() {
  if (client) return client;
  
  try {
    const key = Constants?.expoConfig?.extra?.POSTHOG_KEY || process.env?.EXPO_PUBLIC_POSTHOG_KEY;
    const host = Constants?.expoConfig?.extra?.POSTHOG_HOST || process.env?.EXPO_PUBLIC_POSTHOG_HOST || "https://app.posthog.com";
    
    // Only initialize PostHog if we have a real key (not a placeholder)
    if (key && !key.startsWith('REPLACE_WITH_')) {
      try {
        client = new PostHog(key, { host });
      } catch (error) {
        console.error("Failed to initialize PostHog:", error);
        // Fall through to mock client
      }
    }
  } catch (error) {
    console.error("Error accessing Constants in analytics:", error);
  }
  
  // Create a mock client if PostHog wasn't initialized
  if (!client) {
    client = {
      capture: () => {},
      identify: () => {},
      reset: () => {}
    } as any;
  }
  
  return client;
}

export function track(event: string, props?: Record<string, any>) {
  try { 
    const client = analytics();
    if (client) client.capture(event, props || {}); 
  } catch {}
}