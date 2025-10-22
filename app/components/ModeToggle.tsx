
import React from "react";
import { View, Pressable, Text, Animated } from "react-native";

export type Mode = "conversational" | "biblical" | "reflective";

const LABELS: Record<Mode, string> = {
  conversational: "Conversational",
  biblical: "Biblical",
  reflective: "Reflective",
};

export default function ModeToggle({
  value,
  onChange,
}: {
  value: Mode;
  onChange: (m: Mode) => void;
}) {
  const modes: Mode[] = ["conversational", "biblical", "reflective"];

  const handlePress = (mode: Mode) => {
    // Add haptic feedback through animation
    onChange(mode);
  };

  return (
    <View style={{ flexDirection: "row", gap: 8, paddingHorizontal: 12, paddingVertical: 8 }}>
      {modes.map((m) => {
        const active = value === m;
        return (
          <Pressable
            key={m}
            onPress={() => handlePress(m)}
            style={{
              paddingVertical: 8,
              paddingHorizontal: 12,
              borderRadius: 20,
              borderWidth: 1,
              borderColor: active ? "#3B82F6" : "transparent",
              backgroundColor: active ? "#3B82F6" : "#141B23"
            }}
            android_ripple={{ color: "#1f3a68" }}
          >
            <Text style={{
              fontSize: 15,
              fontWeight: "600",
              color: active ? "#FFFFFF" : "#9FB0C3"
            }}>
              {LABELS[m]}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
}
