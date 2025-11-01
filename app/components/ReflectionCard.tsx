import React, { useEffect, useRef } from "react";
import { View, Text, Pressable, Animated, ScrollView, Platform, useWindowDimensions } from "react-native";
import { hapticConfirm } from "../../lib/haptics";

export default function ReflectionCard({
  title = "Today's Reflection",
  message,
  verses,
  onShare,
  onClose,
  onVersePress,
}: {
  title?: string;
  message: string;
  verses: string[];
  onShare?: () => void;
  onClose?: () => void;
  onVersePress?: (ref: string) => void;
}) {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.95)).current;
  const { height: screenHeight } = useWindowDimensions();
  const isMobile = Platform.OS === 'web' ? screenHeight < 800 : Platform.OS !== 'web';
  // Max height: 60% of screen on mobile, no limit on desktop
  const maxCardHeight = isMobile ? screenHeight * 0.6 : undefined;

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
        marginHorizontal: 16,
        marginTop: 24,
        borderRadius: 24,
        backgroundColor: "rgba(20,27,35,0.95)", // Glass-pro with high opacity for readability
        borderWidth: 1,
        borderColor: "rgba(255,255,255,0.15)",
        shadowColor: "#000000",
        shadowOffset: { width: 0, height: 16 },
        shadowOpacity: 0.6,
        shadowRadius: 24,
        elevation: 16,
        opacity: fadeAnim,
        transform: [{ scale: scaleAnim }],
        maxHeight: maxCardHeight,
        overflow: 'hidden',
      }}
    >
      {/* Header with glass strip - Fixed at top */}
      <View style={{
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        paddingHorizontal: 16,
        paddingVertical: 12,
        borderTopLeftRadius: 24,
        borderTopRightRadius: 24,
        backgroundColor: "rgba(35,48,63,0.90)", // Elevated header strip
        borderBottomWidth: 1,
        borderBottomColor: "rgba(255,255,255,0.12)"
      }}>
        <Text style={{ 
          color: "#FFFFFF", 
          fontWeight: "700", 
          fontSize: 18, 
          letterSpacing: 0.4
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

      {/* Scrollable Body */}
      <ScrollView
        style={{ maxHeight: maxCardHeight ? maxCardHeight - 60 : undefined }}
        contentContainerStyle={{ paddingHorizontal: 16, paddingVertical: 16, paddingBottom: 48 }}
        showsVerticalScrollIndicator={true}
        nestedScrollEnabled={true}
      >
        <Text style={{ 
          color: "#FFFFFF", 
          fontSize: 18, 
          lineHeight: 28,
          fontWeight: "400",
          letterSpacing: 0.2
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
              <Pressable onPress={() => onVersePress && onVersePress(v)} style={{
                backgroundColor: "rgba(255,255,255,0.12)",
                paddingHorizontal: 8,
                paddingVertical: 4,
                borderRadius: 8,
                borderWidth: 1,
                borderColor: "rgba(255,255,255,0.12)"
              }} android_ripple={{ color: '#ffffff30' }}>
                <Text style={{ 
                  color: "#A5B4FC", 
                  fontSize: 13, 
                  fontWeight: "600"
                }}>{v}</Text>
              </Pressable>
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
                onPress={() => {
                  hapticConfirm();
                  onShare();
                }}
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
                <Text style={{ color: "#FFFFFF", fontWeight: "600", fontSize: 16 }}>Share this blessing 🔗</Text>
              </Pressable>
            </Animated.View>
          ) : null}
        </View>
      </ScrollView>
    </Animated.View>
  );
}