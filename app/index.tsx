
import React, { useEffect } from "react";
import { SafeAreaView, StatusBar, Platform } from "react-native";
import Constants from "expo-constants";
import RootNav from "./navigation";
import { SettingsProvider } from "../lib/settings";
import { analytics } from "../lib/analytics";
import { notifications } from "../lib/notifications";

// Import premium CSS for web only
if (Platform.OS === 'web') {
  // @ts-ignore
  require("./theme-premium.css");
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
