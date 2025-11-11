import React from "react";
import { Pressable, View } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Text } from "@/ux/ScaledText";

export default function PremiumCTA({ onPress }: { onPress: () => void }) {
  return (
    <Pressable onPress={onPress} style={{ alignSelf: "center" }}>
      <LinearGradient
        colors={["#3B82F6", "#2563EB"]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={{
          paddingVertical: 16,
          paddingHorizontal: 22,
          borderRadius: 18,
          shadowColor: "#3B82F6",
          shadowOpacity: 0.35,
          shadowRadius: 22,
          shadowOffset: { width: 0, height: 14 },
        }}
      >
        <Text
          baseSize={18}
          style={{ fontWeight: "800", letterSpacing: 0.2, textAlign: "center" }}
        >
          Start a Conversation 🙏
        </Text>
      </LinearGradient>
      <View
        style={{
          position: "absolute",
          inset: -2 as any,
          borderRadius: 20,
          borderWidth: 1,
          borderColor: "rgba(255,255,255,0.18)",
          opacity: 0.9,
        }}
        pointerEvents="none"
      />
    </Pressable>
  );
}


