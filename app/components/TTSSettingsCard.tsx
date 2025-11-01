import React, { useEffect, useState } from "react";
import { View, Text, Pressable, TextInput } from "react-native";
import { getState, subscribe, setAuto, setVoice, getVoices, TTSState } from "../../lib/tts";
import VoiceTestPanel from "./VoiceTestPanel";

const SUGGESTED_VOICES = ["alloy", "echo", "fable", "onyx", "nova", "shimmer"];

export default function TTSSettingsCard() {
  const [s, setS] = useState<TTSState>(getState());
  const [voices, setVoices] = useState<Array<{ id: string; name: string; description?: string }>>([]);
  const [customVoice, setCustomVoice] = useState("");

  useEffect(() => {
    const unsub = subscribe(setS);
    (async () => setVoices(await getVoices()))();
    return unsub;
  }, []);

  const handleVoiceSelect = (voiceId: string) => {
    setVoice(voiceId);
    setCustomVoice("");
  };

  const handleCustomVoiceSubmit = () => {
    if (customVoice.trim()) {
      setVoice(customVoice.trim());
    }
  };

  return (
    <View style={{ borderRadius: 16, backgroundColor: "#141B23", borderWidth: 1, borderColor: "rgba(255,255,255,0.1)", padding: 16 }}>
      <Text style={{ color: "#FFFFFF", fontWeight: "600", fontSize: 18 }}>Read Aloud</Text>
      <Text style={{ color: "#9FB0C3", marginTop: 4 }}>Premium OpenAI text-to-speech for replies.</Text>

      <View style={{ flexDirection: "row", alignItems: "center", gap: 12, marginTop: 12 }}>
        <Pressable
          onPress={() => setAuto(!s.auto)}
          style={{
            paddingHorizontal: 12,
            paddingVertical: 8,
            borderRadius: 12,
            borderWidth: 1,
            borderColor: s.auto ? "rgba(59,130,246,0.5)" : "rgba(255,255,255,0.1)",
            backgroundColor: s.auto ? "rgba(59,130,246,0.3)" : "rgba(255,255,255,0.1)"
          }}
        >
          <Text style={{ color: "#FFFFFF" }}>{s.auto ? "Auto-read: On" : "Auto-read: Off"}</Text>
        </Pressable>
      </View>

      {/* Voice picker */}
      <View style={{ marginTop: 16 }}>
        <Text style={{ color: "#FFFFFF", marginBottom: 8 }}>Voice</Text>
        <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 8 }}>
          {voices.map((v) => (
            <Pressable
              key={v.id}
              onPress={() => handleVoiceSelect(v.id)}
              style={{
                paddingHorizontal: 12,
                paddingVertical: 8,
                borderRadius: 12,
                borderWidth: 1,
                borderColor: s.voice === v.id ? "rgba(59,130,246,0.5)" : "rgba(255,255,255,0.1)",
                backgroundColor: s.voice === v.id ? "rgba(59,130,246,0.3)" : "rgba(255,255,255,0.1)"
              }}
            >
              <Text style={{ color: "#FFFFFF", fontWeight: "600" }}>{v.name}</Text>
              {v.description && (
                <Text style={{ color: "rgba(255,255,255,0.6)", fontSize: 10, marginTop: 2 }}>{v.description}</Text>
              )}
            </Pressable>
          ))}
        </View>

        {/* Custom voice input */}
        <View style={{ marginTop: 12, flexDirection: "row", gap: 8 }}>
          <TextInput
            value={customVoice}
            onChangeText={setCustomVoice}
            placeholder="Or enter custom voice id"
            placeholderTextColor="#9FB0C3"
            style={{
              flex: 1,
              backgroundColor: "rgba(255,255,255,0.05)",
              borderWidth: 1,
              borderColor: "rgba(255,255,255,0.1)",
              borderRadius: 12,
              paddingHorizontal: 12,
              paddingVertical: 8,
              color: "#FFFFFF"
            }}
            autoCapitalize="none"
            autoCorrect={false}
          />
          <Pressable
            onPress={handleCustomVoiceSubmit}
            disabled={!customVoice.trim()}
            style={{
              paddingHorizontal: 16,
              paddingVertical: 8,
              borderRadius: 12,
              backgroundColor: customVoice.trim() ? "rgba(59,130,246,0.3)" : "rgba(255,255,255,0.05)",
              borderWidth: 1,
              borderColor: customVoice.trim() ? "rgba(59,130,246,0.5)" : "rgba(255,255,255,0.1)"
            }}
          >
            <Text style={{ color: "#FFFFFF" }}>Apply</Text>
          </Pressable>
        </View>
      </View>

      {/* Voice Test Panel */}
      <VoiceTestPanel voice={s.voice} />
    </View>
  );
}

