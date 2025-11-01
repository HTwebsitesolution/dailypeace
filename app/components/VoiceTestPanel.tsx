import React, { useState, useEffect } from "react";
import { View, Text, Pressable, ActivityIndicator, Platform, Animated } from "react-native";
import { Audio } from "expo-av";

const TTS_ENDPOINT = "/.netlify/functions/tts";

export default function VoiceTestPanel({ voice = "alloy" }: { voice?: string }) {
  const [loading, setLoading] = useState(false);
  const [playing, setPlaying] = useState(false);
  const animValues = Array.from({ length: 12 }, () => new Animated.Value(0.25));

  // Animate the waveform shimmer
  useEffect(() => {
    if (!playing) {
      animValues.forEach(anim => anim.setValue(0.25));
      return;
    }
    const animations = animValues.map((anim, i) => {
      return Animated.loop(
        Animated.sequence([
          Animated.delay(i * 50),
          Animated.timing(anim, {
            toValue: 1,
            duration: 600,
            useNativeDriver: true,
          }),
          Animated.timing(anim, {
            toValue: 0.25,
            duration: 600,
            useNativeDriver: true,
          }),
        ])
      );
    });
    animations.forEach(a => a.start());
    return () => animations.forEach(a => a.stop());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [playing]);

  async function playTest() {
    const sample = "This is Daily Peace. May your day be filled with calm.";
    setLoading(true);
    setPlaying(false);

    try {
      const res = await fetch(TTS_ENDPOINT, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: sample, voice }),
      });
      if (!res.ok) throw new Error("TTS error");

      const blob = await res.blob();
      const uri = URL.createObjectURL(blob);

      if (Platform.OS === "web") {
        const audio = new Audio(uri) as any as HTMLAudioElement;
        audio.onended = () => setPlaying(false);
        await audio.play();
        setPlaying(true);
      } else {
        const { sound } = await Audio.Sound.createAsync({ uri } as any);
        sound.setOnPlaybackStatusUpdate((s: any) => {
          if (s.didJustFinish) setPlaying(false);
        });
        await sound.playAsync();
        setPlaying(true);
      }
    } catch (err) {
      console.error("Voice test failed:", err);
    } finally {
      setLoading(false);
    }
  }

  return (
    <View style={{ marginTop: 24, padding: 20, borderRadius: 24, backgroundColor: "rgba(255,255,255,0.05)", borderWidth: 1, borderColor: "rgba(255,255,255,0.1)" }}>
      <Text style={{ color: "#FFFFFF", fontWeight: "600", fontSize: 18, marginBottom: 4 }}>Voice Test</Text>
      <Text style={{ color: "#9FB0C3", marginBottom: 20, fontSize: 14 }}>
        Hear a preview of the current voice:{" "}
        <Text style={{ color: "#FFFFFF", fontWeight: "500" }}>{voice}</Text>
      </Text>

      {/* Waveform shimmer */}
      <View style={{ height: 32, flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 3, marginBottom: 20 }}>
        {animValues.map((anim, i) => (
          <Animated.View
            key={i}
            style={{
              width: 4,
              backgroundColor: "#4E9EFF",
              borderRadius: 2,
              opacity: anim,
              transform: [{
                scaleY: anim.interpolate({
                  inputRange: [0.25, 1],
                  outputRange: [0.5, 1.2]
                })
              }]
            }}
          />
        ))}
      </View>

      {/* Play button */}
      <Pressable
        onPress={playTest}
        disabled={loading}
        style={{
          width: "100%",
          paddingVertical: 12,
          borderRadius: 999,
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: playing ? "#4F46E5" : "rgba(59,130,246,0.8)",
          shadowColor: "#4F46E5",
          shadowOffset: { width: 0, height: 4 },
          shadowOpacity: playing ? 0.5 : 0.4,
          shadowRadius: 12
        }}
      >
        {loading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={{ color: "#FFFFFF", fontWeight: "600", fontSize: 16 }}>
            {playing ? "Playing..." : "Play Sample"}
          </Text>
        )}
      </Pressable>

      {playing && (
        <Text style={{ color: "#9FB0C3", fontSize: 12, textAlign: "center", marginTop: 12 }}>
          Playing voice sample — tap again to replay
        </Text>
      )}
    </View>
  );
}

