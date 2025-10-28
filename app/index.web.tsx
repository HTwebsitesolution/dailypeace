import React, { useEffect } from "react";
import { SafeAreaView, StatusBar } from "react-native";
import RootNav from "./navigation";
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

export default function App() {
  useEffect(() => { 
    safeAnalytics();
    safeNotifications();
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
