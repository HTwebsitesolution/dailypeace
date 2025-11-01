import React, { useEffect, useState } from "react";
import { View, Image, Animated, Easing, Platform } from "react-native";

export default function SplashOverlay({
  duration = 1000,
  onDone,
}: {
  duration?: number;
  onDone?: () => void;
}) {
  const [visible, setVisible] = useState(true);
  const opacity = new Animated.Value(0);
  const scale = new Animated.Value(0.95);
  const pulse = new Animated.Value(1);

  useEffect(() => {
    // fade in with gentle pulse
    Animated.parallel([
      Animated.timing(opacity, { toValue: 1, duration: 300, easing: Easing.out(Easing.cubic), useNativeDriver: true }),
      Animated.timing(scale, { toValue: 1, duration: 300, easing: Easing.out(Easing.cubic), useNativeDriver: true }),
    ]).start();

    // gentle pulse during display
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulse, { toValue: 1.03, duration: 700, easing: Easing.inOut(Easing.ease), useNativeDriver: true }),
        Animated.timing(pulse, { toValue: 1, duration: 700, easing: Easing.inOut(Easing.ease), useNativeDriver: true }),
      ])
    ).start();

    const t = setTimeout(() => {
      // fade out
      Animated.timing(opacity, { toValue: 0, duration: 400, easing: Easing.in(Easing.cubic), useNativeDriver: true })
        .start(() => {
          setVisible(false);
          onDone && onDone();
        });
    }, duration);

    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (!visible) return null;

  return (
    <Animated.View
      style={{
        position: "absolute",
        inset: 0 as any,
        backgroundColor: "#FFFFFF",
        justifyContent: "center",
        alignItems: "center",
        opacity,
        zIndex: 9999,
      }}
      pointerEvents="none"
    >
      <Animated.Image
        source={require("../../assets/Bible Circle Daily Peace Logo.png")}
        resizeMode="contain"
        style={{
          width: 300,
          height: 300,
          transform: [{ scale: Animated.multiply(scale, pulse) }],
          opacity: 0.96,
        }}
      />
    </Animated.View>
  );
}

