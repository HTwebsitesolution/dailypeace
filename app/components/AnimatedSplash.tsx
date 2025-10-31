import React, { useEffect, useRef } from "react";
import { View, Image, Animated, Easing, Platform, Text } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { brand } from "../../lib/brand";

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

  useEffect(() => {
    // gentle halo pulse during splash
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
        colors={[brand.bg, brand.navyMid, brand.ocean]}
        start={{ x: 0.2, y: 0.1 }}
        end={{ x: 0.8, y: 1 }}
        style={{ position: "absolute", inset: 0 as any }}
      />

      {/* center stack */}
      <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
        {/* pulsing halo */}
        <Animated.View
          style={{
            position: "absolute",
            width: haloSize as any,
            height: haloSize as any,
            borderRadius: 999,
            backgroundColor: brand.gold,
            opacity: haloOpacity as any,
            filter: Platform.OS === "web" ? "blur(24px)" : undefined,
          }}
        />
        {/* logo */}
        <Animated.Image
          source={require("../../assets/branding/icons/icon-ios.png")} // Use high-res logo
          resizeMode="contain"
          style={{ width: 180, height: 180, transform: [{ scale }] }}
        />
        {/* subtitle */}
        <Text style={{ color: brand.text, opacity: 0.9, marginTop: 14 }}>
          Finding peace in every moment ✨
        </Text>
      </View>
    </Animated.View>
  );
}

