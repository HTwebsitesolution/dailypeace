import React, { useCallback, useEffect, useState } from "react";
import { View } from "react-native";
import * as Splash from "expo-splash-screen";
import { Asset } from "expo-asset";
import AnimatedSplash from "./components/AnimatedSplash";
import AsyncStorage from "@react-native-async-storage/async-storage";

import HomeScreen from "./screens/HomeScreen";
import OnboardingModal from "./components/OnboardingModal";

Splash.preventAutoHideAsync().catch(() => {});

export default function SplashGate() {
  const [isReady, setIsReady] = useState(false);
  const [animatedDone, setAnimatedDone] = useState(false);
  const [showOnboarding, setShowOnboarding] = useState(false);

  const prepare = useCallback(async () => {
    // Preload logo and hero assets
    await Asset.loadAsync([
      require("../assets/branding/icons/icon-ios.png"),
      require("../assets/images/hero-ocean.png"),
    ]);
    const ob = await AsyncStorage.getItem("@dp/onboarding_done");
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
      {!animatedDone && <AnimatedSplash onFinish={() => setAnimatedDone(true)} />}

      {animatedDone && (
        <>
          <HomeScreen />
          <OnboardingModal visible={showOnboarding} onDone={() => setShowOnboarding(false)} />
        </>
      )}
    </View>
  );
}

