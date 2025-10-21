
import React, { useEffect } from "react";
import { SafeAreaView, StatusBar } from "react-native";
import * as Sentry from "sentry-expo";
import Constants from "expo-constants";
import RootNav from "./navigation";
import { SettingsProvider } from "../lib/settings";
import { analytics } from "../lib/analytics";

Sentry.init({
  dsn: Constants.expoConfig?.extra?.SENTRY_DSN,
  enableInExpoDevelopment: true,
  debug: false
});

export default function App() {
  useEffect(() => { analytics(); }, []);
  return (
    <SettingsProvider>
      <SafeAreaView style={{ flex:1, backgroundColor:"#0B1016" }}>
        <StatusBar barStyle="light-content" />
        <RootNav />
      </SafeAreaView>
    </SettingsProvider>
  );
}
