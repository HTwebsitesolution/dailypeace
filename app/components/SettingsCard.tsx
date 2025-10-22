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
      className="bg-surface rounded-2xl px-4 py-3 mb-2 flex-row items-center justify-between"
      style={style}
    >
      <View className="flex-1 pr-3">
        <Text className="text-white font-semibold">{title}</Text>
        {subtitle ? <Text className="text-muted mt-0.5">{subtitle}</Text> : null}
      </View>
      {right}
    </Container>
  );
}