
import React, { useEffect } from "react";
import { SafeAreaView, StatusBar } from "react-native";
import * as Sentry from "sentry-expo";
import Constants from "expo-constants";
import RootNav from "./navigation";
import { SettingsProvider } from "../lib/settings";
import { analytics } from "../lib/analytics";
import { notifications } from "../lib/notifications";

// Only initialize Sentry if we have a real DSN (not a placeholder)
const sentryDsn = Constants.expoConfig?.extra?.SENTRY_DSN;
if (sentryDsn && !sentryDsn.startsWith('REPLACE_WITH_')) {
  Sentry.init({
    dsn: sentryDsn,
    enableInExpoDevelopment: true,
    debug: false
  });
}

export default function App() {
  useEffect(() => { 
    analytics();
    notifications.initialize();
  }, []);
  return (
    <SettingsProvider>
      <SafeAreaView style={{ flex:1, backgroundColor:"#0B1016" }}>
        <StatusBar barStyle="light-content" />
        <RootNav />
      </SafeAreaView>
    </SettingsProvider>
  );
}
