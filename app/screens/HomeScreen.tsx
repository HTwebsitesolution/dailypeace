import React, { useState } from "react";
import { ImageBackground, View, Text, Pressable } from "react-native";
import { useNavigation } from "@react-navigation/native";
import ReflectionCard from "../components/ReflectionCard";
import ModeToggle from "../components/ModeToggle";

const backgrounds = {
  conversational: require("../../assets/images/hero-ocean.png"),
  biblical: require("../../assets/images/hero-mountain.png"),
  reflective: require("../../assets/images/hero-ocean.png"),
};

export default function HomeScreen() {
  const navigation = useNavigation<any>();
  const [mode, setMode] = useState<"conversational" | "biblical" | "reflective">("conversational");

  return (
    <ImageBackground
      source={backgrounds[mode]}
      resizeMode="cover"
      style={{ flex: 1, backgroundColor: "#0B1016" }}
    >
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center", padding: 20, backgroundColor: "rgba(0,0,0,0.3)" }}>
        <Text style={{ fontSize: 36, fontWeight: "bold", color: "#FFFFFF", marginBottom: 8 }}>Daily Peace</Text>
        <Text style={{ fontSize: 16, color: "#9FB0C3", marginBottom: 24 }}>
          Find peace and hope from scripture ✨
        </Text>

        <ModeToggle value={mode} onChange={setMode} />

        <View style={{ marginTop: 32, width: "100%", maxWidth: 400 }}>
          <ReflectionCard
            title="A Moment of Peace"
            message="Peace I leave with you; my peace I give you. I do not give to you as the world gives. Do not let your hearts be troubled and do not be afraid."
            verses={["John 14:27"]}
          />
        </View>

        <Pressable
          style={{
            marginTop: 24,
            paddingHorizontal: 20,
            paddingVertical: 12,
            backgroundColor: "#3B82F6",
            borderRadius: 16,
            shadowColor: "#000",
            shadowOffset: { width: 0, height: 4 },
            shadowOpacity: 0.3,
            shadowRadius: 8,
            elevation: 5
          }}
          onPress={() => navigation.navigate("Chat")}
        >
          <Text style={{ color: "#FFFFFF", fontSize: 18, fontWeight: "600" }}>Start a Conversation 🙏</Text>
        </Pressable>
      </View>
    </ImageBackground>
  );
}