import React, { useEffect, useRef, useState } from "react";
import { ImageBackground, Animated, Dimensions } from "react-native";
import { 
  BackgroundConfig, 
  getBackgroundForMode, 
  getAllBackgroundsForMode,
  getTimeOfDay
} from "../../lib/backgrounds";

interface RotatingBackgroundProps {
  mode: "conversational" | "biblical" | "reflective";
  children: React.ReactNode;
  rotationInterval?: number; // milliseconds between rotations
  enableTimeRotation?: boolean;
  enableModeRotation?: boolean;
}

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

export default function RotatingBackground({
  mode,
  children,
  rotationInterval = 30000, // 30 seconds default
  enableTimeRotation = true,
  enableModeRotation = true,
}: RotatingBackgroundProps) {
  const [currentBackground, setCurrentBackground] = useState<BackgroundConfig>(
    getBackgroundForMode(mode)
  );
  const [backgrounds, setBackgrounds] = useState<BackgroundConfig[]>(
    getAllBackgroundsForMode(mode)
  );
  
  const fadeAnim = useRef(new Animated.Value(1)).current;
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const rotationTimer = useRef<NodeJS.Timeout | null>(null);
  const currentIndex = useRef(0);

  // Update backgrounds when mode changes
  useEffect(() => {
    const newBackgrounds = getAllBackgroundsForMode(mode);
    setBackgrounds(newBackgrounds);
    
    // Find current background in new list or use first
    const currentTheme = currentBackground.theme;
    const newIndex = newBackgrounds.findIndex(bg => bg.theme === currentTheme);
    currentIndex.current = newIndex >= 0 ? newIndex : 0;
    
    setCurrentBackground(newBackgrounds[currentIndex.current]);
  }, [mode]);

  // Handle time-based rotation
  useEffect(() => {
    if (!enableTimeRotation) return;

    const checkTimeChange = () => {
      const newBackground = getBackgroundForMode(mode);
      if (newBackground.theme !== currentBackground.theme) {
        rotateToBackground(newBackground);
      }
    };

    // Check every minute for time changes
    const timeCheckInterval = setInterval(checkTimeChange, 60000);
    return () => clearInterval(timeCheckInterval);
  }, [mode, currentBackground.theme, enableTimeRotation]);

  // Handle automatic rotation
  useEffect(() => {
    if (!enableModeRotation || backgrounds.length <= 1) return;

    const startRotation = () => {
      rotationTimer.current = setInterval(() => {
        rotateToNext();
      }, rotationInterval);
    };

    startRotation();
    return () => {
      if (rotationTimer.current) {
        clearInterval(rotationTimer.current);
      }
    };
  }, [backgrounds, rotationInterval, enableModeRotation]);

  const rotateToNext = () => {
    if (backgrounds.length <= 1) return;
    
    currentIndex.current = (currentIndex.current + 1) % backgrounds.length;
    const nextBackground = backgrounds[currentIndex.current];
    rotateToBackground(nextBackground);
  };

  const rotateToBackground = (newBackground: BackgroundConfig) => {
    // Simple fade transition
    Animated.timing(fadeAnim, {
      toValue: 0.3,
      duration: 1000,
      useNativeDriver: true,
    }).start(() => {
      // Change background
      setCurrentBackground(newBackground);
      
      // Fade back in
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 1000,
        useNativeDriver: true,
      }).start();
    });
  };

  return (
    <Animated.View style={{ flex: 1 }}>
      <ImageBackground
        source={currentBackground.image}
        resizeMode="cover"
        style={{ 
          flex: 1, 
          backgroundColor: "#0B1016",
          width: screenWidth,
          height: screenHeight,
        }}
        imageStyle={{
          opacity: fadeAnim,
        }}
      >
        {children}
      </ImageBackground>
    </Animated.View>
  );
}
