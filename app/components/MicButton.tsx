
import React, { useRef, useState } from "react";
import { Pressable, Text } from "react-native";
import { Audio } from "expo-av";
import * as FileSystem from "expo-file-system";
import { apiTranscribe } from "@/lib/api";

export function MicButton({ onTranscribed }: { onTranscribed: (text: string)=>void }) {
  const recordingRef = useRef<Audio.Recording | null>(null);
  const [listening, setListening] = useState(false);

  async function start() {
    await Audio.requestPermissionsAsync();
    await Audio.setAudioModeAsync({ allowsRecordingIOS: true, playsInSilentModeIOS: true });
    const recording = new Audio.Recording();
    await recording.prepareToRecordAsync(Audio.RECORDING_OPTIONS_PRESET_HIGH_QUALITY);
    await recording.startAsync();
    recordingRef.current = recording;
    setListening(true);
  }

  async function stop() {
    const rec = recordingRef.current;
    if (!rec) return;
    await rec.stopAndUnloadAsync();
    const uri = rec.getURI();
    setListening(false);
    recordingRef.current = null;
    if (!uri) return;
    const base64 = await FileSystem.readAsStringAsync(uri, { encoding: FileSystem.EncodingType.Base64 });
    try {
      const text = await apiTranscribe("speech.m4a", base64);
      if (text) onTranscribed(text);
    } catch {}
  }

  return (
    <Pressable
      onPressIn={start}
      onPressOut={stop}
      style={{ padding: 12, borderRadius: 24, backgroundColor: listening ? "#E53935" : "#2F80ED" }}>
      <Text style={{ color: "#fff", fontWeight: "700" }}>{listening ? "Listening…" : "Hold to Speak"}</Text>
    </Pressable>
  );
}
