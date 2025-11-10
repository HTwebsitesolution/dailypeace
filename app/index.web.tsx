import React, { useEffect } from "react";
import { SafeAreaView, StatusBar } from "react-native";
import SplashGate from "./SplashGate";
import { SettingsProvider } from "../lib/settings";

// Import premium CSS for web
// @ts-ignore
require("./theme-premium.css");

// Safe analytics for web
function safeAnalytics() {
  try {
    const { analytics } = require("../lib/analytics");
    analytics();
  } catch (error) {
    console.log("Analytics not available on web");
  }
}

// Safe notifications for web
function safeNotifications() {
  try {
    const { notifications } = require("../lib/notifications");
    notifications.initialize();
  } catch (error) {
    console.log("Notifications not available on web");
  }
}

// Safe TTS initialization for web
function safeTTSInit() {
  try {
    const { initAudioMode, loadPrefs } = require("../lib/tts");
    initAudioMode();
    loadPrefs();
  } catch (error) {
    console.log("TTS not available on web");
  }
}

export default function App() {
  useEffect(() => { 
    safeAnalytics();
    safeNotifications();
    safeTTSInit();
  }, []);
  
  return (
    <SettingsProvider>
      <SafeAreaView style={{ flex:1, backgroundColor:"#0B1016" }}>
        <StatusBar barStyle="light-content" />
        <SplashGate />
      </SafeAreaView>
    </SettingsProvider>
  );
}
