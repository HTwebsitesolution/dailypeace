
import React, { useEffect } from "react";
import { SafeAreaView, StatusBar } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import ChatScreen from "./screens/ChatScreen";
import { analytics } from "@/lib/analytics";
import { notifications } from "@/lib/notifications";

const Stack = createNativeStackNavigator();

export default function App() {
  useEffect(() => {
    // Initialize analytics and notifications
    const initializeApp = async () => {
      try {
        // Initialize push notifications
        await notifications.initialize();
        
        // Schedule daily verse notification
        await notifications.scheduleDailyVerse();
        
        // Track app launch
        analytics.track('app_launched');
        analytics.screen('ChatScreen');
      } catch (error) {
        analytics.captureError(error as Error, { context: 'app_initialization' });
      }
    };

    initializeApp();
  }, []);

  return (
    <NavigationContainer>
      <SafeAreaView style={{ flex:1, backgroundColor:"#0B1016" }}>
        <StatusBar barStyle="light-content" />
        <Stack.Navigator screenOptions={{ headerShown: false }}>
          <Stack.Screen name="Chat" component={ChatScreen} />
        </Stack.Navigator>
      </SafeAreaView>
    </NavigationContainer>
  );
}
