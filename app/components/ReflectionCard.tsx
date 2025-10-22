import React, { useEffect, useRef } from "react";
import { View, Text, Pressable, Animated } from "react-native";

export default function ReflectionCard({
  title = "Today's Reflection",
  message,
  verses,
  onShare,
  onClose,
}: {
  title?: string;
  message: string;
  verses: string[];
  onShare?: () => void;
  onClose?: () => void;
}) {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.95)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 600,
        useNativeDriver: true,
      }),
      Animated.timing(scaleAnim, {
        toValue: 1,
        duration: 400,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  return (
    <Animated.View
      style={{
        marginHorizontal: 12,
        marginTop: 12,
        borderRadius: 20,
        backgroundColor: "#141B23",
        shadowColor: "#000000",
        shadowOffset: { width: 0, height: 16 },
        shadowOpacity: 0.5,
        shadowRadius: 12,
        elevation: 8,
        opacity: fadeAnim,
        transform: [{ scale: scaleAnim }],
      }}
    >
      {/* Header */}
      <View style={{
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        paddingHorizontal: 16,
        paddingVertical: 12,
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        backgroundColor: "rgba(59, 130, 246, 0.9)"
      }}>
        <Text style={{ color: "#FFFFFF", fontWeight: "600" }}>{title} 🙏</Text>
        {onClose ? (
          <Pressable
            onPress={onClose}
            style={{
              paddingHorizontal: 8,
              paddingVertical: 4,
              borderRadius: 12,
              backgroundColor: "rgba(255,255,255,0.15)"
            }}
            android_ripple={{ color: "#ffffff30" }}
          >
            <Text style={{ color: "#FFFFFF" }}>✕</Text>
          </Pressable>
        ) : null}
      </View>

      {/* Body */}
      <View style={{ paddingHorizontal: 16, paddingVertical: 16 }}>
        <Text style={{ color: "#FFFFFF", fontSize: 16, lineHeight: 24 }}>{message}</Text>

        {/* Verses */}
        <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 8, marginTop: 16 }}>
          {verses.map((v) => (
            <View key={v} style={{
              backgroundColor: "rgba(255,255,255,0.1)",
              paddingHorizontal: 8,
              paddingVertical: 4,
              borderRadius: 12
            }}>
              <Text style={{ color: "#A5B4FC", fontSize: 13, fontWeight: "600" }}>{v}</Text>
            </View>
          ))}
        </View>

        {/* Actions */}
        <View style={{ flexDirection: "row", gap: 32, marginTop: 16 }}>
          {onShare ? (
            <Pressable
              onPress={onShare}
              style={{
                backgroundColor: "#3B82F6",
                paddingHorizontal: 12,
                paddingVertical: 8,
                borderRadius: 16
              }}
              android_ripple={{ color: "#ffffff30" }}
            >
              <Text style={{ color: "#FFFFFF", fontWeight: "600" }}>Share 🔗</Text>
            </Pressable>
          ) : null}
        </View>
      </View>
    </Animated.View>
  );
}