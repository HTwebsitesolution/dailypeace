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
    <View className="rounded-2xl bg-[#141B23] border border-white/10 p-4">
      <Text className="text-white font-semibold text-lg">Read Aloud</Text>
      <Text className="text-[#9FB0C3] mt-1">On-device text-to-speech for replies.</Text>
      {Platform.OS === 'web' && (
        <Text className="text-[#9FB0C3] mt-2 text-xs italic">
          💡 Tip: Voice quality varies by browser. Try Chrome or Edge for best results.
        </Text>
      )}

      <View className="flex-row items-center gap-3 mt-3">
        <Pressable
          onPress={() => setAuto(!s.auto)}
          className={`px-3 py-2 rounded-xl border ${s.auto ? "bg-primary/30 border-primary" : "bg-white/10 border-white/10"}`}
        >
          <Text className="text-white">{s.auto ? "Auto-read: On" : "Auto-read: Off"}</Text>
        </Pressable>
      </View>

      {/* Rate */}
      <View className="mt-4">
        <Text className="text-white">Rate: {s.rate.toFixed(2)}</Text>
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
      <View className="mt-4">
        <Text className="text-white">Pitch: {s.pitch.toFixed(2)}</Text>
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
      <View className="mt-4">
        <Text className="text-white mb-2">Voice</Text>
        <View className="flex-row flex-wrap gap-2">
          <Pressable
            onPress={() => setVoice(undefined)}
            className={`px-3 py-2 rounded-xl border ${!s.voice ? "bg-primary/30 border-primary" : "bg-white/10 border-white/10"}`}
          >
            <Text className="text-white">System default</Text>
          </Pressable>
          {voices.slice(0, 8).map((v) => (
            <Pressable
              key={v.id}
              onPress={() => setVoice(v.id)}
              className={`px-3 py-2 rounded-xl border ${s.voice === v.id ? "bg-primary/30 border-primary" : "bg-white/10 border-white/10"}`}
            >
              <Text className="text-white">{v.name}</Text>
            </Pressable>
          ))}
        </View>
        {voices.length === 0 && (
          <Text className="text-[#9FB0C3] mt-2">
            Voices may be managed in system settings on this device.
          </Text>
        )}
      </View>
    </View>
  );
}

