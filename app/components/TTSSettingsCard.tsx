import React, { useEffect, useState } from "react";
import { View, Text, Pressable, Platform } from "react-native";
import { getState, subscribe, setAuto, setVoice, getVoices, TTSState } from "../../lib/tts";
import VoiceTestPanel from "./VoiceTestPanel";

export default function TTSSettingsCard() {
  const [s, setS] = useState<TTSState>(getState());
  const [voices, setVoices] = useState<Array<{ id: string; name: string }>>([]);

  useEffect(() => {
    const unsub = subscribe(setS);
    (async () => setVoices(await getVoices()))();
    return unsub;
  }, []);

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
              onPress={() => setVoice(v.id)}
              style={{
                paddingHorizontal: 12,
                paddingVertical: 8,
                borderRadius: 12,
                borderWidth: 1,
                borderColor: s.voice === v.id ? "rgba(59,130,246,0.5)" : "rgba(255,255,255,0.1)",
                backgroundColor: s.voice === v.id ? "rgba(59,130,246,0.3)" : "rgba(255,255,255,0.1)"
              }}
            >
              <Text style={{ color: "#FFFFFF" }}>{v.name}</Text>
            </Pressable>
          ))}
        </View>
      </View>

      {/* Voice Test Panel */}
      <VoiceTestPanel voice={s.voice} />
    </View>
  );
}

