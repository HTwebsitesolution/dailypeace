import React, { useCallback, useEffect, useState } from "react";
import { View, Platform } from "react-native";
import * as Splash from "expo-splash-screen";
import { Asset } from "expo-asset";
import SplashOverlay from "./components/SplashOverlay";
import AsyncStorage from "@react-native-async-storage/async-storage";
import RootNav from "./navigation";
import IntroScreen from "./screens/IntroScreen";

Splash.preventAutoHideAsync().catch(() => {});

export default function SplashGate() {
  const [isReady, setIsReady] = useState(false);
  const [splashDone, setSplashDone] = useState(false);
  const [showIntro, setShowIntro] = useState(false);

  const prepare = useCallback(async () => {
    // Preload logo and hero assets
    await Asset.loadAsync([
      require("../assets/Bible Circle Daily Peace Logo.png"),
      require("../assets/images/hero-ocean.png"),
    ]);
    const intro = await AsyncStorage.getItem("@dp/intro_seen");
    setShowIntro(intro !== "1");
    setIsReady(true);
    await Splash.hideAsync();
  }, []);

  // Add app-loaded class to body when splash is done (web only)
  useEffect(() => {
    if (splashDone && Platform.OS === 'web' && typeof document !== 'undefined') {
      document.body.classList.add('app-loaded');
    }
  }, [splashDone]);

  useEffect(() => {
    prepare();
  }, [prepare]);

  // Show white background initially to match splash screen
  if (!isReady) return <View style={{ flex: 1, backgroundColor: "#FFFFFF" }} />;

  // Keep white background during splash overlay, then switch to dark
  const backgroundColor = splashDone ? "#0B1016" : "#FFFFFF";

  return (
    <View style={{ flex: 1, backgroundColor }}>
      {!splashDone && <SplashOverlay onDone={() => setSplashDone(true)} />}

      {splashDone && showIntro ? (
        <IntroScreen onProceed={() => setShowIntro(false)} />
      ) : (
        <RootNav />
      )}
    </View>
  );
}

