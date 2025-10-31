import React, { useEffect, useRef, useState } from "react";
import { View, Image, Animated, Easing, Platform, Text } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import AsyncStorage from "@react-native-async-storage/async-storage";

const THEMES = {
  ocean: {
    colors: ["#0B1016", "#1A2330", "#254A7B"],
    halo: "#87BFFF",
    text: "#EAF2FF",
  },
  dove: {
    colors: ["#0B1016", "#2C2E43", "#565D93"],
    halo: "#FCD34D",
    text: "#FFFFFF",
  },
  mountain: {
    colors: ["#0B1016", "#1C2E3C", "#3A7CA5"],
    halo: "#9BD9FF",
    text: "#EAF2FF",
  },
};

export default function AnimatedSplash({
  onFinish,
  minDuration = 1100,
}: {
  onFinish: () => void;
  minDuration?: number;
}) {
  const fade = useRef(new Animated.Value(1)).current;
  const scale = useRef(new Animated.Value(0.96)).current;
  const halo = useRef(new Animated.Value(0)).current;
  const [theme, setTheme] = useState(THEMES.ocean); // default ocean

  useEffect(() => {
    (async () => {
      const stored = await AsyncStorage.getItem("@dp/theme");
      setTheme(THEMES[stored as keyof typeof THEMES] || THEMES.ocean);
    })();
  }, []);

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(halo, { toValue: 1, duration: 900, easing: Easing.inOut(Easing.quad), useNativeDriver: false }),
        Animated.timing(halo, { toValue: 0, duration: 900, easing: Easing.inOut(Easing.quad), useNativeDriver: false }),
      ])
    ).start();

    const t = setTimeout(() => {
      Animated.parallel([
        Animated.timing(fade, { toValue: 0, duration: 420, easing: Easing.in(Easing.cubic), useNativeDriver: true }),
        Animated.timing(scale, { toValue: 1, duration: 420, easing: Easing.out(Easing.cubic), useNativeDriver: true }),
      ]).start(() => onFinish());
    }, minDuration);

    return () => clearTimeout(t);
  }, [fade, scale, onFinish, minDuration, halo]);

  const haloSize = halo.interpolate({ inputRange: [0, 1], outputRange: [180, 230] });
  const haloOpacity = halo.interpolate({ inputRange: [0, 1], outputRange: [0.18, 0.32] });

  return (
    <Animated.View
      pointerEvents="none"
      style={{
        position: "absolute",
        inset: 0 as any,
        opacity: fade,
        zIndex: 9999,
      }}
    >
      <LinearGradient
        colors={theme.colors}
        start={{ x: 0.2, y: 0.1 }}
        end={{ x: 0.8, y: 1 }}
        style={{ position: "absolute", inset: 0 as any }}
      />

      <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
        <Animated.View
          style={{
            position: "absolute",
            width: haloSize as any,
            height: haloSize as any,
            borderRadius: 999,
            backgroundColor: theme.halo,
            opacity: haloOpacity as any,
            filter: Platform.OS === "web" ? "blur(24px)" : undefined,
          }}
        />
        <Animated.Image
          source={require("../../assets/branding/icons/icon-ios.png")}
          resizeMode="contain"
          style={{ width: 180, height: 180, transform: [{ scale }] }}
        />
        <Text style={{ color: theme.text, opacity: 0.9, marginTop: 14 }}>
          Finding peace in every moment ✨
        </Text>
      </View>
    </Animated.View>
  );
}

