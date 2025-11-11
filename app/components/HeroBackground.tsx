import React from "react";
import { View } from "react-native";
import { LinearGradient } from "expo-linear-gradient";

export default function HeroBackground() {
  return (
    <View pointerEvents="none" style={{ position: "absolute", inset: 0 }}>
      <LinearGradient
        colors={["rgba(0,0,0,0.25)", "rgba(0,0,0,0.7)"]}
        locations={[0.2, 1]}
        style={{ position: "absolute", inset: 0 }}
      />
      <LinearGradient
        colors={["#0B1016", "#0B3A63", "#0B1016"]}
        locations={[0, 0.5, 1]}
        start={{ x: 0.5, y: 0 }}
        end={{ x: 0.5, y: 1 }}
        style={{ position: "absolute", inset: 0, opacity: 0.35 }}
      />
    </View>
  );
}
