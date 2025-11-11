import React, { useRef } from "react";
import { View, TextInput, Pressable, useWindowDimensions } from "react-native";
import { hapticPress, hapticConfirm } from "../../lib/haptics";
import { Text } from "@/ux/ScaledText";
import { useFontScale } from "@/ux/useFontScale";

type Props = {
  value: string;
  onChangeText: (t: string) => void;
  onSend: () => void;
  onVoiceStart?: () => void;
  onVoiceEnd?: () => void;
  recording?: boolean;
  disabled?: boolean;
  bottomInset?: number;
  inputAccessoryViewID?: string;
};

export default function ChatInput({
  value,
  onChangeText,
  onSend,
  onVoiceStart,
  onVoiceEnd,
  recording = false,
  disabled = false,
  bottomInset = 0,
  inputAccessoryViewID,
}: Props) {
  const inputRef = useRef<TextInput>(null);
  const { width } = useWindowDimensions();
  const isMobile = width < 768;
  const { fs } = useFontScale();
  const inputFontSize = fs(16);

  return (
    <View
      style={{
        flexDirection: "row",
        alignItems: "center",
        gap: 8,
        paddingHorizontal: 12,
        paddingTop: 12,
        paddingBottom: 12 + Math.max(bottomInset, 0),
      }}
    >
      <Pressable
        onPress={() => {
          hapticPress();
          if (recording) {
            onVoiceEnd?.();
          } else {
            onVoiceStart?.();
          }
        }}
        disabled={disabled}
        style={{
          paddingHorizontal: isMobile ? 8 : 12,
          paddingVertical: isMobile ? 10 : 12,
          borderRadius: 12,
          backgroundColor: recording ? "#EF4444" : "#3B82F6",
        }}
        accessibilityLabel={recording ? "Stop recording" : "Start voice input"}
      >
        <Text
          style={{
            color: "#FFFFFF",
            fontWeight: "600",
            fontSize: fs(isMobile ? 14 : 16),
          }}
        >
          {isMobile
            ? recording
              ? "🎙️"
              : "🎤"
            : recording
            ? "🎙️ Listening with care…"
            : "🎤 Hold to share your voice"}
        </Text>
      </Pressable>

      <View
        style={{
          flex: 1,
          borderRadius: 16,
          paddingHorizontal: 12,
          paddingVertical: 8,
          backgroundColor: "#141B23",
          borderWidth: 1,
          borderColor: "rgba(255,255,255,0.1)",
        }}
      >
        <TextInput
          ref={inputRef}
          value={value}
          onChangeText={onChangeText}
          placeholder="What's on your mind? I'm listening..."
          placeholderTextColor="#9FB0C3"
          editable={!disabled}
          multiline
          inputAccessoryViewID={inputAccessoryViewID}
          style={{ color: "#FFFFFF", fontSize: inputFontSize }}
        />
      </View>

      <Pressable
        onPress={() => {
          hapticConfirm();
          onSend();
        }}
        disabled={disabled || !value.trim()}
        style={{
          paddingHorizontal: isMobile ? 12 : 16,
          paddingVertical: isMobile ? 10 : 12,
          borderRadius: 12,
          backgroundColor:
            disabled || !value.trim() ? "rgba(255,255,255,0.1)" : "#3B82F6",
        }}
        accessibilityLabel="Send message"
      >
        <Text baseSize={isMobile ? 14 : 16} style={{ fontWeight: "600", textAlign: "center" }}>
          {isMobile ? "Send" : "Send 💌"}
        </Text>
      </Pressable>
    </View>
  );
}
