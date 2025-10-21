import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { createContext, useContext, useEffect, useMemo, useState } from "react";
import type { Mode } from "./types";

type Settings = {
  defaultMode: Mode;
  ttsEnabled: boolean;
  storeVoiceRecordings: boolean; // false = delete recordings immediately after transcription
};

const DEFAULTS: Settings = {
  defaultMode: "conversational",
  ttsEnabled: false,
  storeVoiceRecordings: false
};

const KEY = "@dailypeace/settings/v1";

const Ctx = createContext<{
  settings: Settings;
  setSetting: <K extends keyof Settings>(k: K, v: Settings[K]) => void;
  hydrateDone: boolean;
}>({ settings: DEFAULTS, setSetting: () => {}, hydrateDone: false });

export function SettingsProvider({ children }: { children: React.ReactNode }) {
  const [settings, setSettings] = useState<Settings>(DEFAULTS);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        const raw = await AsyncStorage.getItem(KEY);
        if (raw) setSettings(JSON.parse(raw));
      } finally {
        setHydrated(true);
      }
    })();
  }, []);

  const setSetting = <K extends keyof Settings>(k: K, v: Settings[K]) => {
    const next = { ...settings, [k]: v };
    setSettings(next);
    AsyncStorage.setItem(KEY, JSON.stringify(next)).catch(() => {});
  };

  const value = useMemo(() => ({ settings, setSetting, hydrateDone: hydrated }), [settings, hydrated]);
  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useSettings() { return useContext(Ctx); }