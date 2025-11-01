import React, { useEffect, useRef, useState } from "react";
import { Platform, Pressable, Text, View } from "react-native";
import { Audio } from "expo-av";
import { subscribe, getState, setAuto, TTSState, initAudioMode, stop as globalStop, setSpeaking } from "../../lib/tts";
import { hapticPress } from "../../lib/haptics";

const TTS_ENDPOINT = "/.netlify/functions/tts";

// Simple sentence chunker to keep below server limit
function chunkText(t: string, max = 1200) {
  const sents = t.split(/(?<=[\.\!\?])\s+/);
  const chunks: string[] = [];
  let cur = "";
  for (const s of sents) {
    if ((cur + " " + s).trim().length > max) {
      if (cur) chunks.push(cur.trim());
      cur = s;
    } else {
      cur = (cur ? cur + " " : "") + s;
    }
  }
  if (cur.trim()) chunks.push(cur.trim());
  return chunks.length ? chunks : [t.slice(0, max)];
}

export default function ReadAloud({ text, lang = "en-US", autoCandidate = false }:{
  text: string;
  lang?: string;
  /** If true, will auto-speak when user pref auto==true and text changes */
  autoCandidate?: boolean;
}) {
  const [loading, setLoading] = useState(false);
  const [playing, setPlaying] = useState(false);
  const [s, setS] = useState<TTSState>(getState());

  const soundRef = useRef<Audio.Sound | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const queueRef = useRef<string[]>([]);
  const indexRef = useRef(0);

  useEffect(() => {
    initAudioMode();
    return subscribe(setS);
  }, []);

  useEffect(() => {
    if (autoCandidate && s.auto && text?.trim()) playAll();
    return () => stopAll();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [text, s.auto, s.voice, lang]);

  useEffect(() => () => stopAll(), []);

  async function stopAll() {
    try {
      if (Platform.OS === "web" && audioRef.current) {
        audioRef.current.pause();
        audioRef.current.src = "";
        audioRef.current = null;
      }
      if (soundRef.current) {
        await soundRef.current.unloadAsync();
        soundRef.current = null;
      }
    } catch {}
    setPlaying(false);
    setSpeaking(false);
  }

  async function fetchAudioBlob(t: string) {
    const r = await fetch(TTS_ENDPOINT, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ text: t, voice: s.voice }),
    });
    if (!r.ok) {
      const errorText = await r.text();
      console.error("TTS fetch error:", r.status, errorText);
      throw new Error(`tts:${r.status}: ${errorText}`);
    }
    return await r.blob();
  }

  async function playChunkWeb(blob: Blob) {
    const url = URL.createObjectURL(blob);
    const audio = new Audio(url) as any as HTMLAudioElement;
    audioRef.current = audio;
    audio.onended = onEnded;
    await audio.play();
  }

  async function playChunkNative(blob: Blob) {
    const uri = URL.createObjectURL(blob);
    const { sound } = await Audio.Sound.createAsync({ uri } as any);
    soundRef.current = sound;
    sound.setOnPlaybackStatusUpdate((s: any) => {
      if (s.didJustFinish) onEnded();
    });
    await sound.playAsync();
  }

  async function onEnded() {
    indexRef.current += 1;
    if (indexRef.current >= queueRef.current.length) {
      setPlaying(false);
      setSpeaking(false);
      return;
    }
    const next = queueRef.current[indexRef.current];
    const blob = await fetchAudioBlob(next);
    if (Platform.OS === "web") await playChunkWeb(blob);
    else await playChunkNative(blob);
  }

  async function playAll() {
    if (!text?.trim()) return;
    await stopAll();
    setLoading(true);
    setSpeaking(true);
    try {
      queueRef.current = chunkText(text);
      indexRef.current = 0;
      const blob = await fetchAudioBlob(queueRef.current[0]);
      if (Platform.OS === "web") {
        await playChunkWeb(blob);
      } else {
        await playChunkNative(blob);
      }
      setPlaying(true);
    } catch (e) {
      console.error("TTS playback error:", e);
      setSpeaking(false);
      setPlaying(false);
    } finally {
      setLoading(false);
    }
  }

  async function toggle() {
    hapticPress();
    if (playing) {
      await stopAll();
    } else {
      await playAll();
    }
  }

  const toggleAuto = () => {
    hapticPress();
    setAuto(!s.auto);
  };

  return (
    <View style={{ flexDirection: "row", alignItems: "center", gap: 32, marginTop: 8 }}>
      <Pressable 
        onPress={toggle}
        disabled={loading}
        style={{
          paddingHorizontal: 12,
          paddingVertical: 8,
          borderRadius: 12,
          borderWidth: 1,
          borderColor: "rgba(255,255,255,0.1)",
          backgroundColor: "rgba(255,255,255,0.1)"
        }}
        accessibilityLabel={playing ? "Pause reading" : "Read to me"}
        accessibilityRole="button"
      >
        <Text style={{ color: "#FFFFFF" }}>
          {loading ? "Loading…" : playing ? "Pause" : "Read to me"}
        </Text>
      </Pressable>
      <Pressable
        onPress={toggleAuto}
        style={{
          paddingHorizontal: 12,
          paddingVertical: 8,
          borderRadius: 12,
          borderWidth: 1,
          borderColor: s.auto ? "rgba(59,130,246,0.5)" : "rgba(255,255,255,0.1)",
          backgroundColor: s.auto ? "rgba(59,130,246,0.3)" : "rgba(255,255,255,0.1)"
        }}
        accessibilityLabel={s.auto ? "Auto-read on" : "Auto-read off"}
        accessibilityRole="button"
      >
        <Text style={{ color: "#FFFFFF" }}>{s.auto ? "Auto-read: On" : "Auto-read: Off"}</Text>
      </Pressable>
    </View>
  );
}

