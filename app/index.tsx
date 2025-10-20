
import React from "react";
import { SafeAreaView, StatusBar } from "react-native";
import ChatScreen from "./screens/ChatScreen";

export default function App() {
  return (
    <SafeAreaView style={{ flex:1, backgroundColor:"#0B1016" }}>
      <StatusBar barStyle="light-content" />
      <ChatScreen />
    </SafeAreaView>
  );
}
