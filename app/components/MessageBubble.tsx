
import React, { useEffect, useRef } from "react";
import { View, Text, Animated } from "react-native";
import ReadAloud from "./ReadAloud";

export function MessageBubble({ role, children }:{ role:"user"|"app"; children: React.ReactNode }) {
  const isUser = role==="user";
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(isUser ? 20 : -20)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 400,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  return (
    <Animated.View
      style={{
        flexDirection: "row",
        marginVertical: 3,
        paddingHorizontal: 6,
        justifyContent: isUser ? "flex-end" : "flex-start",
        opacity: fadeAnim,
        transform: [{ translateX: slideAnim }],
      }}
    >
      <View style={{
        maxWidth: "85%",
        borderRadius: 18,
        paddingHorizontal: 12,
        paddingVertical: 12,
        backgroundColor: isUser ? "#3B82F6" : "#141B23"
      }}>
        <Text style={{ color: "#FFFFFF", fontSize: 16, lineHeight: 24 }}>{children}</Text>
        {!isUser && typeof children === 'string' && (
          <ReadAloud text={children} autoCandidate />
        )}
      </View>
    </Animated.View>
  );
}
