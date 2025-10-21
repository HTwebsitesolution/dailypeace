import { PostHog } from "posthog-react-native";
import Constants from "expo-constants";

let client: PostHog | null = null;

export function analytics() {
  if (client) return client;
  const key = Constants.expoConfig?.extra?.POSTHOG_KEY || process.env.EXPO_PUBLIC_POSTHOG_KEY;
  const host = Constants.expoConfig?.extra?.POSTHOG_HOST || process.env.EXPO_PUBLIC_POSTHOG_HOST || "https://app.posthog.com";
  client = new PostHog(key, { host });
  return client;
}

export function track(event: string, props?: Record<string, any>) {
  try { analytics().capture(event, props || {}); } catch {}
}