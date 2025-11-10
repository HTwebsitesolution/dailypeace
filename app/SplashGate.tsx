import React, { useCallback, useEffect, useState } from "react";
import { View } from "react-native";
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
    try {
      // Preload logo and hero assets with error handling
      try {
        await Asset.loadAsync([
          require("../assets/Bible Circle Daily Peace Logo.png"),
          require("../assets/images/hero-ocean.png"),
        ]);
      } catch (assetError) {
        console.error("Failed to load some assets, continuing anyway:", assetError);
        // Continue even if assets fail to load
      }

      try {
        const intro = await AsyncStorage.getItem("@dp/intro_seen");
        setShowIntro(intro !== "1");
      } catch (storageError) {
        console.error("Failed to read intro status:", storageError);
        // Default to showing intro if we can't read storage
        setShowIntro(true);
      }

      setIsReady(true);
      
      try {
        await Splash.hideAsync();
      } catch (splashError) {
        console.error("Failed to hide splash:", splashError);
        // Continue anyway
      }
    } catch (error) {
      console.error("Error in prepare:", error);
      // Still set ready so app can continue
      setIsReady(true);
      try {
        await Splash.hideAsync();
      } catch {}
    }
  }, []);

  useEffect(() => {
    prepare();
  }, [prepare]);

  if (!isReady) return <View style={{ flex: 1, backgroundColor: "#0B1016" }} />;

  return (
    <View style={{ flex: 1, backgroundColor: "#0B1016" }}>
      {!splashDone && <SplashOverlay onDone={() => setSplashDone(true)} />}

      {splashDone && showIntro ? (
        <IntroScreen onProceed={() => setShowIntro(false)} />
      ) : (
        <RootNav />
      )}
    </View>
  );
}

