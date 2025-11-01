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
  { id: "alloy", name: "Esther", description: "Warm & wise" },
  { id: "echo", name: "Joseph", description: "Calm & steady" },
  { id: "fable", name: "Matthew", description: "Clear & thoughtful" },
  { id: "onyx", name: "Paul", description: "Deep & resonant" },
  { id: "nova", name: "Becky", description: "Bright & encouraging" },
  { id: "shimmer", name: "Anna", description: "Gentle & peaceful" },
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

export async function getVoices(): Promise<Array<{ id: string; name: string; description?: string }>> {
  return OPENAI_VOICES;
}

// Global stop function for external use (e.g., ChatScreen to stop on mic start)
export async function stop() {
  try {
    if (_currentSound) {
      await _currentSound.stopAsync();
      await _currentSound.unloadAsync();
      _currentSound = null;
    }
  } catch {}
  _state.speaking = false;
  notify();
}

// Expose setSpeaking for ReadAloud to update state
export function setSpeaking(speaking: boolean) {
  _state.speaking = speaking;
  notify();
}

export function getState(): TTSState { return { ..._state }; }

