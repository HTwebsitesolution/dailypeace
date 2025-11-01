import React, { useEffect, useState } from "react";
import { View, Pressable, Text } from "react-native";
import { subscribe, getState, speak, stop, setAuto, TTSState, initAudioMode } from "../../lib/tts";
import { hapticPress } from "../../lib/haptics";

export default function ReadAloud({ text, lang = "en-US", autoCandidate = false }:{
  text: string;
  lang?: string;
  /** If true, will auto-speak when user pref auto==true and text changes */
  autoCandidate?: boolean;
}) {
  const [s, setS] = useState<TTSState>(getState());

  useEffect(() => {
    initAudioMode(); // ensure iOS silent-mode playback
    return subscribe(setS);
  }, []);

  useEffect(() => {
    if (autoCandidate && s.auto && text?.trim()) speak(text, lang);
    // stop when component unmounts
    return () => stop();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [text, s.auto, lang]);

  const toggle = () => {
    hapticPress();
    if (s.speaking) stop();
    else speak(text, lang);
  };

  const toggleAuto = () => {
    hapticPress();
    setAuto(!s.auto);
  };

  return (
    <View className="flex-row items-center gap-8">
      <Pressable 
        onPress={toggle} 
        className="px-3 py-2 rounded-xl bg-white/10 border border-white/10"
        accessibilityLabel={s.speaking ? "Pause reading" : "Read to me"}
        accessibilityRole="button"
      >
        <Text style={{ color: "#FFFFFF" }}>{s.speaking ? "Pause" : "Read to me"}</Text>
      </Pressable>
      <Pressable
        onPress={toggleAuto}
        className={`px-3 py-2 rounded-xl border ${s.auto ? "bg-primary/30 border-primary" : "bg-white/10 border-white/10"}`}
        accessibilityLabel={s.auto ? "Auto-read on" : "Auto-read off"}
        accessibilityRole="button"
      >
        <Text style={{ color: "#FFFFFF" }}>{s.auto ? "Auto-read: On" : "Auto-read: Off"}</Text>
      </Pressable>
    </View>
  );
}

