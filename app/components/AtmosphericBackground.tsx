import React, { useEffect, useRef, useState } from "react";
import { ImageBackground, Animated, Dimensions, View } from "react-native";
import { 
  BackgroundConfig, 
  getBackgroundForMode, 
  getAllBackgroundsForMode,
  createBackgroundAnimation,
  animateBackgroundTransition,
  resetBackgroundAnimation,
  getTimeOfDay
} from "../../lib/backgrounds";

interface AtmosphericBackgroundProps {
  mode: "conversational" | "biblical" | "reflective";
  children: React.ReactNode;
  rotationInterval?: number; // milliseconds between rotations
  enableTimeRotation?: boolean;
  enableModeRotation?: boolean;
}

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

export default function AtmosphericBackground({
  mode,
  children,
  rotationInterval = 45000, // 45 seconds for subtle rotation
  enableTimeRotation = true,
  enableModeRotation = true,
}: AtmosphericBackgroundProps) {
  const [currentBackground, setCurrentBackground] = useState<BackgroundConfig>(
    getBackgroundForMode(mode)
  );
  const [backgrounds, setBackgrounds] = useState<BackgroundConfig[]>(
    getAllBackgroundsForMode(mode)
  );
  
  const fadeAnim = useRef(new Animated.Value(1)).current;
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const rotateAnim = useRef(new Animated.Value(0)).current;
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

    // Check every 5 minutes for time changes
    const timeCheckInterval = setInterval(checkTimeChange, 300000);
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
    // Subtle transition animation
    animateBackgroundTransition(fadeAnim, scaleAnim, rotateAnim, 2000).start(() => {
      // Change background
      setCurrentBackground(newBackground);
      
      // Fade back in with subtle rotation
      resetBackgroundAnimation(fadeAnim, scaleAnim, rotateAnim, 2000).start();
    });
  };

  // Create subtle rotation transform
  const rotationTransform = rotateAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '2deg'], // Very subtle rotation
  });

  // Apply ambient focus based on background theme
  const getAmbientFocusStyle = () => {
    return {
      opacity: fadeAnim.interpolate({
        inputRange: [0, 1],
        outputRange: [0.65, 0.75], // Brighter images for sharper appearance
      }),
    };
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
          ...getAmbientFocusStyle(),
          transform: [
            { scale: scaleAnim },
            { rotate: rotationTransform }
          ],
        }}
      >
        {/* Strong overlay for better text readability */}
        <View style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0,0,0,0.55)', // Stronger dark overlay for text visibility
        }} />
        
        {/* Additional vignette effect */}
        <View style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0,0,0,0.15)', // Stronger vignette
        }} />
        
        {/* Content overlay */}
        <Animated.View style={{ 
          flex: 1, 
          backgroundColor: "rgba(11, 16, 22, 0.05)", // Minimal content overlay
          opacity: fadeAnim.interpolate({
            inputRange: [0.2, 1],
            outputRange: [0.1, 0.05], // Very subtle dynamic overlay
          })
        }}>
          {children}
        </Animated.View>
      </ImageBackground>
    </Animated.View>
  );
}
