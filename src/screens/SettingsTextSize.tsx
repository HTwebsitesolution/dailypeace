import React from "react";
import { View, Pressable } from "react-native";
import { useFontScale } from "@/ux/useFontScale";
import { Text } from "@/ux/ScaledText";

const PRESETS = [
  { label: "Small", value: 0.9 },
  { label: "Default", value: 1.0 },
  { label: "Large", value: 1.15 },
  { label: "Extra-Large", value: 1.3 },
];

export default function SettingsTextSize() {
  const { appMult, setMultiplier, system, factor } = useFontScale();

  return (
    <View style={{ padding: 16, gap: 12 }}>
      <Text baseSize={18} style={{ fontWeight: "700" }}>
        Text Size
      </Text>
      <Text baseSize={14} style={{ opacity: 0.7 }}>
        Respects your device’s text size. You can also boost it in-app.
      </Text>

      <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 8, marginTop: 8 }}>
        {PRESETS.map((p) => {
          const active = p.value === appMult;
          return (
            <Pressable
              key={p.label}
              onPress={() => setMultiplier(p.value)}
              style={{
                paddingVertical: 8,
                paddingHorizontal: 12,
                borderRadius: 10,
                borderWidth: 1,
                borderColor: active ? "#60A5FA" : "rgba(255,255,255,0.15)",
                backgroundColor: active ? "rgba(96,165,250,0.15)" : "transparent",
              }}
            >
              <Text baseSize={14}>{p.label}</Text>
            </Pressable>
          );
        })}
      </View>

      <View style={{ marginTop: 16 }}>
        <Text baseSize={14} style={{ opacity: 0.7 }}>
          System factor: {system.toFixed(2)} · App boost: {appMult.toFixed(2)} · Effective: {factor.toFixed(2)}
        </Text>
        <Text baseSize={16} style={{ marginTop: 8 }}>
          Preview: “Blessed are the peacemakers…”
        </Text>
      </View>
    </View>
  );
}





