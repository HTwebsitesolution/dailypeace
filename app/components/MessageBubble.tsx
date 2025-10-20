
import React from "react";
import { View, Text, StyleSheet } from "react-native";

export function MessageBubble({ role, children }:{ role:"user"|"app"; children: React.ReactNode }) {
  const isUser = role==="user";
  return (
    <View style={[styles.row, { justifyContent: isUser ? "flex-end" : "flex-start" }]}>
      <View style={[styles.bubble, { backgroundColor: isUser ? "#2F80ED" : "#141B23" }]}>
        <Text style={{ color:"#EAF2FF" }}>{children}</Text>
      </View>
    </View>
  );
}
const styles = StyleSheet.create({
  row:{ flexDirection:"row", marginVertical:6, paddingHorizontal:10 },
  bubble:{ maxWidth:"85%", borderRadius:14, padding:12 }
});
