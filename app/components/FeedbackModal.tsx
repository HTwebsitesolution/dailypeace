import React, { useState } from "react";
import { View, Pressable, Modal, TextInput, StyleSheet, Text as RNText } from "react-native";
import { Text } from "@/ux/ScaledText";
import { hapticPress, hapticSuccess } from "../../lib/haptics";
import { track } from "../../lib/analytics";

const EMOJI_SIZE = 38;
const EMOJI_LINE = Math.round(EMOJI_SIZE * 1.15);

const EMOJI_OPTIONS = [
  { key: "great", char: "😄", label: "Great" },
  { key: "good", char: "🙂", label: "Good" },
  { key: "okay", char: "😐", label: "Okay" },
  { key: "meh", char: "🙁", label: "Not Great" },
  { key: "poor", char: "😢", label: "Poor" },
];

const RATING_VALUES: Record<string, number> = {
  great: 5,
  good: 4,
  okay: 3,
  meh: 2,
  poor: 1,
};

interface FeedbackModalProps {
  visible: boolean;
  onClose: () => void;
}

export default function FeedbackModal({ visible, onClose }: FeedbackModalProps) {
  const [selectedRating, setSelectedRating] = useState<string | null>(null);
  const [feedbackText, setFeedbackText] = useState("");

  const handleSubmit = () => {
    hapticSuccess();
    
    // Track feedback in PostHog
    track("user_feedback", {
      rating: selectedRating ? RATING_VALUES[selectedRating] : null,
      feedback: feedbackText,
      timestamp: Date.now(),
    });

    // Log for now (can integrate with backend later)
    console.log("User Feedback:", {
      rating: selectedRating,
      feedback: feedbackText,
    });

    // Reset and close
    setSelectedRating(null);
    setFeedbackText("");
    onClose();
  };

  const handleClose = () => {
    hapticPress();
    setSelectedRating(null);
    setFeedbackText("");
    onClose();
  };

  const canSubmit = selectedRating !== null;

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={handleClose}
    >
      <View style={styles.backdrop}>
        <View style={styles.card}>
          {/* Header */}
          <View style={styles.headerBlock}>
            <Text baseSize={24} style={styles.headerTitle}>
              How is your experience today?
            </Text>
            <Text baseSize={14} style={styles.headerSubtitle}>
              Your feedback helps us improve Daily Peace
            </Text>
          </View>

          <EmojiRow
            value={selectedRating ?? undefined}
            onChange={(key) => {
              hapticPress();
              setSelectedRating(key);
            }}
          />

          {/* Optional Text Input */}
          <TextInput
            value={feedbackText}
            onChangeText={setFeedbackText}
            placeholder="Tell us more (optional)..."
            placeholderTextColor="#6B7280"
            style={styles.textInput}
            multiline
            numberOfLines={4}
            maxLength={500}
          />

          {/* Action Buttons */}
          <View style={styles.buttonRow}>
            <Pressable
              onPress={handleClose}
              style={styles.cancelButton}
            >
              <Text baseSize={16} style={styles.cancelText}>
                Cancel
              </Text>
            </Pressable>
            <Pressable
              onPress={handleSubmit}
              disabled={!canSubmit}
              style={[styles.submitButton, !canSubmit && styles.submitButtonDisabled]}
            >
              <Text baseSize={16} style={styles.submitText}>
                Submit
              </Text>
            </Pressable>
          </View>

          {/* Character Count */}
          <Text baseSize={12} style={styles.charCount}>
            {feedbackText.length}/500 characters
          </Text>
        </View>
      </View>
    </Modal>
  );
}

export function EmojiRow({
  value,
  onChange,
}: {
  value?: string;
  onChange: (k: string) => void;
}) {
  return (
    <View style={styles.emojiRow}>
      {EMOJI_OPTIONS.map((option) => {
        const active = value === option.key;
        return (
          <Pressable
            key={option.key}
            style={styles.emojiItem}
            onPress={() => onChange(option.key)}
          >
            <RNText
              allowFontScaling={false}
              style={[styles.emojiGlyph, active && styles.emojiGlyphActive]}
            >
              {option.char}
            </RNText>
            <Text baseSize={14} style={[styles.emojiLabel, active && styles.emojiLabelActive]}>
              {option.label}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.8)",
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 24,
  },
  card: {
    backgroundColor: "#141B23",
    borderRadius: 28,
    paddingHorizontal: 24,
    paddingBottom: 24,
    paddingTop: 28,
    width: "100%",
    maxWidth: 400,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.1)",
    overflow: "visible",
  },
  headerBlock: {
    marginBottom: 20,
  },
  headerTitle: {
    color: "#FFFFFF",
    fontWeight: "700",
    marginBottom: 8,
    textAlign: "center",
  },
  headerSubtitle: {
    color: "#9FB0C3",
    lineHeight: 20,
    textAlign: "center",
  },
  emojiRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    paddingHorizontal: 4,
    paddingTop: 8,
    paddingBottom: 4,
    marginBottom: 24,
  },
  emojiItem: {
    width: 66,
    alignItems: "center",
  },
  emojiGlyph: {
    fontSize: EMOJI_SIZE,
    lineHeight: EMOJI_LINE,
    marginTop: 2,
    textAlign: "center",
    includeFontPadding: false as any,
  },
  emojiGlyphActive: {
    transform: [{ scale: 1.08 }],
  },
  emojiLabel: {
    opacity: 0.85,
    marginTop: 6,
    textAlign: "center",
  },
  emojiLabelActive: {
    opacity: 1,
  },
  textInput: {
    backgroundColor: "#0B1016",
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    color: "#FFFFFF",
    fontSize: 16,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.1)",
    minHeight: 100,
    textAlignVertical: "top",
    marginBottom: 20,
  },
  buttonRow: {
    flexDirection: "row",
    gap: 12,
  },
  cancelButton: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 12,
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.2)",
  },
  cancelText: {
    color: "#EAF2FF",
    fontWeight: "600",
    textAlign: "center",
  },
  submitButton: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 12,
    backgroundColor: "#3B82F6",
  },
  submitButtonDisabled: {
    backgroundColor: "rgba(59, 130, 246, 0.3)",
  },
  submitText: {
    color: "#FFFFFF",
    fontWeight: "600",
    textAlign: "center",
  },
  charCount: {
    color: "#6B7280",
    textAlign: "center",
    marginTop: 12,
  },
});

