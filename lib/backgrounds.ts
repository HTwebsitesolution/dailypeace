import { Animated } from "react-native";

export type BackgroundTheme = "ocean" | "mountain" | "dove";

export interface BackgroundConfig {
  image: any;
  theme: BackgroundTheme;
  mode: "conversational" | "biblical" | "reflective";
  timeOfDay?: "morning" | "afternoon" | "evening" | "night";
}

// Background images mapping - only use available images
const backgroundImages = {
  ocean: require("../assets/images/hero-ocean.png"),
  mountain: require("../assets/images/hero-mountain.png"),
  dove: require("../assets/images/hero-dove.png"),
};

// Mode-based background preferences - only use available themes
const modeBackgrounds: Record<string, BackgroundTheme[]> = {
  conversational: ["ocean", "dove"],
  biblical: ["mountain", "dove"],
  reflective: ["ocean", "dove"],
};

// Time-based background preferences - only use available themes
const timeBackgrounds: Record<string, BackgroundTheme[]> = {
  morning: ["ocean", "dove"],
  afternoon: ["mountain", "ocean"],
  evening: ["dove", "ocean"],
  night: ["dove", "mountain"],
};

export function getTimeOfDay(): "morning" | "afternoon" | "evening" | "night" {
  const hour = new Date().getHours();
  if (hour >= 5 && hour < 12) return "morning";
  if (hour >= 12 && hour < 17) return "afternoon";
  if (hour >= 17 && hour < 21) return "evening";
  return "night";
}

export function getBackgroundForMode(
  mode: "conversational" | "biblical" | "reflective",
  timeOfDay?: "morning" | "afternoon" | "evening" | "night"
): BackgroundConfig {
  const currentTime = timeOfDay || getTimeOfDay();
  
  // Get mode-specific backgrounds
  const modeOptions = modeBackgrounds[mode] || ["ocean"];
  
  // Get time-specific backgrounds
  const timeOptions = timeBackgrounds[currentTime] || ["ocean"];
  
  // Find intersection or use mode preference
  const commonOptions = modeOptions.filter(theme => timeOptions.includes(theme));
  const selectedTheme = commonOptions.length > 0 ? commonOptions[0] : modeOptions[0];
  
  return {
    image: backgroundImages[selectedTheme] || backgroundImages.ocean,
    theme: selectedTheme,
    mode,
    timeOfDay: currentTime,
  };
}

export function getAllBackgroundsForMode(
  mode: "conversational" | "biblical" | "reflective"
): BackgroundConfig[] {
  const modeOptions = modeBackgrounds[mode] || ["ocean"];
  return modeOptions.map(theme => ({
    image: backgroundImages[theme] || backgroundImages.ocean,
    theme,
    mode,
  }));
}

// Animation utilities
export function createBackgroundAnimation() {
  return {
    fadeAnim: new Animated.Value(1),
    scaleAnim: new Animated.Value(1),
  };
}

export function animateBackgroundTransition(
  fadeAnim: Animated.Value,
  scaleAnim: Animated.Value,
  rotateAnim?: Animated.Value,
  duration: number = 2000
) {
  const animations = [
    Animated.timing(fadeAnim, {
      toValue: 0.3,
      duration: duration / 2,
      useNativeDriver: true,
    }),
    Animated.timing(scaleAnim, {
      toValue: 1.05,
      duration: duration,
      useNativeDriver: true,
    }),
  ];
  
  if (rotateAnim) {
    animations.push(
      Animated.timing(rotateAnim, {
        toValue: 1,
        duration: duration,
        useNativeDriver: true,
      })
    );
  }
  
  return Animated.parallel(animations);
}

export function resetBackgroundAnimation(
  fadeAnim: Animated.Value,
  scaleAnim: Animated.Value,
  rotateAnim?: Animated.Value,
  duration: number = 1000
) {
  const animations = [
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration,
      useNativeDriver: true,
    }),
    Animated.timing(scaleAnim, {
      toValue: 1,
      duration,
      useNativeDriver: true,
    }),
  ];
  
  if (rotateAnim) {
    animations.push(
      Animated.timing(rotateAnim, {
        toValue: 0,
        duration,
        useNativeDriver: true,
      })
    );
  }
  
  return Animated.parallel(animations);
}
