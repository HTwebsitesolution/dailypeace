import React from "react";
import { View, Text, Image, Pressable, ScrollView } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function IntroScreen({ onProceed }: { onProceed: () => void }) {
  const proceed = async () => {
    await AsyncStorage.setItem("@dp/intro_seen", "1");
    onProceed();
  };

  return (
    <View style={{ flex: 1, backgroundColor: "#0B1016" }}>
      {/* Background hero (optional): ocean + veil */}
      <Image
        source={require("../../assets/images/hero-ocean.png")}
        resizeMode="cover"
        style={{ position: "absolute", width: "100%", height: "100%", opacity: 0.45 }}
      />
      <View style={{ position: "absolute", inset: 0, backgroundColor: "rgba(0,0,0,0.6)" }} />

      <ScrollView contentContainerStyle={{ flexGrow: 1, alignItems: "center", justifyContent: "center", paddingHorizontal: 20, paddingVertical: 40 }}>
        {/* Logo + wordmark */}
        <Image
          source={require("../../assets/Bible Circle Daily Peace Logo.png")}
          resizeMode="contain"
          style={{ width: 96, height: 96, marginBottom: 16, opacity: 0.92 }}
        />
        <Text style={{ color: "#FFFFFF", fontSize: 36, fontWeight: "900", textAlign: "center" }}>Daily Peace</Text>
        <Text style={{ color: "#9FB0C3", fontSize: 16, textAlign: "center", marginTop: 8 }}>
          A quiet place to breathe, reflect, and pray with verse-anchored guidance.
        </Text>

        {/* Three quick pillars */}
        <View style={{ width: "100%", maxWidth: 780, marginTop: 32, gap: 12 }}>
          <Feature title="Speak your heart" desc="Type or talk—share what you're facing and feel heard." icon="🗣️" />
          <Feature title="Receive a gentle reply" desc="Compassionate, biblically-rooted reflections tailored to your need." icon="🕊️" />
          <Feature title="Carry a verse into your day" desc="Save, favorite, and get a daily reminder at a time you choose." icon="📖" />
        </View>

        {/* CTA */}
        <Pressable onPress={proceed} style={{ marginTop: 40, paddingHorizontal: 24, paddingVertical: 12, borderRadius: 16, backgroundColor: "#3B82F6", shadowColor: "#000", shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.3, shadowRadius: 8, elevation: 5 }}>
          <Text style={{ color: "#FFFFFF", fontWeight: "600", fontSize: 18 }}>Begin</Text>
        </Pressable>

        {/* Secondary link */}
        <Pressable onPress={proceed} style={{ marginTop: 12 }}>
          <Text style={{ color: "#9FB0C3", textDecorationLine: "underline" }}>Skip intro</Text>
        </Pressable>

        {/* Legal tiny */}
        <Text style={{ color: "#9FB0C3", fontSize: 12, marginTop: 24, textAlign: "center", opacity: 0.8 }}>
          AI-assisted spiritual reflections grounded in Scripture. Not a substitute for pastoral care or therapy.
        </Text>
      </ScrollView>
    </View>
  );
}

function Feature({ title, desc, icon }: { title: string; desc: string; icon: string }) {
  return (
    <View style={{ borderRadius: 16, backgroundColor: "rgba(255,255,255,0.07)", borderWidth: 1, borderColor: "rgba(255,255,255,0.1)", padding: 16 }}>
      <Text style={{ color: "#FFFFFF", fontSize: 18, fontWeight: "600" }}>{icon} {title}</Text>
      <Text style={{ color: "#9FB0C3", marginTop: 4 }}>{desc}</Text>
    </View>
  );
}

