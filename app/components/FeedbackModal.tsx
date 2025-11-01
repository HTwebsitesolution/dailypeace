import React, { useState } from "react";
import { View, Text, Pressable, Modal, TextInput } from "react-native";
import { hapticPress, hapticSuccess } from "../../lib/haptics";
import { track } from "../../lib/analytics";

const EMOJI_OPTIONS = [
  { emoji: "😊", label: "Great", value: 5 },
  { emoji: "🙂", label: "Good", value: 4 },
  { emoji: "😐", label: "Okay", value: 3 },
  { emoji: "🙁", label: "Not Great", value: 2 },
  { emoji: "😢", label: "Poor", value: 1 },
];

interface FeedbackModalProps {
  visible: boolean;
  onClose: () => void;
}

export default function FeedbackModal({ visible, onClose }: FeedbackModalProps) {
  const [selectedRating, setSelectedRating] = useState<number | null>(null);
  const [feedbackText, setFeedbackText] = useState("");

  const handleSubmit = () => {
    hapticSuccess();
    
    // Track feedback in PostHog
    track("user_feedback", {
      rating: selectedRating,
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
      <View
        style={{
          flex: 1,
          backgroundColor: "rgba(0, 0, 0, 0.8)",
          justifyContent: "center",
          alignItems: "center",
          paddingHorizontal: 24,
        }}
      >
        <View
          style={{
            backgroundColor: "#141B23",
            borderRadius: 24,
            padding: 24,
            width: "100%",
            maxWidth: 400,
            borderWidth: 1,
            borderColor: "rgba(255, 255, 255, 0.1)",
          }}
        >
          {/* Header */}
          <View style={{ marginBottom: 20 }}>
            <Text
              style={{
                color: "#FFFFFF",
                fontSize: 24,
                fontWeight: "700",
                marginBottom: 8,
              }}
            >
              How is your experience today?
            </Text>
            <Text
              style={{
                color: "#9FB0C3",
                fontSize: 14,
                lineHeight: 20,
              }}
            >
              Your feedback helps us improve Daily Peace
            </Text>
          </View>

          {/* Emoji Selection */}
          <View style={{ flexDirection: "row", justifyContent: "space-between", marginBottom: 24 }}>
            {EMOJI_OPTIONS.map((option) => (
              <Pressable
                key={option.value}
                onPress={() => {
                  hapticPress();
                  setSelectedRating(option.value);
                }}
                style={{
                  alignItems: "center",
                  paddingHorizontal: 12,
                  paddingVertical: 12,
                  borderRadius: 16,
                  backgroundColor:
                    selectedRating === option.value
                      ? "rgba(59, 130, 246, 0.2)"
                      : "transparent",
                  borderWidth: selectedRating === option.value ? 2 : 0,
                  borderColor: "#3B82F6",
                }}
              >
                <Text style={{ fontSize: 36, marginBottom: 4 }}>
                  {option.emoji}
                </Text>
                <Text
                  style={{
                    color:
                      selectedRating === option.value ? "#3B82F6" : "#9FB0C3",
                    fontSize: 12,
                    fontWeight: "600",
                  }}
                >
                  {option.label}
                </Text>
              </Pressable>
            ))}
          </View>

          {/* Optional Text Input */}
          <TextInput
            value={feedbackText}
            onChangeText={setFeedbackText}
            placeholder="Tell us more (optional)..."
            placeholderTextColor="#6B7280"
            style={{
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
            }}
            multiline
            numberOfLines={4}
            maxLength={500}
          />

          {/* Action Buttons */}
          <View style={{ flexDirection: "row", gap: 12 }}>
            <Pressable
              onPress={handleClose}
              style={{
                flex: 1,
                paddingVertical: 14,
                borderRadius: 12,
                backgroundColor: "rgba(255, 255, 255, 0.1)",
                borderWidth: 1,
                borderColor: "rgba(255, 255, 255, 0.2)",
              }}
            >
              <Text
                style={{
                  color: "#EAF2FF",
                  fontSize: 16,
                  fontWeight: "600",
                  textAlign: "center",
                }}
              >
                Cancel
              </Text>
            </Pressable>
            <Pressable
              onPress={handleSubmit}
              disabled={!canSubmit}
              style={{
                flex: 1,
                paddingVertical: 14,
                borderRadius: 12,
                backgroundColor: canSubmit ? "#3B82F6" : "rgba(59, 130, 246, 0.3)",
              }}
            >
              <Text
                style={{
                  color: "#FFFFFF",
                  fontSize: 16,
                  fontWeight: "600",
                  textAlign: "center",
                }}
              >
                Submit
              </Text>
            </Pressable>
          </View>

          {/* Character Count */}
          <Text
            style={{
              color: "#6B7280",
              fontSize: 12,
              textAlign: "center",
              marginTop: 12,
            }}
          >
            {feedbackText.length}/500 characters
          </Text>
        </View>
      </View>
    </Modal>
  );
}

