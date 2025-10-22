
import React, { useRef, useState, useEffect } from "react";
import { Pressable, Text, Animated } from "react-native";
import { Audio } from "expo-av";
import * as FileSystem from "expo-file-system";
import { apiTranscribe } from "../../lib/api";
import { useSettings } from "../../lib/settings";
import { track } from "../../lib/analytics";

export function MicButton({ onTranscribed }: { onTranscribed: (text: string)=>void }) {
  const recordingRef = useRef<Audio.Recording | null>(null);
  const [listening, setListening] = useState(false);
  const pulseAnim = useRef(new Animated.Value(1)).current;
  const { settings } = useSettings();

  useEffect(() => {
    if (listening) {
      // Start pulsing animation when listening
      Animated.loop(
        Animated.sequence([
          Animated.timing(pulseAnim, {
            toValue: 1.1,
            duration: 600,
            useNativeDriver: true,
          }),
          Animated.timing(pulseAnim, {
            toValue: 1,
            duration: 600,
            useNativeDriver: true,
          }),
        ])
      ).start();
    } else {
      // Reset animation when not listening
      pulseAnim.setValue(1);
    }
  }, [listening]);

  async function start() {
    track("voice_start");
    await Audio.requestPermissionsAsync();
    await Audio.setAudioModeAsync({ allowsRecordingIOS: true, playsInSilentModeIOS: true });
    const recording = new Audio.Recording();
    await recording.prepareToRecordAsync({
      isMeteringEnabled: true,
      android: {
        extension: '.m4a',
        outputFormat: Audio.AndroidOutputFormat.MPEG_4,
        audioEncoder: Audio.AndroidAudioEncoder.AAC,
        sampleRate: 44100,
        numberOfChannels: 2,
        bitRate: 128000,
      },
      ios: {
        extension: '.m4a',
        outputFormat: Audio.IOSOutputFormat.MPEG4AAC,
        audioQuality: Audio.IOSAudioQuality.MAX,
        sampleRate: 44100,
        numberOfChannels: 2,
        bitRate: 128000,
      },
      web: {
        mimeType: 'audio/webm',
        bitsPerSecond: 128000,
      },
    });
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
    
    try {
      // Debug: Confirm base64 encoding is valid
      const base64 = await FileSystem.readAsStringAsync(uri, { encoding: FileSystem.EncodingType.Base64 });
      if (!base64 || base64.length < 100) {
        console.warn("[MicButton] Invalid base64 recording:", base64?.length || 0, "chars");
        track("voice_transcribe_failed", { reason: "invalid_base64" });
        return;
      }
      
      const text = await apiTranscribe("speech.m4a", base64);
      if (text) {
        onTranscribed(text);
        track("voice_transcribed");
      } else {
        track("voice_transcribe_failed", { reason: "empty_result" });
      }
    } catch (error: any) {
      console.error("[MicButton] Transcription failed:", error.message);
      track("voice_transcribe_failed", { reason: error.message?.substring(0, 50) || "unknown" });
    } finally {
      // Delete recording unless user opted to store them
      if (!settings.storeVoiceRecordings) {
        try { 
          await FileSystem.deleteAsync(uri, { idempotent: true }); 
        } catch {}
      }
    }
  }

  return (
    <Animated.View style={{ transform: [{ scale: pulseAnim }] }}>
      <Pressable
        onPressIn={start}
        onPressOut={stop}
        className={`px-3 py-3 rounded-2xl transition-all duration-200 ${
          listening ? "bg-danger active:bg-danger/80" : "bg-primary active:bg-primary/80"
        }`}
        android_ripple={{ color: "#ffffff30" }}
      >
        <Text className="text-white font-bold">
          {listening ? "🎤 Listening…" : "🎤 Hold to Speak"}
        </Text>
      </Pressable>
    </Animated.View>
  );
}
