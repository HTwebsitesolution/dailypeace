import { useEffect, useMemo, useState } from "react";
import { PixelRatio } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

const KEY = "dp.fontScale";

export function useFontScale() {
  const [appMult, setAppMult] = useState<number>(1);
  const system = PixelRatio.getFontScale();

  useEffect(() => {
    (async () => {
      const raw = await AsyncStorage.getItem(KEY);
      setAppMult(raw ? Number(raw) : 1);
    })();
  }, []);

  const setMultiplier = async (m: number) => {
    setAppMult(m);
    await AsyncStorage.setItem(KEY, String(m));
  };

  const factor = useMemo(() => system * appMult, [system, appMult]);
  const fs = (base: number) => Math.round(base * factor);

  return { factor, fs, appMult, setMultiplier, system };
}


