import React, { useRef } from "react";
import { View, TextInput, Pressable, Text, useWindowDimensions } from "react-native";

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
  const { width } = useWindowDimensions();
  const isMobile = width < 768;

  return (
    <View style={{ flexDirection: "row", alignItems: "center", gap: 8, paddingHorizontal: 12, paddingVertical: 12 }}>
      {/* Mic (hold) */}
      <Pressable
        onPressIn={onVoiceStart}
        onPressOut={onVoiceEnd}
        onMouseDown={onVoiceStart}
        onMouseUp={onVoiceEnd}
        onMouseLeave={onVoiceEnd}
        disabled={disabled}
        style={{
          paddingHorizontal: isMobile ? 8 : 12,
          paddingVertical: isMobile ? 10 : 12,
          borderRadius: 12,
          backgroundColor: recording ? "#EF4444" : "#3B82F6"
        }}
        accessibilityLabel="Hold to speak"
      >
        <Text style={{ 
          color: "#FFFFFF", 
          fontWeight: "600",
          fontSize: isMobile ? 14 : 16
        }}>
          {isMobile 
            ? (recording ? "🎙️" : "🎤") 
            : (recording ? "🎙️ Listening with care…" : "🎤 Hold to share your voice")
          }
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
          placeholder="What's on your mind? I'm listening..."
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
          paddingHorizontal: isMobile ? 12 : 16,
          paddingVertical: isMobile ? 10 : 12,
          borderRadius: 12,
          backgroundColor: disabled || !value.trim() ? "rgba(255,255,255,0.1)" : "#3B82F6"
        }}
        accessibilityLabel="Send message"
      >
        <Text style={{ 
          color: "#FFFFFF", 
          fontWeight: "600",
          fontSize: isMobile ? 14 : 16
        }}>
          {isMobile ? "Send" : "Send 💌"}
        </Text>
      </Pressable>
    </View>
  );
}
