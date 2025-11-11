import React from "react";
import { Pressable, ViewStyle } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Text } from "@/ux/ScaledText";

type Props = {
  label: string;
  active?: boolean;
  onPress?: () => void;
  style?: ViewStyle;
};

export default function GlassPill({ label, active, onPress, style }: Props) {
  return (
    <Pressable
      accessibilityRole="button"
      onPress={onPress}
      style={[{ borderRadius: 16, overflow: "hidden" }, style]}
    >
      <LinearGradient
        colors={
          active
            ? ["rgba(59,130,246,0.28)", "rgba(59,130,246,0.16)"]
            : ["rgba(255,255,255,0.08)", "rgba(255,255,255,0.04)"]
        }
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={{
          paddingHorizontal: 14,
          paddingVertical: 10,
          borderRadius: 16,
          borderWidth: 1,
          borderColor: "rgba(255,255,255,0.12)",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Text baseSize={15} style={{ fontWeight: "600", color: "#EAF2FF" }}>
          {label}
        </Text>
      </LinearGradient>
    </Pressable>
  );
}
