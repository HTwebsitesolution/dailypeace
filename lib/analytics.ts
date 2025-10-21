import { PostHog } from "posthog-react-native";
import Constants from "expo-constants";

let client: PostHog | null = null;

export function analytics() {
  if (client) return client;
  const key = Constants.expoConfig?.extra?.POSTHOG_KEY || process.env.EXPO_PUBLIC_POSTHOG_KEY;
  const host = Constants.expoConfig?.extra?.POSTHOG_HOST || process.env.EXPO_PUBLIC_POSTHOG_HOST || "https://app.posthog.com";
  
  // Only initialize PostHog if we have a real key (not a placeholder)
  if (key && !key.startsWith('REPLACE_WITH_')) {
    client = new PostHog(key, { host });
  } else {
    // Create a mock client that does nothing
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