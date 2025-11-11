import React, { useEffect, useState, useCallback } from "react";
import { View, Pressable, StyleSheet, Share } from "react-native";
import { useNavigation } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import AtmosphericBackground from "../components/AtmosphericBackground";
import OnboardingModal from "../components/OnboardingModal";
import FeedbackButton from "../components/FeedbackButton";
import FeedbackModal from "../components/FeedbackModal";
import Screen from "../components/Screen";
import { Text } from "@/ux/ScaledText";
import ReflectionCard from "../components/ReflectionCard";
import HeroBackground from "../components/HeroBackground";
import HeroBadge from "../components/HeroBadge";
import GlassPill from "../components/GlassPill";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";

const HERO_KEY = "@dp/show_home_reflection";

export default function HomeScreen() {
  const navigation = useNavigation<any>();
  const [mode, setMode] = useState<"conversational" | "biblical" | "reflective">("conversational");
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [showFeedback, setShowFeedback] = useState(false);
  const [showHeroReflection, setShowHeroReflection] = useState(true);

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

  useEffect(() => {
    AsyncStorage.getItem(HERO_KEY)
      .then((value) => {
        setShowHeroReflection(value !== "0");
      })
      .catch(() => {
        setShowHeroReflection(true);
      });
  }, []);

  const dismissHeroReflection = useCallback(() => {
    setShowHeroReflection(false);
    AsyncStorage.setItem(HERO_KEY, "0").catch(() => {});
  }, []);

  const handleStartChat = useCallback(() => {
    dismissHeroReflection();
    navigation.navigate("Chat");
  }, [dismissHeroReflection, navigation]);

  const handleHeroShare = useCallback(async () => {
    const payload = "Peace I leave with you; my peace I give you. I do not give to you as the world gives. Do not let your hearts be troubled and do not be afraid.\n\nJohn 14:27\n\n— Shared from Daily Peace";
    try {
      await Share.share({ message: payload });
    } catch {}
  }, []);

  return (
    <AtmosphericBackground
      mode={mode}
      rotationInterval={40000}
      enableTimeRotation
      enableModeRotation
    >
      <View style={{ flex: 1 }}>
        <HeroBackground />
        <Screen padTop={24} contentStyle={{ paddingHorizontal: 16 }}>
          <OnboardingModal
            visible={showOnboarding}
            onDone={() => setShowOnboarding(false)}
          />

          <HeroBadge />
          <View style={{ height: 24 }} />

          {showHeroReflection && (
            <ReflectionCard
              title="A Moment of Peace"
              message="Peace I leave with you; my peace I give you. I do not give to you as the world gives. Do not let your hearts be troubled and do not be afraid."
              verses={["John 14:27"]}
              onShare={handleHeroShare}
              onClose={dismissHeroReflection}
            />
          )}

          <View style={styles.header}>
            <Text baseSize={16} style={styles.subtitle}>
              find strength, peace and hope from scripture
            </Text>
          </View>

          <View style={styles.rowWrap}>
            <Pressable
              onPress={() => navigation.navigate("Collections")}
              style={styles.quickLinkPressable}
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
                  <Text
                    baseSize={17}
                    style={styles.quickLinkTitle}
                    numberOfLines={1}
                    adjustsFontSizeToFit
                    minimumFontScale={0.9}
                  >
                    Collections
                  </Text>
                </View>
              </LinearGradient>
            </Pressable>
            <Pressable
              onPress={() => navigation.navigate("Favorites")}
              style={styles.quickLinkPressable}
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
                  <Text
                    baseSize={17}
                    style={styles.quickLinkTitle}
                    numberOfLines={1}
                    adjustsFontSizeToFit
                    minimumFontScale={0.9}
                  >
                    Favorites
                  </Text>
                </View>
              </LinearGradient>
            </Pressable>
          </View>

          <View style={[styles.modeRow, { marginTop: 20 }]}>
            <GlassPill
              label="Friendly Chat"
              active={mode === "conversational"}
              onPress={() => setMode("conversational")}
              style={{ minWidth: 140, alignItems: "center" }}
            />
            <GlassPill
              label="Scripture Wisdom"
              active={mode === "biblical"}
              onPress={() => setMode("biblical")}
              style={{ minWidth: 140, alignItems: "center" }}
            />
            <GlassPill
              label="Quiet Reflection"
              active={mode === "reflective"}
              onPress={() => setMode("reflective")}
              style={{ minWidth: 140, alignItems: "center" }}
            />
          </View>

          <View style={styles.card}>
            <Text baseSize={14} style={styles.cardKicker}>
              A Moment of Peace
            </Text>
            <Text baseSize={18} style={styles.cardText}>
              Peace I leave with you; my peace I give you. I do not give to you as the world gives. Do not let your hearts be troubled and do not be afraid.
            </Text>
            <View style={[styles.rowWrap, { marginTop: 12 }]} />
          </View>

          <View style={styles.ctaContainer}>
            <Pressable onPress={handleStartChat} style={styles.ctaButton}>
              <Text baseSize={20} style={styles.ctaText}>
                Start a Conversation 🙏
              </Text>
            </Pressable>
          </View>

          <FeedbackButton onPress={() => setShowFeedback(true)} />
          <FeedbackModal visible={showFeedback} onClose={() => setShowFeedback(false)} />
        </Screen>
      </View>
    </AtmosphericBackground>
  );
}

const styles = StyleSheet.create({
  header: {
    alignItems: "center",
    gap: 8,
    marginBottom: 16,
  },
  title: {
    fontWeight: "800",
    textAlign: "center",
  },
  subtitle: {
    textAlign: "center",
    opacity: 0.8,
  },
  rowWrap: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 14,
    justifyContent: "center",
    alignItems: "center",
  },
  quickLinkPressable: {
    borderRadius: 18,
    overflow: "hidden",
  },
  quickLinkCard: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 14,
    minWidth: 160,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.18)",
    gap: 12,
  },
  quickLinkIconWrap: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: "rgba(59,130,246,0.25)",
    justifyContent: "center",
    alignItems: "center",
  },
  quickLinkIconWrapAlt: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: "rgba(255, 255, 255, 0.18)",
    justifyContent: "center",
    alignItems: "center",
  },
  quickLinkTitle: {
    color: "#EAF2FF",
    fontWeight: "700",
  },
  modeRow: {
    flexDirection: "row",
    gap: 10,
    flexWrap: "wrap",
    justifyContent: "center",
    marginBottom: 8,
  },
  card: {
    borderRadius: 18,
    backgroundColor: "rgba(255,255,255,0.04)",
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: "rgba(255,255,255,0.08)",
    padding: 18,
    alignSelf: "stretch",
    marginTop: 20,
  },
  cardKicker: {
    opacity: 0.7,
  },
  cardText: {
    marginTop: 8,
    width: "100%",
    flexShrink: 1,
    textAlign: "left",
  },
  ctaContainer: {
    alignItems: "center",
    marginTop: 24,
  },
  ctaButton: {
    backgroundColor: "#3B82F6",
    paddingHorizontal: 26,
    paddingVertical: 14,
    borderRadius: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  ctaText: {
    color: "#FFFFFF",
    fontWeight: "700",
    textAlign: "center",
  },
});
