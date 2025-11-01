import React, { useEffect, useState } from "react";
import { View, Text, Pressable, Platform, Slider } from "react-native";
import { getState, subscribe, setAuto, setRate, setPitch, setVoice, getVoices, TTSState } from "../../lib/tts";

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
      <Text style={{ color: "#9FB0C3", marginTop: 4 }}>On-device text-to-speech for replies.</Text>
      {Platform.OS === 'web' && (
        <Text style={{ color: "#9FB0C3", marginTop: 8, fontSize: 12, fontStyle: "italic" }}>
          💡 Tip: Voice quality varies by browser. Try Chrome or Edge for best results.
        </Text>
      )}

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

      {/* Rate */}
      <View style={{ marginTop: 16 }}>
        <Text style={{ color: "#FFFFFF" }}>Rate: {s.rate.toFixed(2)}</Text>
        <Slider
          minimumValue={0.6}
          maximumValue={1.4}
          step={0.02}
          value={s.rate}
          onValueChange={(v: number) => setRate(v)}
          minimumTrackTintColor="#3B82F6"
          maximumTrackTintColor="#9FB0C3"
        />
      </View>

      {/* Pitch */}
      <View style={{ marginTop: 16 }}>
        <Text style={{ color: "#FFFFFF" }}>Pitch: {s.pitch.toFixed(2)}</Text>
        <Slider
          minimumValue={0.8}
          maximumValue={1.2}
          step={0.02}
          value={s.pitch}
          onValueChange={(v: number) => setPitch(v)}
          minimumTrackTintColor="#3B82F6"
          maximumTrackTintColor="#9FB0C3"
        />
      </View>

      {/* Voice picker (best-effort per platform) */}
      <View style={{ marginTop: 16 }}>
        <Text style={{ color: "#FFFFFF", marginBottom: 8 }}>Voice</Text>
        <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 8 }}>
          <Pressable
            onPress={() => setVoice(undefined)}
            style={{
              paddingHorizontal: 12,
              paddingVertical: 8,
              borderRadius: 12,
              borderWidth: 1,
              borderColor: !s.voice ? "rgba(59,130,246,0.5)" : "rgba(255,255,255,0.1)",
              backgroundColor: !s.voice ? "rgba(59,130,246,0.3)" : "rgba(255,255,255,0.1)"
            }}
          >
            <Text style={{ color: "#FFFFFF" }}>System default</Text>
          </Pressable>
          {voices.slice(0, 8).map((v) => (
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
        {voices.length === 0 && (
          <Text style={{ color: "#9FB0C3", marginTop: 8 }}>
            Voices may be managed in system settings on this device.
          </Text>
        )}
      </View>
    </View>
  );
}

