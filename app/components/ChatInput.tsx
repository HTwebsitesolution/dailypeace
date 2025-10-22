import React, { useRef } from "react";
import { View, TextInput, Pressable, Text } from "react-native";

export default function ChatInput({
  value,
  onChangeText,
  onSend,
  onVoiceStart,
  onVoiceEnd,
  recording = false,
  disabled = false,
}: {
  value: string;
  onChangeText: (t: string) => void;
  onSend: () => void;
  onVoiceStart?: () => void;
  onVoiceEnd?: () => void;
  recording?: boolean;
  disabled?: boolean;
}) {
  const inputRef = useRef<TextInput>(null);

  return (
    <View style={{ flexDirection: "row", alignItems: "center", gap: 8, paddingHorizontal: 12, paddingVertical: 12 }}>
      {/* Mic (hold) */}
      <Pressable
        onPressIn={onVoiceStart}
        onPressOut={onVoiceEnd}
        disabled={disabled}
        style={{
          paddingHorizontal: 12,
          paddingVertical: 12,
          borderRadius: 16,
          backgroundColor: recording ? "#EF4444" : "#3B82F6"
        }}
        accessibilityLabel="Hold to speak"
      >
        <Text style={{ color: "#FFFFFF", fontWeight: "600" }}>
          {recording ? "🎙️ Listening…" : "🎤 Hold to Speak"}
        </Text>
      </Pressable>

      {/* Input */}
      <View style={{
        flex: 1,
        borderRadius: 16,
        paddingHorizontal: 12,
        paddingVertical: 8,
        backgroundColor: "#141B23",
        borderWidth: 1,
        borderColor: "rgba(255,255,255,0.1)"
      }}>
        <TextInput
          ref={inputRef}
          value={value}
          onChangeText={onChangeText}
          placeholder="Share what's on your heart today..."
          placeholderTextColor="#9FB0C3"
          editable={!disabled}
          multiline
          style={{ color: "#FFFFFF", fontSize: 16 }}
        />
      </View>

      {/* Send */}
      <Pressable
        onPress={onSend}
        disabled={disabled || !value.trim()}
        style={{
          paddingHorizontal: 16,
          paddingVertical: 12,
          borderRadius: 16,
          backgroundColor: disabled || !value.trim() ? "rgba(255,255,255,0.1)" : "#3B82F6"
        }}
        accessibilityLabel="Send message"
      >
        <Text style={{ color: "#FFFFFF", fontWeight: "600" }}>Send ✉️</Text>
      </Pressable>
    </View>
  );
}