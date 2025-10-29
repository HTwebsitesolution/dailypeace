import React, { useState, useEffect, useRef } from "react";
import { View, Text, Pressable, Animated, ScrollView, Image, useWindowDimensions } from "react-native";
import { useNavigation } from "@react-navigation/native";
import ReflectionCard from "../components/ReflectionCard";
import ModeToggle from "../components/ModeToggle";
import AtmosphericBackground from "../components/AtmosphericBackground";

const logoImage = require("../../assets/DailyPeace App Logo.png");

export default function HomeScreen() {
  const navigation = useNavigation<any>();
  const { width } = useWindowDimensions();
  const isMobile = width < 768;
  const isDesktop = width >= 1024;
  const showDesktopLogo = width >= 768; // Show decorative logo on tablet/desktop
  
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
      <ScrollView 
        style={{ flex: 1 }} 
        contentContainerStyle={{ alignItems: "center", paddingTop: 60, paddingBottom: 40, paddingHorizontal: 20 }}
        showsVerticalScrollIndicator={false}
      >
        {/* Decorative logo - behind content, z-index 0, hidden on mobile */}
        {width >= 768 && (
          <View style={{
            position: 'absolute',
            top: 100,
            left: '50%',
            marginLeft: -280, // Half of width for larger size
            zIndex: 0,
            opacity: 0.28,
          }}>
            <Image
              source={logoImage}
              resizeMode="contain"
              style={{ width: 560, height: 560 }}
            />
          </View>
        )}

        {/* Content layer */}
        <View style={{ zIndex: 10, width: '100%', alignItems: 'center' }}>
          {/* Mobile: Small logo badge + title in header row */}
          {isMobile && (
            <Animated.View
              style={{
                opacity: fadeAnim,
                transform: [{ translateY: translateYAnim }],
                marginBottom: 8,
                flexDirection: 'row',
                alignItems: 'center',
                gap: 12,
              }}
            >
              <Image
                source={logoImage}
                style={{ width: 32, height: 32, borderRadius: 16 }}
                resizeMode="cover"
              />
              <Text style={{ 
                fontSize: 28, 
                fontWeight: "900", 
                color: "#FFFFFF",
                textShadowColor: "rgba(0, 0, 0, 0.6)",
                textShadowOffset: { width: 0, height: 2 },
                textShadowRadius: 4,
                letterSpacing: 0.5
              }}>Daily Peace</Text>
            </Animated.View>
          )}

          {/* Desktop: Large centered title + subtitle */}
          {isDesktop && (
            <>
              <Animated.View
                style={{
                  opacity: fadeAnim,
                  transform: [{ translateY: translateYAnim }],
                  marginBottom: 12,
                  marginTop: 24, // Extra space on desktop
                }}
              >
                <Text style={{ 
                  fontSize: 52, 
                  fontWeight: "900", 
                  color: "#FFFFFF", 
                  marginBottom: 8, 
                  textAlign: "center",
                  textShadowColor: "rgba(0, 0, 0, 0.6)",
                  textShadowOffset: { width: 0, height: 3 },
                  textShadowRadius: 6,
                  letterSpacing: 1
                }}>Daily Peace</Text>
              </Animated.View>
              
              <Animated.View
                style={{
                  opacity: fadeAnim,
                  transform: [{ translateY: translateYAnim }],
                  marginBottom: 20,
                }}
              >
                <Text style={{ 
                  fontSize: 24, 
                  color: "#FFFFFF", 
                  marginBottom: 24, 
                  textAlign: "center", 
                  fontWeight: "600",
                  textShadowColor: "rgba(0, 0, 0, 0.6)",
                  textShadowOffset: { width: 0, height: 2 },
                  textShadowRadius: 4,
                  letterSpacing: 0.3
                }}>Find peace and hope from scripture ✨</Text>
              </Animated.View>
            </>
          )}

          <Animated.View
            style={{
              opacity: fadeAnim,
              transform: [{ scale: fadeAnim }],
              marginBottom: 20,
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
            <View style={{ 
              marginTop: isMobile ? 12 : 24,
              width: "100%", 
              maxWidth: 820, // Increased for better desktop layout
              zIndex: 10 
            }}>
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
              <Text style={{ 
                color: "#FFFFFF", 
                fontSize: 22, 
                fontWeight: "800",
                textShadowColor: "rgba(0, 0, 0, 0.4)",
                textShadowOffset: { width: 0, height: 2 },
                textShadowRadius: 4,
                letterSpacing: 0.5
              }}>Start a Conversation 🙏</Text>
            </Pressable>
          </Animated.View>
        </View>
        
        {/* Premium Footer */}
        <View style={{ 
          marginTop: 60,
          paddingVertical: 32,
          paddingHorizontal: 20,
          alignItems: 'center',
          borderTopWidth: 1,
          borderTopColor: 'rgba(255,255,255,0.1)',
          width: '100%',
          zIndex: 10
        }}>
          <View style={{ alignItems: 'center', marginBottom: 16 }}>
            <Image
              source={logoImage}
              style={{ width: 48, height: 48, borderRadius: 24, marginBottom: 12 }}
              resizeMode="cover"
            />
            <Text style={{ 
              color: '#EAF2FF', 
              fontSize: 20,
              fontWeight: '700',
              textAlign: 'center',
              marginBottom: 8
            }}>
              Daily Peace
            </Text>
            <Text style={{ 
              color: '#9FB0C3', 
              fontSize: 14,
              textAlign: 'center',
              marginBottom: 20
            }}>
              Find peace and hope from Scripture
            </Text>
          </View>
          
          <Text style={{ 
            color: '#6B7280', 
            fontSize: 12,
            textAlign: 'center'
          }}>
            © 2024 Daily Peace. Bringing Scripture into your daily life.
          </Text>
        </View>
      </ScrollView>
    </AtmosphericBackground>
  );
}
