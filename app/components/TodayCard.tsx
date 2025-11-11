import React from "react";
import { View } from "react-native";
import { Text } from "@/ux/ScaledText";

export default function TodayCard({ verse, refText }: { verse: string; refText: string }) {
  return (
    <View
      style={{
        marginTop: 18,
        marginHorizontal: 20,
        padding: 14,
        borderRadius: 16,
        backgroundColor: "rgba(255,255,255,0.06)",
        borderWidth: 1,
        borderColor: "rgba(255,255,255,0.10)",
      }}
    >
      <Text baseSize={13} style={{ opacity: 0.7, marginBottom: 4 }}>
        Today’s reflection
      </Text>
      <Text baseSize={15} style={{ fontWeight: "600" }}>{verse}</Text>
      <Text baseSize={12} style={{ opacity: 0.6, marginTop: 6 }}>{refText}</Text>
    </View>
  );
}


