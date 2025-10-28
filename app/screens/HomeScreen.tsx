import React, { useState, useEffect, useRef } from "react";
import { View, Text, Pressable, Animated } from "react-native";
import { useNavigation } from "@react-navigation/native";
import ReflectionCard from "../components/ReflectionCard";
import ModeToggle from "../components/ModeToggle";
import AtmosphericBackground from "../components/AtmosphericBackground";

export default function HomeScreen() {
  const navigation = useNavigation<any>();
  const [mode, setMode] = useState<"conversational" | "biblical" | "reflective">("conversational");
  
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const translateYAnim = useRef(new Animated.Value(-20)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 1000,
        useNativeDriver: true,
      }),
      Animated.timing(translateYAnim, {
        toValue: 0,
        duration: 1000,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  return (
    <AtmosphericBackground 
      mode={mode} 
      rotationInterval={40000}
      enableTimeRotation={true}
      enableModeRotation={true}
    >
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center", padding: 20 }}>
        <Animated.View
          style={{
            opacity: fadeAnim,
            transform: [{ translateY: translateYAnim }],
          }}
        >
          <Text style={{ fontSize: 42, fontWeight: "bold", color: "#FFFFFF", marginBottom: 8, textAlign: "center" }}>Daily Peace</Text>
        </Animated.View>
        
        <Animated.View
          style={{
            opacity: fadeAnim,
            transform: [{ translateY: translateYAnim }],
          }}
        >
          <Text style={{ fontSize: 20, color: "#9FB0C3", marginBottom: 24, textAlign: "center" }}>Find peace and hope from scripture ✨</Text>
        </Animated.View>

        <Animated.View
          style={{
            opacity: fadeAnim,
            transform: [{ scale: fadeAnim }],
          }}
        >
          <ModeToggle value={mode} onChange={setMode} />
        </Animated.View>

        <Animated.View
          style={{
            opacity: fadeAnim,
            transform: [{ translateY: fadeAnim.interpolate({
              inputRange: [0, 1],
              outputRange: [20, 0]
            })}],
          }}
        >
          <View style={{ marginTop: 32, width: "100%", maxWidth: 400 }}>
            <ReflectionCard
              title="A Moment of Peace"
              message="Peace I leave with you; my peace I give you. I do not give to you as the world gives. Do not let your hearts be troubled and do not be afraid."
              verses={["John 14:27"]}
            />
          </View>
        </Animated.View>

        <Animated.View
          style={{
            opacity: fadeAnim,
            transform: [{ translateY: fadeAnim.interpolate({
              inputRange: [0, 1],
              outputRange: [20, 0]
            })}],
          }}
        >
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
            <Text style={{ color: "#FFFFFF", fontSize: 20, fontWeight: "600" }}>Start a Conversation 🙏</Text>
          </Pressable>
        </Animated.View>
      </View>
    </AtmosphericBackground>
  );
}