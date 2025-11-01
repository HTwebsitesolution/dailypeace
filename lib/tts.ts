// lib/tts.ts
import { Platform } from "react-native";
import * as Speech from "expo-speech";
import { Audio } from "expo-av";
import AsyncStorage from "@react-native-async-storage/async-storage";

export type TTSState = {
  speaking: boolean;
  auto: boolean;
  rate: number;   // 0.5 - 1.5 typical
  pitch: number;  // 0.8 - 1.2 typical
  voice?: string; // voice identifier (platform-specific)
};

const DEFAULTS: TTSState = {
  speaking: false,
  auto: false,
  rate: 0.98,
  pitch: 1.0,
  voice: undefined,
};

const KEY = {
  AUTO: "@dp/tts_auto",
  RATE: "@dp/tts_rate",
  PITCH: "@dp/tts_pitch",
  VOICE: "@dp/tts_voice",
};

let _state: TTSState = { ...DEFAULTS };
let _listeners: Array<(s: TTSState) => void> = [];

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
  const [auto, rate, pitch, voice] = await Promise.all([
    AsyncStorage.getItem(KEY.AUTO),
    AsyncStorage.getItem(KEY.RATE),
    AsyncStorage.getItem(KEY.PITCH),
    AsyncStorage.getItem(KEY.VOICE),
  ]);
  _state.auto = auto === "1";
  if (rate) _state.rate = Math.max(0.5, Math.min(1.5, parseFloat(rate)));
  if (pitch) _state.pitch = Math.max(0.5, Math.min(1.5, parseFloat(pitch)));
  if (voice) _state.voice = voice;
  notify();
}

export async function setAuto(on: boolean) {
  _state.auto = on;
  await AsyncStorage.setItem(KEY.AUTO, on ? "1" : "0");
  notify();
}

export async function setRate(rate: number) {
  _state.rate = Math.max(0.5, Math.min(1.5, rate));
  await AsyncStorage.setItem(KEY.RATE, String(_state.rate));
  notify();
}

export async function setPitch(pitch: number) {
  _state.pitch = Math.max(0.5, Math.min(1.5, pitch));
  await AsyncStorage.setItem(KEY.PITCH, String(_state.pitch));
  notify();
}

export async function setVoice(voiceId?: string) {
  _state.voice = voiceId;
  if (voiceId) await AsyncStorage.setItem(KEY.VOICE, voiceId);
  else await AsyncStorage.removeItem(KEY.VOICE);
  notify();
}

export async function getVoices(): Promise<Array<{ id: string; name: string }>> {
  try {
    if (Platform.OS === "web") {
      const synth = (globalThis as any).speechSynthesis;
      if (!synth) return [];
      const list = synth.getVoices() || [];
      return list.map((v: any) => ({ id: v.name, name: v.name }));
    } else {
      const voices = await Speech.getAvailableVoicesAsync();
      return (voices || []).map((v) => ({ id: v.identifier ?? v.name ?? "", name: v.name ?? v.identifier ?? "" }));
    }
  } catch {
    return [];
  }
}

let _stopHook: (() => void) | null = null;

export async function speak(text: string, lang = "en-US") {
  if (!text?.trim()) return;
  stop(); // ensure no overlap
  _state.speaking = true; notify();

  if (Platform.OS === "web" && !(Speech as any).speak) {
    const synth = (globalThis as any).speechSynthesis;
    if (!synth) { _state.speaking = false; notify(); return; }
    const utter = new SpeechSynthesisUtterance(text);
    utter.lang = lang;
    utter.rate = _state.rate;
    utter.pitch = _state.pitch;
    if (_state.voice) {
      const v = synth.getVoices().find((x: any) => x.name === _state.voice);
      if (v) utter.voice = v;
    }
    utter.onend = () => { _state.speaking = false; notify(); };
    utter.onerror = () => { _state.speaking = false; notify(); };
    synth.speak(utter);
    _stopHook = () => { try { synth.cancel(); } catch {} };
    return;
  }

  // expo-speech path (native & web with polyfill)
  Speech.speak(text, {
    language: lang,
    rate: _state.rate,
    pitch: _state.pitch,
    voice: _state.voice,
    onDone: () => { _state.speaking = false; notify(); },
    onStopped: () => { _state.speaking = false; notify(); },
    onError: () => { _state.speaking = false; notify(); },
  });
  _stopHook = () => { try { Speech.stop(); } catch {} };
}

export function stop() {
  if (_stopHook) { _stopHook(); _stopHook = null; }
  _state.speaking = false; notify();
}

export function getState(): TTSState { return { ..._state }; }

