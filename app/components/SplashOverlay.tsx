import React, { useEffect, useRef, useState } from "react";
import { View, Image, Animated, Easing, Platform } from "react-native";

export default function SplashOverlay({
  duration = 1000,
  onDone,
}: {
  duration?: number;
  onDone?: () => void;
}) {
  const [visible, setVisible] = useState(true);
  const opacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // fade in with gentle pulse
    Animated.parallel([
      Animated.timing(opacity, {
        toValue: 1,
        duration: 300,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }),
    ]).start();

    const t = setTimeout(() => {
      // fade out
      Animated.timing(opacity, { toValue: 0, duration: 400, easing: Easing.in(Easing.cubic), useNativeDriver: true })
        .start(() => {
          setVisible(false);
          onDone && onDone();
        });
    }, duration);

    return () => {
      clearTimeout(t);
    };
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
          opacity: 0.96,
        }}
      />
    </Animated.View>
  );
}

