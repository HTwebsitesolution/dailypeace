/**
 * Haptic Feedback Utility
 * Provides tactile feedback for button presses and interactions across the app
 */

import * as Haptics from "expo-haptics";
import { Platform } from "react-native";

/**
 * Trigger haptic feedback for button presses
 * Uses light impact for standard button interactions
 */
export function hapticPress() {
  if (Platform.OS === "web") return; // No haptics on web
  
  try {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
  } catch (error) {
    // Silently fail if haptics not available
    console.warn("[Haptics] Not available:", error);
  }
}

/**
 * Trigger haptic feedback for selections
 * Uses medium impact for mode changes, toggle switches
 */
export function hapticSelect() {
  if (Platform.OS === "web") return;
  
  try {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
  } catch (error) {
    console.warn("[Haptics] Not available:", error);
  }
}

/**
 * Trigger haptic feedback for confirmations
 * Uses heavy impact for important actions like "Send", "Finish"
 */
export function hapticConfirm() {
  if (Platform.OS === "web") return;
  
  try {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
  } catch (error) {
    console.warn("[Haptics] Not available:", error);
  }
}

/**
 * Trigger haptic feedback for errors
 * Uses notification error type for failed actions
 */
export function hapticError() {
  if (Platform.OS === "web") return;
  
  try {
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
  } catch (error) {
    console.warn("[Haptics] Not available:", error);
  }
}

/**
 * Trigger haptic feedback for success
 * Uses notification success type for successful actions
 */
export function hapticSuccess() {
  if (Platform.OS === "web") return;
  
  try {
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
  } catch (error) {
    console.warn("[Haptics] Not available:", error);
  }
}

