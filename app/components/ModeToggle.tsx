import React from "react";
import { View, Pressable, Text, Animated, useWindowDimensions } from "react-native";
import { hapticSelect } from "../../lib/haptics";

export type Mode = "conversational" | "biblical" | "reflective";

const LABELS: Record<Mode, string> = {
  conversational: "Friendly Chat",
  biblical: "Scripture Wisdom",
  reflective: "Quiet Reflection",
};

export default function ModeToggle({
  value,
  onChange,
}: {
  value: Mode;
  onChange: (m: Mode) => void;
}) {
  const { width } = useWindowDimensions();
  const isMobile = width < 768;
  const modes: Mode[] = ["conversational", "biblical", "reflective"];

  const handlePress = (mode: Mode) => {
    hapticSelect();
    onChange(mode);
  };

  return (
    <View style={{ 
      flexDirection: "row", 
      flexWrap: isMobile ? "wrap" : "nowrap",
      gap: 8, 
      paddingHorizontal: 12, 
      paddingVertical: 8,
      justifyContent: "center"
    }}>
      {modes.map((m, index) => {
        const active = value === m;
        // Third button (index 2) should be full width on mobile
        const isThirdButton = index === 2;
        const buttonWidth = isMobile && isThirdButton ? "100%" : undefined;
        
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
              backgroundColor: active ? "#3B82F6" : "#141B23",
              width: buttonWidth
            }}
            android_ripple={{ color: "#1f3a68" }}
          >
            <Text style={{
              fontSize: 15,
              fontWeight: "600",
              color: active ? "#FFFFFF" : "#9FB0C3",
              textAlign: buttonWidth ? "center" : "left"
            }}>
              {LABELS[m]}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
}
