import React, { useEffect, useRef } from "react";
import { Animated, Image, View } from "react-native";

const logo = require("../../assets/Bible Circle Daily Peace Logo.png");

export default function HeroBadge() {
  const pulse = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    const animation = Animated.loop(
      Animated.sequence([
        Animated.timing(pulse, {
          toValue: 1.05,
          duration: 2800,
          useNativeDriver: true,
        }),
        Animated.timing(pulse, {
          toValue: 0.92,
          duration: 2800,
          useNativeDriver: true,
        }),
      ])
    );
    animation.start();
    return () => animation.stop();
  }, [pulse]);

  return (
    <Animated.View
      style={{
        alignSelf: "center",
        marginTop: 16,
        transform: [{ scale: pulse }],
        shadowColor: "#67C1FF",
        shadowOpacity: 0.35,
        shadowRadius: 28,
        shadowOffset: { width: 0, height: 16 },
        elevation: 12,
      }}
    >
      <View
        pointerEvents="none"
        style={{
          position: "absolute",
          width: 180,
          height: 180,
          borderRadius: 90,
          backgroundColor: "#ffffff",
          alignSelf: "center",
          top: -24,
        }}
      />
      <View
        style={{
          width: 155,
          height: 155,
          borderRadius: 77.5,
          backgroundColor: "rgba(255,255,255,0.08)",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Image
          source={logo}
          style={{ width: 130, height: 130, borderRadius: 65 }}
          resizeMode="cover"
        />
      </View>
    </Animated.View>
  );
}
