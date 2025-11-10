// Safe AsyncStorage utilities with JSON parsing

/**
 * Safely parse JSON string with fallback
 */
export function safeParse<T>(s: string | null, fallback: T): T {
  try {
    return s ? JSON.parse(s) : fallback;
  } catch {
    return fallback;
  }
}

/**
 * Safely get and parse JSON from AsyncStorage
 */
export async function safeGetJSON<T>(
  key: string,
  fallback: T
): Promise<T> {
  try {
    const AsyncStorage = require('@react-native-async-storage/async-storage').default;
    const raw = await AsyncStorage.getItem(key);
    return safeParse(raw, fallback);
  } catch {
    return fallback;
  }
}







