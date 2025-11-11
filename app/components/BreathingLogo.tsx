import React, { useEffect, useRef } from "react";
import { Animated, Image, View, ViewStyle } from "react-native";

const logoImage = require("../../assets/Bible Circle Daily Peace Logo.png");

type Props = {
  size?: number;
  style?: ViewStyle;
};

export default function BreathingLogo({ size = 200, style }: Props) {
  const pulse = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulse, {
          toValue: 1,
          duration: 2600,
          useNativeDriver: true,
        }),
        Animated.timing(pulse, {
          toValue: 0,
          duration: 2600,
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, [pulse]);

  const haloScale = pulse.interpolate({
    inputRange: [0, 0.5, 1],
    outputRange: [1, 1.08, 1],
  });

  const haloOpacity = pulse.interpolate({
    inputRange: [0, 0.5, 1],
    outputRange: [0.45, 0.7, 0.45],
  });

  const haloSize = size * 1.6;

  return (
    <View style={[{ justifyContent: "center", alignItems: "center" }, style]}>
      <Animated.View
        style={{
          position: "absolute",
          width: haloSize,
          height: haloSize,
          borderRadius: haloSize / 2,
          backgroundColor: "rgba(255, 255, 255, 0.22)",
          transform: [{ scale: haloScale }],
          opacity: haloOpacity,
        }}
      />
      <View
        style={{
          width: size,
          height: size,
          borderRadius: size / 2,
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: "rgba(255, 255, 255, 0.85)",
          shadowColor: "#ffffff",
          shadowOpacity: 0.6,
          shadowOffset: { width: 0, height: 20 },
          shadowRadius: 30,
          elevation: 12,
        }}
      >
        <Image
          source={logoImage}
          resizeMode="contain"
          style={{ width: size * 0.75, height: size * 0.75 }}
        />
      </View>
    </View>
  );
}
