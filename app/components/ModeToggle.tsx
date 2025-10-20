
import React from "react";
import { View, Pressable, Text, StyleSheet } from "react-native";
import type { Mode } from "@/lib/types";

export function ModeToggle({ mode, onChange }: { mode: Mode; onChange: (m: Mode)=>void }) {
  const modes: Mode[] = ["conversational","biblical","reflective"];
  return (
    <View style={styles.row}>
      {modes.map(m => (
        <Pressable key={m} onPress={()=>onChange(m)} style={[styles.btn, mode===m && styles.active]}>
          <Text style={styles.txt}>{m[0].toUpperCase()+m.slice(1)}</Text>
        </Pressable>
      ))}
    </View>
  );
}
const styles = StyleSheet.create({
  row:{ flexDirection:"row", gap:8, marginVertical:8, paddingHorizontal:10 },
  btn:{ paddingVertical:8, paddingHorizontal:12, borderRadius:16, backgroundColor:"#141B23" },
  active:{ backgroundColor:"#2F80ED" },
  txt:{ color:"#EAF2FF", fontWeight:"600" }
});
