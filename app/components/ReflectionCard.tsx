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
        duration: 1200,
        useNativeDriver: true,
      }),
      Animated.timing(scaleAnim, {
        toValue: 1,
        duration: 1200,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  return (
    <Animated.View
      style={{
        marginHorizontal: 12,
        marginTop: 12,
        borderRadius: 24,
        backgroundColor: "#0F172A", // Very dark blue-gray for maximum contrast
        shadowColor: "#000000",
        shadowOffset: { width: 0, height: 20 },
        shadowOpacity: 0.7,
        shadowRadius: 16,
        elevation: 12,
        opacity: fadeAnim,
        transform: [{ scale: scaleAnim }],
        borderWidth: 1,
        borderColor: "rgba(255,255,255,0.08)", // Subtle border for premium feel
      }}
    >
      {/* Inner overlay for absolute text protection */}
      <View style={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        borderRadius: 24,
        backgroundColor: 'rgba(0, 0, 0, 0.35)', // Stronger darkening layer for text protection
      }} />
      {/* Header */}
      <View style={{
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        paddingHorizontal: 20,
        paddingVertical: 16,
        borderTopLeftRadius: 24,
        borderTopRightRadius: 24,
        backgroundColor: "rgba(59, 130, 246, 0.95)", // More solid, vibrant blue
        borderBottomWidth: 1,
        borderBottomColor: "rgba(255,255,255,0.1)"
      }}>
        <Text style={{ 
          color: "#FFFFFF", 
          fontWeight: "800", 
          fontSize: 20, 
          letterSpacing: 0.5,
          textShadowColor: "rgba(0, 0, 0, 0.5)",
          textShadowOffset: { width: 0, height: 2 },
          textShadowRadius: 4
        }}>A Moment of Peace 🙏</Text>
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
      <View style={{ paddingHorizontal: 20, paddingVertical: 20, zIndex: 1 }}>
        <Text style={{ 
          color: "#FFFFFF", 
          fontSize: 22, 
          lineHeight: 34,
          fontWeight: "600",
          textShadowColor: "rgba(0, 0, 0, 0.9)",
          textShadowOffset: { width: 0, height: 3 },
          textShadowRadius: 6,
          letterSpacing: 0.4
        }}>{message}</Text>

        {/* Verses */}
        <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 8, marginTop: 16 }}>
          {verses.map((v, index) => (
            <Animated.View
              key={v}
              style={{
                opacity: fadeAnim,
                transform: [{ scale: scaleAnim }],
              }}
            >
              <View style={{
                backgroundColor: "rgba(165, 180, 252, 0.20)", // More visible
                paddingHorizontal: 14,
                paddingVertical: 8,
                borderRadius: 12,
                borderWidth: 1.5,
                borderColor: "rgba(165, 180, 252, 0.5)"
              }}>
                <Text style={{ 
                  color: "#FFFFFF", 
                  fontSize: 16, 
                  fontWeight: "900",
                  textShadowColor: "rgba(0, 0, 0, 0.7)",
                  textShadowOffset: { width: 0, height: 2 },
                  textShadowRadius: 4
                }}>{v}</Text>
              </View>
            </Animated.View>
          ))}
        </View>

        {/* Actions */}
        <View style={{ flexDirection: "row", gap: 32, marginTop: 16 }}>
          {onShare ? (
            <Animated.View
              style={{
                opacity: fadeAnim,
                transform: [{ translateX: fadeAnim.interpolate({
                  inputRange: [0, 1],
                  outputRange: [-20, 0]
                })}],
              }}
            >
              <Pressable
                onPress={onShare}
                style={{
                  backgroundColor: "#3B82F6",
                  paddingHorizontal: 16,
                  paddingVertical: 12,
                  borderRadius: 16,
                  shadowColor: "#3B82F6",
                  shadowOffset: { width: 0, height: 4 },
                  shadowOpacity: 0.4,
                  shadowRadius: 8,
                  elevation: 6,
                }}
                android_ripple={{ color: "#ffffff40" }}
              >
                <Text style={{ color: "#FFFFFF", fontWeight: "700", fontSize: 16 }}>Share this blessing 🔗</Text>
              </Pressable>
            </Animated.View>
          ) : null}
        </View>
      </View>
    </Animated.View>
  );
}