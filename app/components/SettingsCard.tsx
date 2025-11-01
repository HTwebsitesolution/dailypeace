import React from "react";
import { View, Text, ViewStyle, Pressable } from "react-native";

export default function SettingsCard({
  title,
  subtitle,
  right,
  onPress,
  style,
}: {
  title: string;
  subtitle?: string;
  right?: React.ReactNode;        // e.g., <Switch />
  onPress?: () => void;           // make whole row tappable if provided
  style?: ViewStyle;
}) {
  const Container = onPress ? Pressable : View;
  return (
    <Container
      onPress={onPress as any}
      style={[
        {
          backgroundColor: "#141B23",
          borderRadius: 16,
          paddingHorizontal: 16,
          paddingVertical: 12,
          marginBottom: 8,
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between"
        },
        style
      ]}
    >
      <View style={{ flex: 1, paddingRight: 12 }}>
        <Text style={{ color: "#FFFFFF", fontWeight: "600" }}>{title}</Text>
        {subtitle ? (
          <Text style={{ color: "#EAF2FF", marginTop: 2 }}>{subtitle}</Text>
        ) : null}
      </View>
      {right}
    </Container>
  );
}