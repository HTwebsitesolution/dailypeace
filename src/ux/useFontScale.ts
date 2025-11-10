import { useEffect, useMemo, useState } from "react";
import { PixelRatio } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

const KEY = "dp.fontScale"; // app multiplier, e.g. 0.9, 1.0, 1.15, 1.3

export function useFontScale() {
  const [appMult, setAppMult] = useState<number>(1);

  // System Dynamic Type factor (1.0 = default; bigger when user increases text size)
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

  // final factor = system * app multiplier
  const factor = useMemo(() => system * appMult, [system, appMult]);

  // helper to scale a base size (e.g. 16 -> 16 * factor)
  const fs = (base: number) => Math.round(base * factor);

  return { factor, fs, appMult, setMultiplier, system };
}





