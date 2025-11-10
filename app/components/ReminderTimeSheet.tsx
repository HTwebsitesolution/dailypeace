import React from "react";
import { Modal, Pressable, View } from "react-native";
import { Text } from "@/ux/ScaledText";

type ReminderOption = {
  label: string;
  value: number; // minutes since midnight or relative offset
};

type Props = {
  visible: boolean;
  selectedMinutes: number | null;
  options: ReminderOption[];
  onSelect: (minutes: number | null) => void;
  onClose: () => void;
};

export function ReminderTimeSheet({
  visible,
  selectedMinutes,
  options,
  onSelect,
  onClose,
}: Props) {
  const isSelected = (value: number) => value === selectedMinutes;

  return (
    <Modal
      transparent
      animationType="fade"
      visible={visible}
      statusBarTranslucent
      onRequestClose={onClose}
    >
      <Pressable
        onPress={onClose}
        style={{
          flex: 1,
          backgroundColor: "rgba(0,0,0,0.45)",
          justifyContent: "flex-end",
        }}
        pointerEvents={visible ? "auto" : "none"}
      >
        <View
          style={{
            backgroundColor: "#0F172A",
            borderTopLeftRadius: 24,
            borderTopRightRadius: 24,
            paddingHorizontal: 20,
            paddingTop: 20,
            paddingBottom: 32,
            gap: 12,
          }}
        >
          <Text baseSize={18} style={{ fontWeight: "700" }}>
            Choose a reminder
          </Text>
          <Text baseSize={13} style={{ color: "#9FB0C3" }}>
            Select when you would like Daily Peace to send a gentle nudge.
          </Text>

          <View style={{ gap: 8 }}>
            {options.map((option) => {
              const active = isSelected(option.value);
              return (
                <Pressable
                  key={option.value}
                  onPress={() => {
                    onSelect(option.value);
                    onClose();
                  }}
                  style={{
                    paddingVertical: 14,
                    paddingHorizontal: 16,
                    borderRadius: 16,
                    backgroundColor: active
                      ? "rgba(59,130,246,0.18)"
                      : "rgba(255,255,255,0.06)",
                    borderWidth: 1,
                    borderColor: active
                      ? "rgba(59,130,246,0.9)"
                      : "rgba(255,255,255,0.08)",
                  }}
                >
                  <Text baseSize={16} style={{ color: active ? "#FFFFFF" : "#EAF2FF", fontWeight: "600" }}>
                    {option.label}
                  </Text>
                </Pressable>
              );
            })}
          </View>

          <Pressable
            onPress={() => {
              onSelect(null);
              onClose();
            }}
            style={{
              paddingVertical: 13,
              paddingHorizontal: 16,
              borderRadius: 16,
              backgroundColor: "transparent",
              borderWidth: 1,
              borderColor: "rgba(255,255,255,0.14)",
              marginTop: 4,
            }}
          >
            <Text baseSize={15} style={{ color: "#9FB3FF", fontWeight: "600" }}>
              No reminder
            </Text>
          </Pressable>
        </View>
      </Pressable>
    </Modal>
  );
}

