import React, { useCallback, useEffect, useState } from "react";
import { View } from "react-native";
import * as Splash from "expo-splash-screen";
import { Asset } from "expo-asset";
import SplashOverlay from "./components/SplashOverlay";
import AsyncStorage from "@react-native-async-storage/async-storage";
import RootNav from "./navigation";
import IntroScreen from "./screens/IntroScreen";
import OnboardingModal from "./components/OnboardingModal";

Splash.preventAutoHideAsync().catch(() => {});

export default function SplashGate() {
  const [isReady, setIsReady] = useState(false);
  const [splashDone, setSplashDone] = useState(false);
  const [showIntro, setShowIntro] = useState(false);
  const [showOnboarding, setShowOnboarding] = useState(false);

  const prepare = useCallback(async () => {
    // Preload logo and hero assets
    await Asset.loadAsync([
      require("../assets/branding/icons/icon-ios.png"),
      require("../assets/images/hero-ocean.png"),
    ]);
    const intro = await AsyncStorage.getItem("@dp/intro_seen");
    const ob = await AsyncStorage.getItem("@dp/onboarding_done");
    setShowIntro(intro !== "1");
    setShowOnboarding(ob !== "1");
    setIsReady(true);
    await Splash.hideAsync();
  }, []);

  useEffect(() => {
    prepare();
  }, [prepare]);

  if (!isReady) return <View style={{ flex: 1, backgroundColor: "#0B1016" }} />;

  return (
    <View style={{ flex: 1, backgroundColor: "#0B1016" }}>
      {!splashDone && <SplashOverlay duration={1200} onDone={() => setSplashDone(true)} />}

      {splashDone && showIntro ? (
        <IntroScreen onProceed={() => setShowIntro(false)} />
      ) : (
        <>
          <RootNav />
          <OnboardingModal visible={showOnboarding} onDone={() => setShowOnboarding(false)} />
        </>
      )}
    </View>
  );
}

