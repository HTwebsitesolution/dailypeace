import React from "react";
import { View, Text, ScrollView, Pressable } from "react-native";
import { useNavigation } from "@react-navigation/native";

export default function DisclaimerScreen() {
  const nav = useNavigation<any>();
  return (
    <View style={{ flex:1, backgroundColor:"#0B1016", paddingTop:56 }}>
      <View style={{ flexDirection:"row", alignItems:"center", paddingHorizontal:16 }}>
        <Pressable onPress={()=>nav.goBack()} style={{ padding:8, borderRadius:8, backgroundColor:"#141B23", marginRight:8 }}>
          <Text style={{ color:"#EAF2FF" }}>Back</Text>
        </Pressable>
        <Text style={{ color:"#EAF2FF", fontWeight:"700", fontSize:18 }}>Disclaimer</Text>
      </View>
      <ScrollView contentContainerStyle={{ padding:16, gap:10 }}>
        <Text style={{ color:"#EAF2FF" }}>
          Daily Peace provides AI-generated reflections inspired by Jesus' recorded words in Scripture.
          It does not impersonate Jesus, make promises beyond Scripture, or replace prayer, Scripture reading, pastoral counsel, or professional care.
        </Text>
        <Text style={{ color:"#9FB0C3" }}>
          Voice recordings are transcribed to text to prepare your reflection. By default recordings are not stored.
          You can change this behavior in Settings.
        </Text>
      </ScrollView>
    </View>
  );
}