// lib/tts.ts
import { Platform } from "react-native";
import { Audio } from "expo-av";
import AsyncStorage from "@react-native-async-storage/async-storage";

export type TTSState = {
  speaking: boolean;
  auto: boolean;
  voice: string; // OpenAI voice identifier
};

const DEFAULTS: TTSState = {
  speaking: false,
  auto: false,
  voice: "alloy",
};

const KEY = {
  AUTO: "@dp/tts_auto",
  VOICE: "@dp/tts_voice",
};

const OPENAI_VOICES = [
  { id: "alloy", name: "Alloy" },
  { id: "echo", name: "Echo" },
  { id: "fable", name: "Fable" },
  { id: "onyx", name: "Onyx" },
  { id: "nova", name: "Nova" },
  { id: "shimmer", name: "Shimmer" },
];

let _state: TTSState = { ...DEFAULTS };
let _listeners: Array<(s: TTSState) => void> = [];
let _currentSound: Audio.Sound | null = null;

function notify() { _listeners.forEach((fn) => fn({ ..._state })); }

export function subscribe(fn: (s: TTSState) => void) {
  _listeners.push(fn);
  fn({ ..._state });
  return () => { _listeners = _listeners.filter((f) => f !== fn); };
}

export async function initAudioMode() {
  // Ensure playback in iOS silent mode and respectful ducking on Android
  try {
    await Audio.setAudioModeAsync({
      playsInSilentModeIOS: true,
      allowsRecordingIOS: false,
      staysActiveInBackground: false,
      interruptionModeIOS: Audio.INTERRUPTION_MODE_IOS_DO_NOT_MIX,
      shouldDuckAndroid: true,
      interruptionModeAndroid: Audio.INTERRUPTION_MODE_ANDROID_DO_NOT_MIX,
      playThroughEarpieceAndroid: false,
    });
  } catch {}
}

export async function loadPrefs() {
  const [auto, voice] = await Promise.all([
    AsyncStorage.getItem(KEY.AUTO),
    AsyncStorage.getItem(KEY.VOICE),
  ]);
  _state.auto = auto === "1";
  if (voice) _state.voice = voice;
  notify();
}

export async function setAuto(on: boolean) {
  _state.auto = on;
  await AsyncStorage.setItem(KEY.AUTO, on ? "1" : "0");
  notify();
}

export async function setVoice(voiceId: string) {
  _state.voice = voiceId;
  await AsyncStorage.setItem(KEY.VOICE, voiceId);
  notify();
}

export async function getVoices(): Promise<Array<{ id: string; name: string }>> {
  return OPENAI_VOICES;
}

export async function speak(text: string, lang = "en-US") {
  if (!text?.trim()) return;
  await stop(); // ensure no overlap
  
  _state.speaking = true; 
  notify();

  try {
    // Fetch audio from OpenAI TTS endpoint
    const { sound } = await Audio.Sound.createAsync(
      { uri: await fetchTTSAudio(text) },
      { shouldPlay: true }
    );
    
    _currentSound = sound;
    
    sound.setOnPlaybackStatusUpdate((status) => {
      if (status.isLoaded && status.didJustFinish) {
        _state.speaking = false;
        notify();
        sound.unloadAsync().catch(() => {});
      }
    });
  } catch (error) {
    console.error("TTS playback error:", error);
    _state.speaking = false;
    notify();
  }
}

async function fetchTTSAudio(text: string): Promise<string> {
  const response = await fetch("/.netlify/functions/tts", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ text, voice: _state.voice }),
  });
  
  if (!response.ok) throw new Error(`TTS API: ${response.status}`);
  
  // For web, read as blob and create data URL
  if (Platform.OS === 'web') {
    const blob = await response.blob();
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result as string);
      reader.onerror = reject;
      reader.readAsDataURL(blob);
    });
  }
  
  // For native, return the URL directly (expo-av can handle URLs)
  return response.url;
}

export async function stop() {
  if (_currentSound) {
    try {
      await _currentSound.stopAsync();
      await _currentSound.unloadAsync();
    } catch {}
    _currentSound = null;
  }
  _state.speaking = false;
  notify();
}

export function getState(): TTSState { return { ..._state }; }

