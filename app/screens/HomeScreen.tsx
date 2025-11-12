import React, { useState, useEffect, useRef } from "react";
import {
  View,
  Pressable,
  Animated,
  ScrollView,
  Image,
  StyleSheet,
  useWindowDimensions,
  Platform,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";
import ReflectionCard from "../components/ReflectionCard";
import ModeToggle from "../components/ModeToggle";
import AtmosphericBackground from "../components/AtmosphericBackground";
import OnboardingModal from "../components/OnboardingModal";
import FeedbackModal from "../components/FeedbackModal";
import FeedbackButton from "../components/FeedbackButton";
import PremiumCTA from "../components/PremiumCTA";
import { Text } from "@/ux/ScaledText";
import { t } from "@/ux/transform";

const logoImage = require("../../assets/Bible Circle Daily Peace Logo.png");

export default function HomeScreen() {
  const navigation = useNavigation<any>();
  const { width } = useWindowDimensions();
  const isMobile = width < 768;
  const isDesktop = width >= 1024;

  const [mode, setMode] = useState<"conversational" | "biblical" | "reflective">("conversational");
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [showFeedback, setShowFeedback] = useState(false);

  const fadeAnim = useRef(new Animated.Value(0)).current;
  const translateYAnim = useRef(new Animated.Value(-20)).current;
  const haloPulse = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 900,
        useNativeDriver: true,
      }),
      Animated.timing(translateYAnim, {
        toValue: 0,
        duration: 900,
        useNativeDriver: true,
      }),
    ]).start();
  }, [fadeAnim, translateYAnim]);

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(haloPulse, {
          toValue: 1.08,
          duration: 1400,
          useNativeDriver: true,
        }),
        Animated.timing(haloPulse, {
          toValue: 1,
          duration: 1400,
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, [haloPulse]);

  useEffect(() => {
    (async () => {
      try {
        const introSeen = await AsyncStorage.getItem("@dp/intro_seen");
        const onboardingDone = await AsyncStorage.getItem("@dp/onboarding_done");
        setShowOnboarding(introSeen === "1" && onboardingDone !== "1");
      } catch {
        setShowOnboarding(false);
      }
    })();
  }, []);

  return (
    <AtmosphericBackground
      mode={mode}
      rotationInterval={40000}
      enableTimeRotation
      enableModeRotation
    >
      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <OnboardingModal visible={showOnboarding} onDone={() => setShowOnboarding(false)} />

        <View style={styles.content}>
          <Animated.View
            style={[
              styles.headerWrap,
              {
                opacity: fadeAnim,
                transform: t.translateYAnimated(translateYAnim),
              },
            ]}
          >
            <View style={styles.titleRow}>
              <View style={styles.logoWrap}>
                <Animated.View style={[styles.logoBackground, { transform: t.scaleAnimated(haloPulse) }]}>
                  <Image source={logoImage} style={styles.logoBadge} resizeMode="cover" />
                </Animated.View>
              </View>
            </View>

            <Text baseSize={isDesktop ? 20 : 16} style={styles.subtitle}>
              find strength, peace and hope from scripture
            </Text>
          </Animated.View>

          <Animated.View style={[styles.quickLinksRow, { opacity: fadeAnim }]}>
            <Pressable
              onPress={() => navigation.navigate("Collections")}
              style={styles.quickLinkPressable}
              accessibilityRole="button"
              accessibilityLabel="View collections"
            >
              <LinearGradient
                colors={["rgba(59,130,246,0.35)", "rgba(59,130,246,0.12)"]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.quickLinkCard}
              >
                <View style={styles.quickLinkIconWrap}>
                  <Ionicons name="albums" size={22} color="#E3EEFF" />
                </View>
                <View style={{ flex: 1 }}>
                  <Text baseSize={18} style={styles.quickLinkTitle} numberOfLines={1}>
                    Collections
                  </Text>
                  <Text baseSize={13} style={styles.quickLinkMeta} numberOfLines={1}>
                    Guided topics for every season
                  </Text>
                </View>
              </LinearGradient>
            </Pressable>

            <Pressable
              onPress={() => navigation.navigate("Favorites")}
              style={styles.quickLinkPressable}
              accessibilityRole="button"
              accessibilityLabel="View favorites"
            >
              <LinearGradient
                colors={["rgba(255,255,255,0.18)", "rgba(255,255,255,0.05)"]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.quickLinkCard}
              >
                <View style={styles.quickLinkIconWrapAlt}>
                  <Ionicons name="heart" size={22} color="#FFCDD2" />
                </View>
                <View style={{ flex: 1 }}>
                  <Text baseSize={18} style={styles.quickLinkTitle} numberOfLines={1}>
                    Favorites
                  </Text>
                  <Text baseSize={13} style={styles.quickLinkMeta} numberOfLines={1}>
                    Scriptures you’ve saved with love
                  </Text>
                </View>
              </LinearGradient>
            </Pressable>
          </Animated.View>

          <Animated.View
            style={[
              styles.reflectionWrap,
              {
                opacity: fadeAnim,
                transform: t.translateYAnimated(
                  fadeAnim.interpolate({
                    inputRange: [0, 1],
                    outputRange: [18, 0],
                  })
                ),
              },
            ]}
          >
            <ReflectionCard
              title="A Moment of Peace"
              message="Peace I leave with you; my peace I give you. I do not give to you as the world gives. Do not let your hearts be troubled and do not be afraid."
              verses={["John 14:27"]}
            />
          </Animated.View>

          <Animated.View style={{ opacity: fadeAnim, width: "100%", marginTop: 22 }}>
            <PremiumCTA onPress={() => navigation.navigate("Chat")} />
          </Animated.View>
        </View>

        <View style={styles.footer}>
          <Text baseSize={18} style={styles.footerTitle}>
            Daily Peace
          </Text>
          <View style={{ position: "absolute", right: 0, top: 0 }}>
            <Pressable
              onPress={() => setShowFeedback(true)}
              style={{
                backgroundColor: "#3B82F6",
                width: 48,
                height: 48,
                borderRadius: 24,
                alignItems: "center",
                justifyContent: "center",
                shadowColor: "#000",
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.25,
                shadowRadius: 4,
                elevation: 4,
              }}
              android_ripple={{ color: "rgba(255, 255, 255, 0.3)" }}
            >
              <Text style={{ fontSize: 24 }}>💬</Text>
            </Pressable>
          </View>
          <Text baseSize={14} style={styles.footerSubtitle}>
            Find peace and hope from Scripture
          </Text>
          <Text baseSize={12} style={styles.footerMeta}>
            © 2025 Daily Peace. Bringing Scripture into your daily life.
          </Text>
        </View>
      </ScrollView>
      <FeedbackModal visible={showFeedback} onClose={() => setShowFeedback(false)} />
    </AtmosphericBackground>
  );
}

const styles = StyleSheet.create({
  scrollContent: {
    paddingTop: 56,
    paddingBottom: 48,
    paddingHorizontal: 20,
    alignItems: "center",
    gap: 28,
  },
  content: {
    width: "100%",
    maxWidth: 860,
    alignItems: "center",
    gap: 22,
  },
  headerWrap: {
    width: "100%",
    gap: 14,
  },
  titleRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    width: "100%",
    gap: 12,
  },
  logoWrap: {
    alignItems: "center",
    justifyContent: "center",
  },
  logoBackground: {
    width: 96,
    height: 96,
    borderRadius: 48,
    backgroundColor: "#FFFFFF",
    alignItems: "center",
    justifyContent: "center",
  },
  logoBadge: {
    width: 76,
    height: 76,
    borderRadius: 38,
    borderWidth: 2,
    borderColor: "rgba(255,255,255,0.18)",
  },
  subtitle: {
    opacity: 0.85,
    maxWidth: 420,
    textAlign: "center",
    alignSelf: "center",
  },
  modeWrap: {
    alignSelf: "center",
  },
  quickLinksRow: {
    width: "100%",
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 16,
    justifyContent: "center",
  },
  quickLinkPressable: {
    borderRadius: 22,
    overflow: "hidden",
    minWidth: 260,
    maxWidth: 340,
  },
  quickLinkCard: {
    flexDirection: "row",
    alignItems: "center",
    gap: 14,
    paddingVertical: 16,
    paddingHorizontal: 16,
    borderRadius: 22,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.18)",
  },
  quickLinkIconWrap: {
    width: 46,
    height: 46,
    borderRadius: 16,
    backgroundColor: "rgba(59,130,246,0.25)",
    justifyContent: "center",
    alignItems: "center",
  },
  quickLinkIconWrapAlt: {
    width: 46,
    height: 46,
    borderRadius: 16,
    backgroundColor: "rgba(255,255,255,0.18)",
    justifyContent: "center",
    alignItems: "center",
  },
  quickLinkTitle: {
    fontWeight: "700",
    color: "#EAF2FF",
  },
  quickLinkMeta: {
    opacity: 0.7,
    color: "#C7D7FF",
    marginTop: 2,
  },
  reflectionWrap: {
    width: "100%",
  },
  footer: {
    marginTop: 16,
    alignItems: "center",
    gap: 8,
    borderTopWidth: 1,
    borderColor: "rgba(255,255,255,0.08)",
    paddingTop: 24,
    width: "100%",
  },
  footerTitle: {
    fontWeight: "700",
  },
  footerSubtitle: {
    opacity: 0.75,
  },
  footerMeta: {
    opacity: 0.45,
  },
});
