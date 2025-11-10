
import React, { useEffect, useState } from "react";
import { SafeAreaView, StatusBar, Platform } from "react-native";
import Constants from "expo-constants";
import SplashGate from "./SplashGate";
import { SettingsProvider } from "../lib/settings";
import { analytics } from "../lib/analytics";
import { notifications } from "../lib/notifications";
import { initAudioMode, loadPrefs } from "../lib/tts";
import { AppErrorBoundary } from "./components/ErrorBoundary";
import FallbackScreen from "./components/FallbackScreen";

// Import premium CSS for web only
if (Platform.OS === 'web') {
  try {
    // @ts-ignore
    require("./theme-premium.css");
  } catch (error) {
    console.error("Failed to load CSS theme:", error);
    // Continue without CSS if it fails to load
  }
}

// Global error handler component - catches JS errors and promise rejections
function GlobalErrorHandler({ children }: { children: React.ReactNode }) {
  const [err, setErr] = useState<Error | null>(null);
  
  useEffect(() => {
    const handler = (e: Error) => setErr(e);
    const rej = (e: any) => setErr(new Error(String(e)));
    
    // @ts-ignore
    if (typeof ErrorUtils !== 'undefined' && ErrorUtils.setGlobalHandler) {
      ErrorUtils.setGlobalHandler(handler as any);
    }
    
    const up = (ev: PromiseRejectionEvent) => rej(ev.reason);
    // @ts-ignore
    if (typeof window !== 'undefined' && window?.addEventListener) {
      window.addEventListener('unhandledrejection', up);
      return () => window.removeEventListener('unhandledrejection', up);
    }
    
    return () => {};
  }, []);
  
  if (err) {
    return <FallbackScreen message="Something went wrong. Please restart the app." />;
  }
  
  return <>{children}</>;
}

export default function App() {
  useEffect(() => { 
    // Wrap all initialization in try-catch to prevent crashes
    try {
      analytics();
    } catch (error) {
      console.error("Failed to initialize analytics:", error);
    }

    (async () => {
      try {
        await notifications.initialize();
      } catch (error) {
        console.error("Failed to initialize notifications:", error);
      }
    })();

    (async () => {
      try {
        await initAudioMode();
      } catch (error) {
        console.error("Failed to initialize audio mode:", error);
      }
    })();

    (async () => {
      try {
        await loadPrefs();
      } catch (error) {
        console.error("Failed to load preferences:", error);
      }
    })();
  }, []);

  return (
    <GlobalErrorHandler>
      <AppErrorBoundary>
        <SettingsProvider>
          <SafeAreaView style={{ flex:1, backgroundColor:"#0B1016" }}>
            <StatusBar barStyle="light-content" />
            <SplashGate />
          </SafeAreaView>
        </SettingsProvider>
      </AppErrorBoundary>
    </GlobalErrorHandler>
  );
}
