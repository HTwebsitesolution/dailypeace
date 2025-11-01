/**
 * Scroll Position Persistence Utility
 * Saves and restores scroll positions for better user experience
 */

import AsyncStorage from "@react-native-async-storage/async-storage";

const SCROLL_POSITION_KEY = "@dp/scroll_positions";

interface ScrollPositions {
  [key: string]: number;
}

let cachedPositions: ScrollPositions = {};

/**
 * Load all scroll positions from storage
 */
export async function loadScrollPositions(): Promise<ScrollPositions> {
  try {
    const stored = await AsyncStorage.getItem(SCROLL_POSITION_KEY);
    if (stored) {
      cachedPositions = JSON.parse(stored);
      return cachedPositions;
    }
  } catch (error) {
    console.warn("[ScrollPersistence] Failed to load positions:", error);
  }
  return {};
}

/**
 * Save a scroll position for a specific component
 */
export async function saveScrollPosition(componentKey: string, position: number): Promise<void> {
  try {
    cachedPositions[componentKey] = position;
    await AsyncStorage.setItem(SCROLL_POSITION_KEY, JSON.stringify(cachedPositions));
  } catch (error) {
    console.warn("[ScrollPersistence] Failed to save position:", error);
  }
}

/**
 * Get a saved scroll position for a specific component
 */
export function getScrollPosition(componentKey: string): number {
  return cachedPositions[componentKey] || 0;
}

/**
 * Clear all scroll positions
 */
export async function clearScrollPositions(): Promise<void> {
  try {
    cachedPositions = {};
    await AsyncStorage.removeItem(SCROLL_POSITION_KEY);
  } catch (error) {
    console.warn("[ScrollPersistence] Failed to clear positions:", error);
  }
}

