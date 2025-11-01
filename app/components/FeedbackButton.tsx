import React from "react";
import { View, Pressable, Text } from "react-native";
import { hapticPress } from "../../lib/haptics";

interface FeedbackButtonProps {
  onPress: () => void;
}

export default function FeedbackButton({ onPress }: FeedbackButtonProps) {
  return (
    <Pressable
      onPress={() => {
        hapticPress();
        onPress();
      }}
      style={{
        position: "absolute",
        bottom: 80,
        right: 20,
        backgroundColor: "#3B82F6",
        width: 56,
        height: 56,
        borderRadius: 28,
        alignItems: "center",
        justifyContent: "center",
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 8,
        zIndex: 1000,
      }}
      android_ripple={{ color: "rgba(255, 255, 255, 0.3)" }}
    >
      <Text style={{ fontSize: 28 }}>💬</Text>
    </Pressable>
  );
}

