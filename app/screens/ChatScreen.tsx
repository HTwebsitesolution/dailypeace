import React, { useState, useEffect, useRef, useCallback, useMemo } from "react";
import {
  View,
  FlatList,
  KeyboardAvoidingView,
  Platform,
  Alert,
  Animated,
  Pressable,
  Image,
  RefreshControl,
  Share,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Audio } from "expo-av";
import * as FileSystem from "expo-file-system";
import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context";
import { useNavigation, useRoute } from "@react-navigation/native";
import { useWindowDimensions } from "react-native";
import { useSettings } from "../../lib/settings";
import { apiGenerate, apiTranscribe } from "../../lib/api";
import { addFavorite, getFavorites, removeFavorite } from "../../lib/verseFavorites";
import { loadKJVIndex, selectVerses, resolveNeedIds } from "../../lib/verse";
import needsIndex from "../../assets/seeds/index.json";
import { classifyNeeds } from "../../lib/classifier";
import { track } from "../../lib/analytics";
import type { Mode, Verse, GenerateResult } from "../../lib/types";
import ModeToggle from "../components/ModeToggle";
import { MessageBubble } from "../components/MessageBubble";
import ChatInput from "../components/ChatInput";
import ReflectionCard from "../components/ReflectionCard";
import AtmosphericBackground from "../components/AtmosphericBackground";
import { stop as stopTTS } from "../../lib/tts";
import { APP_LINK } from "../../lib/config";
import { Text } from "@/ux/ScaledText";
import BrandedMessageCard from "../components/BrandedMessageCard";
import { t } from "@/ux/transform";
import * as Speech from "expo-speech";

const logo = require("../../assets/Bible Circle Daily Peace Logo.png");
const HERO_KEY = "@dp/show_home_reflection";
const ENABLE_REFLECTION_HISTORY = false;

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
  verses?: Verse[];
  title?: string;
  shareUrl?: string;
  autoRead?: boolean;
}

interface Reflection {
  message: string;
  verses: string[];
  title?: string;
  needIds?: string[];
}

const MODE_FOCUS_DEFAULTS: Record<Mode, string[]> = {
  conversational: ["fear_anxiety", "strength_courage"],
  biblical: ["spiritual_growth", "fear_anxiety"],
  reflective: ["purpose_meaning", "gratitude_praise"],
};

export default function ChatScreen() {
  const nav = useNavigation<any>();
  const route = useRoute<any>();
  const { width } = useWindowDimensions();
  const isMobile = width < 768;
  const { settings } = useSettings();
  const insets = useSafeAreaInsets();

  const [mode, setMode] = useState<Mode>(settings.defaultMode);
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputText, setInputText] = useState("");
  const [recording, setRecording] = useState(false);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [reflection, setReflectionState] = useState<Reflection | null>(null);
  const [showReflection, setShowReflection] = useState(true);
  const [kjvIndex, setKjvIndex] = useState<Record<string, string> | null>(null);
  const [needSeeds, setNeedSeeds] = useState<any>(null);
  const [activeNeedIds, setActiveNeedIds] = useState<string[]>(
    MODE_FOCUS_DEFAULTS[settings.defaultMode] ?? ["fear_anxiety"]
  );
  const [favorites, setFavorites] = useState<{ ref: string; text?: string; addedAt: number }[]>([]);
  const [autoReadEnabled, setAutoReadEnabled] = useState(false);

  const recordingRef = useRef<Audio.Recording | null>(null);
  const speechRecognitionRef = useRef<any>(null);
  const flatListRef = useRef<FlatList>(null);
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const logoAnim = useRef(new Animated.Value(1)).current;

  const humanizeNeedId = useCallback((id: string) => {
    return id
      .replace(/_/g, " ")
      .split(" ")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
  }, []);

  const activeNeedLabels = useMemo(() => {
    return activeNeedIds.map((id) => humanizeNeedId(id)).filter(Boolean);
  }, [activeNeedIds, humanizeNeedId]);

  const persistReflection = useCallback(async (entry: Reflection) => {
    if (!ENABLE_REFLECTION_HISTORY) return;
    try {
      const existingRaw = await AsyncStorage.getItem("@dp/reflection_history");
      const existing: any[] = existingRaw ? JSON.parse(existingRaw) : [];
      const payload = { ...entry, savedAt: Date.now() };
      const updated = [payload, ...existing].slice(0, 50);
      await AsyncStorage.setItem("@dp/reflection_history", JSON.stringify(updated));
    } catch (error) {
      console.warn("Failed to persist reflection history", error);
    }
  }, []);

  const captureReflection = useCallback(
    (entry: Reflection | null) => {
      setReflectionState(entry);
      if (entry) persistReflection(entry);
    },
    [persistReflection]
  );

  useEffect(() => {
    if (messages.some((m) => m.role === "assistant")) {
      setShowReflection(false);
    }
  }, [messages]);

  useEffect(() => {
    loadData();
    loadFavorites();
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 500,
      useNativeDriver: true,
    }).start();
    Animated.timing(logoAnim, {
      toValue: 1,
      duration: 1000,
      delay: 300,
      useNativeDriver: true,
    }).start(() => {
      Animated.loop(
        Animated.sequence([
          Animated.timing(logoAnim, { toValue: 1.05, duration: 2000, useNativeDriver: true }),
          Animated.timing(logoAnim, { toValue: 0.95, duration: 2000, useNativeDriver: true }),
        ]),
        { iterations: -1 }
      ).start();
    });
  }, [fadeAnim, logoAnim]);

  useEffect(() => {
    if (!needSeeds) return;
    const defaults = resolveNeedIds(needSeeds, MODE_FOCUS_DEFAULTS[mode] ?? []);
    setActiveNeedIds(defaults);
  }, [mode, needSeeds]);

  useEffect(() => {
    const seed: string | undefined = route?.params?.seedText;
    if (seed) setInputText(seed);
  }, [route?.params?.seedText]);

  const loadData = async () => {
    try {
      const idx = await loadKJVIndex();
      setKjvIndex(idx);
      setNeedSeeds(needsIndex);
    } catch (error) {
      console.error("Failed to load data:", error);
    }
  };

  const loadFavorites = async () => {
    try {
      const list = await getFavorites();
      setFavorites(list);
    } catch {}
  };

  const requestAudioPermission = useCallback(async () => {
    try {
      await Audio.requestPermissionsAsync();
    } catch (error) {
      console.warn("Audio permissions not granted:", error);
    }
  }, []);

  const addMessage = useCallback(
    (role: Message["role"], content: string, extras?: Partial<Message>) => {
      const trimmed = content.trim();
      setMessages((prev) => {
        if (role === "assistant") {
          const last = prev[prev.length - 1];
          if (last && last.role === "assistant" && last.content.trim() === trimmed) {
            return prev;
          }
        }
        const id = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
        return [
          ...prev,
          {
            id,
            role,
            content,
            timestamp: new Date(),
            verses: extras?.verses,
            title: extras?.title,
            shareUrl: extras?.shareUrl ?? APP_LINK,
            autoRead: extras?.autoRead ?? autoReadEnabled,
          },
        ];
      });
      if (role === "assistant") {
        AsyncStorage.setItem(HERO_KEY, "0").catch(() => {});
      }
      setTimeout(() => {
        flatListRef.current?.scrollToEnd({ animated: true });
      }, 80);
    },
    [autoReadEnabled]
  );

  const handleSend = useCallback(async () => {
    if (!inputText.trim() || loading) return;

    const userMessage = inputText.trim();
    setInputText("");
    addMessage("user", userMessage);
    setShowReflection(false);

    setLoading(true);
    track("message_sent", { mode, length: userMessage.length });

    try {
      let verses: Verse[] = [];
      let resolvedNeeds = activeNeedIds;
      if (kjvIndex && needSeeds) {
        try {
          const classifiedNeeds = classifyNeeds(userMessage, mode);
          resolvedNeeds = resolveNeedIds(needSeeds, classifiedNeeds);
          setActiveNeedIds(resolvedNeeds);
          verses = await selectVerses(mode, needSeeds, kjvIndex, classifiedNeeds);
          console.log(`[Chat] Selected ${verses.length} verses for context`);
        } catch (verseError) {
          console.warn("[Chat] Verse selection failed, continuing without verses:", verseError);
          verses = [];
        }
      } else {
        console.warn("[Chat] kjvIndex or needSeeds not loaded yet");
      }

      const focusDisplay = resolvedNeeds.length ? humanizeNeedId(resolvedNeeds[0]) : "";
      const focusLabel =
        resolvedNeeds.length > 1
          ? resolvedNeeds.map((id) => humanizeNeedId(id)).filter(Boolean).join(" • ")
          : focusDisplay;

      if (mode === "biblical" && verses.length === 0) {
        verses = [
          {
            ref: "John 14:27",
            text: "Peace I leave with you, my peace I give unto you: not as the world giveth, give I unto you. Let not your heart be troubled, neither let it be afraid.",
          },
          {
            ref: "Philippians 4:6-7",
            text: "Be careful for nothing; but in every thing by prayer and supplication with thanksgiving let your requests be made known unto God. And the peace of God, which passeth all understanding, shall keep your hearts and minds through Christ Jesus.",
          },
        ];
      }

      const result = (await Promise.race([
        apiGenerate(userMessage, mode, verses),
        new Promise((_, reject) =>
          setTimeout(() => reject(new Error("Request timeout after 30 seconds")), 30000)
        ),
      ])) as GenerateResult;

      if (mode === "biblical") {
        if (verses.length > 0) {
          const header = focusLabel
            ? `Scripture Wisdom • ${focusLabel}`
            : "Scripture Wisdom — Verses for you:";
          const versesText = verses.map((v: Verse) => `• ${v.ref}\n${v.text}`).join("\n\n");
          const closing = "Which of these speaks to your situation?";
          addMessage("assistant", `${header}\n\n${versesText}\n\n${closing}`, {
            verses,
            title: header,
          });
        } else {
          addMessage(
            "assistant",
            "Let's reflect on Scripture together. What’s on your heart today?",
            { title: "Scripture Wisdom" }
          );
        }
      } else if (result.inspired_message) {
        const response = result.inspired_message;
        addMessage("assistant", response.text, {
          verses: response.citations?.map((ref) => ({ ref, text: "" })) ?? [],
          title: focusDisplay ? `Daily Peace • ${focusDisplay}` : "Daily Peace",
        });
      } else {
        addMessage(
          "assistant",
          "I'm here to listen and share wisdom from Scripture. How are you feeling today?",
          { title: "Daily Peace" }
        );
      }
    } catch (error: any) {
      console.error("Generation error:", error);
      addMessage(
        "assistant",
        "I'm having a little trouble right now. Let's try again in a moment, okay?",
        { title: "Daily Peace" }
      );
    } finally {
      setLoading(false);
    }
  }, [inputText, loading, addMessage, mode, activeNeedIds, kjvIndex, needSeeds, humanizeNeedId]);

  const handleReadAloud = useCallback((text: string) => {
    if (!text) return;
    Speech.speak(text, {
      language: "en-US",
      pitch: 1.0,
      rate: 0.9,
    });
  }, []);

  const toggleAutoRead = useCallback(() => {
    setAutoReadEnabled((prev) => !prev);
  }, []);

  const startRecording = useCallback(async () => {
    try {
      stopTTS();
      setRecording(true);

      const SpeechRecognition =
        (typeof window !== "undefined" && (window as any).webkitSpeechRecognition) ||
        (typeof window !== "undefined" && (window as any).SpeechRecognition);

      if (SpeechRecognition) {
        const recognition = new SpeechRecognition();
        recognition.continuous = true;
        recognition.interimResults = false;
        recognition.lang = "en-US";

        recognition.onresult = (event: any) => {
          const transcript = Array.from(event.results)
            .map((result: any) => result[0].transcript)
            .join("");
          setInputText((prev) => prev + transcript + " ");
        };

        recognition.onerror = (event: any) => {
          console.error("Speech recognition error:", event.error);
          if (event.error !== "no-speech") {
            Alert.alert("Speech Recognition Error", "Could not recognize speech. Please try again.");
          }
          setRecording(false);
        };

        recognition.onend = () => setRecording(false);
        speechRecognitionRef.current = recognition;
        recognition.start();
        return;
      }

      await requestAudioPermission();
      await Audio.setAudioModeAsync({
        allowsRecordingIOS: true,
        playsInSilentModeIOS: true,
        shouldDuckAndroid: true,
        playThroughEarpieceAndroid: false,
      });

      const { recording } = await Audio.Recording.createAsync(
        Audio.RecordingOptionsPresets.HIGH_QUALITY
      );
      recordingRef.current = recording;
    } catch (error) {
      console.error("Recording start error:", error);
      setRecording(false);
      Alert.alert("Recording Error", "Unable to start recording. Please check microphone permissions.");
    }
  }, [requestAudioPermission]);

  const stopRecording = useCallback(async () => {
    if (speechRecognitionRef.current) {
      try {
        speechRecognitionRef.current.stop();
      } catch (error) {
        console.log("Speech recognition stop:", error);
      }
      speechRecognitionRef.current = null;
      setRecording(false);
      return;
    }

    if (!recordingRef.current) return;

    try {
      setRecording(false);
      await recordingRef.current.stopAndUnloadAsync();
      const uri = recordingRef.current.getURI();

      if (uri) {
        const base64 = await FileSystem.readAsStringAsync(uri, {
          encoding: "base64",
        });

        const transcribedText = await apiTranscribe("voice.mp3", base64);
        setInputText(transcribedText);
      }
    } catch (error) {
      console.error("Recording stop error:", error);
      Alert.alert("Transcription Error", "Unable to process voice recording.");
    } finally {
      recordingRef.current = null;
    }
  }, []);

  const shareTextContent = useCallback(async (payload: string) => {
    if (!payload) return;

    try {
      if (typeof navigator !== "undefined" && navigator.share) {
        await navigator.share({ title: "Daily Peace", text: payload });
        return;
      }
    } catch (error) {
      console.log("navigator.share failed", error);
    }

    try {
      await Share.share({ message: payload });
      return;
    } catch (error) {
      console.log("Share.share failed", error);
    }

    try {
      if (typeof navigator !== "undefined" && navigator.clipboard) {
        await navigator.clipboard.writeText(payload);
        Alert.alert("Copied!", "Message copied to clipboard 📋");
        return;
      }
    } catch (error) {
      console.log("Clipboard write failed", error);
    }

    Alert.alert("Share", payload);
  }, []);

  const shareReflection = useCallback(async () => {
    if (!reflection) return;
    const shareText = `${reflection.title ? `${reflection.title}\n\n` : ""}${reflection.message}\n\n${reflection.verses.join(
      "\n"
    )}\n\n— Shared from Daily Peace • ${APP_LINK}`;
    await shareTextContent(shareText.trim());
  }, [reflection, shareTextContent]);

  const closeReflection = useCallback(() => {
    captureReflection(null);
    setShowReflection(false);
    AsyncStorage.setItem(HERO_KEY, "0").catch(() => {});
  }, [captureReflection]);

  const handleClearChat = useCallback(() => {
    setMessages([]);
    setInputText("");
    captureReflection(null);
    setShowReflection(true);
    AsyncStorage.setItem(HERO_KEY, "1").catch(() => {});
  }, [captureReflection]);

  const handleRefresh = useCallback(() => {
    captureReflection(null);
    setMessages([]);
    loadFavorites();
    AsyncStorage.setItem(HERO_KEY, "1").catch(() => {});
  }, [captureReflection]);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    try {
      await handleRefresh();
    } finally {
      setRefreshing(false);
    }
  }, [handleRefresh]);

  const handleBackHome = useCallback(() => {
    try {
      nav.navigate("Home");
    } catch {}
  }, [nav]);

  const handleVersePress = useCallback(
    async (ref: string) => {
      try {
        const verseEntry = messages
          .find((m) => m.role === "assistant" && m.verses?.some((v) => v.ref === ref))
          ?.verses?.find((v) => v.ref === ref);
        const verseText = verseEntry?.text ?? "";
        const buttons: { text: string; onPress: () => void }[] = [];

        buttons.push({
          text: "Copy",
          onPress: async () => {
            try {
              await navigator.clipboard.writeText(`${ref}: ${verseText}`);
            } catch {}
          },
        });

        buttons.push({
          text: "Save",
          onPress: async () => {
            await addFavorite({ ref, text: verseText, addedAt: Date.now() });
            addMessage("assistant", `Saved ${ref} to Favorites ⭐`);
            loadFavorites();
          },
        });

        buttons.push({
          text: "Explain",
          onPress: async () => {
            try {
              const r = await apiGenerate(
                `Explain this verse briefly and clearly for practical understanding: ${ref} — ${verseText}`,
                "conversational",
                [] as any
              );
              if ((r as any).inspired_message?.text) addMessage("assistant", (r as any).inspired_message.text);
            } catch {
              addMessage("assistant", "Sorry, I could not explain that right now.");
            }
          },
        });

        buttons.push({
          text: "Apply",
          onPress: async () => {
            try {
              const r = await apiGenerate(
                `Give 2–3 concrete ways to apply: ${ref} — ${verseText}`,
                "conversational",
                [] as any
              );
              if ((r as any).inspired_message?.text) addMessage("assistant", (r as any).inspired_message.text);
            } catch {
              addMessage("assistant", "Sorry, I could not suggest applications right now.");
            }
          },
        });

        buttons.push({
          text: "Pray",
          onPress: async () => {
            try {
              const r = await apiGenerate(
                `Write a 40-60 word prayer to God inspired by: ${ref} — ${verseText}`,
                "conversational",
                [] as any
              );
              if ((r as any).inspired_message?.text) addMessage("assistant", (r as any).inspired_message.text);
            } catch {
              addMessage("assistant", "Sorry, I could not generate a prayer right now.");
            }
          },
        });

        buttons.push({ text: "Close", onPress: () => {} });
        Alert.alert(ref, "Choose an action", buttons);
      } catch {}
    },
    [messages, addMessage, loadFavorites]
  );

  const dismissMessage = useCallback((id: string) => {
    setMessages((prev) => prev.filter((m) => m.id !== id));
  }, []);

  return (
    <AtmosphericBackground
      mode={mode}
      rotationInterval={50000}
      enableTimeRotation
      enableModeRotation
    >
      <SafeAreaView style={{ flex: 1 }} edges={["top", "left", "right"]}>
        <Animated.View style={{ flex: 1, opacity: fadeAnim }}>
          <View style={{ flex: 1, paddingHorizontal: width < 768 ? 16 : 60, position: "relative" }}>
            {Platform.OS !== "web" ? (
              <KeyboardAvoidingView
                style={{ flex: 1 }}
                behavior={Platform.OS === "ios" ? "padding" : "height"}
                keyboardVerticalOffset={Platform.OS === "ios" ? insets.top + 72 : 0}
              >
                <View
                  style={{
                    paddingTop: 56,
                    paddingBottom: 16,
                    paddingHorizontal: 20,
                    backgroundColor: "rgba(20,27,35,0.6)",
                    borderBottomWidth: 1,
                    borderBottomColor: "rgba(255,255,255,0.05)",
                    alignItems: "center",
                  }}
                >
                  <View style={{ width: "100%", maxWidth: 400, alignItems: "center" }}>
                    <View style={{ alignItems: "center", marginBottom: 12 }}>
                      <Animated.View
                        style={{
                          opacity: fadeAnim,
                          transform: t.translateYAnimated(
                            fadeAnim.interpolate({
                              inputRange: [0, 1],
                              outputRange: [-20, 0],
                            })
                          ),
                        }}
                      >
                        <Text
                          baseSize={32}
                          style={{
                            fontWeight: "bold",
                            textAlign: "center",
                            textShadowColor: "rgba(0,0,0,0.3)",
                            textShadowOffset: { width: 0, height: 2 },
                            textShadowRadius: 4,
                          }}
                        >
                          Daily Peace
                        </Text>
                      </Animated.View>
                      <Animated.View
                        style={{
                          opacity: fadeAnim,
                          transform: t.translateYAnimated(
                            fadeAnim.interpolate({
                              inputRange: [0, 1],
                              outputRange: [-10, 0],
                            })
                          ),
                        }}
                      >
                        <Text
                          baseSize={18}
                          style={{
                            color: "#9FB0C3",
                            textAlign: "center",
                            marginTop: 6,
                            fontStyle: "italic",
                          }}
                        >
                          find strength, peace and hope from scripture
                        </Text>
                      </Animated.View>
                    </View>
                  </View>
                  {width >= 768 && (
                    <View style={{ position: "absolute", left: 20, top: 56 }}>
                      <Animated.View
                        style={{
                          opacity: 1,
                          transform: t.scaleAnimated(logoAnim),
                          shadowColor: "#EAF2FF",
                          shadowOffset: { width: 0, height: 0 },
                          shadowOpacity: logoAnim.interpolate({
                            inputRange: [0.95, 1.05],
                            outputRange: [0.3, 0.6],
                          }),
                          shadowRadius: 10,
                          elevation: 5,
                        }}
                      >
                        <Image
                          source={logo}
                          style={{ width: 120, height: 120, resizeMode: "contain" }}
                        />
                      </Animated.View>
                    </View>
                  )}
                  <View style={{ alignSelf: "center" }}>
                    <Animated.View
                      style={{
                        opacity: fadeAnim,
                        transform: t.scaleAnimated(fadeAnim),
                      }}
                    >
                      <ModeToggle value={mode} onChange={setMode} />
                    </Animated.View>
                  </View>
                  <Animated.View
                    style={{
                      opacity: fadeAnim,
                      alignItems: "center",
                      paddingHorizontal: 24,
                      marginTop: 4,
                    }}
                  >
                    <Text baseSize={14} style={{ color: "#9FB0C3", textAlign: "center" }}>
                      {activeNeedLabels.length
                        ? `Focus: ${activeNeedLabels.join(" • ")}`
                        : "Listening for what you need most…"}
                    </Text>
                  </Animated.View>
                  <View
                    style={{
                      flexDirection: "row",
                      gap: 8,
                      marginTop: 10,
                      justifyContent: "center",
                    }}
                  >
                    <Pressable
                      onPress={handleClearChat}
                      style={{
                        paddingHorizontal: 10,
                        paddingVertical: 6,
                        borderRadius: 8,
                        backgroundColor: "rgba(239,68,68,0.25)",
                      }}
                      android_ripple={{ color: "#ffffff30" }}
                    >
                      <Text baseSize={14} style={{ color: "#FCA5A5", fontWeight: "600" }}>
                        Clear
                      </Text>
                    </Pressable>
                    <Pressable
                      onPress={handleRefresh}
                      style={{
                        paddingHorizontal: 10,
                        paddingVertical: 6,
                        borderRadius: 8,
                        backgroundColor: "rgba(59,130,246,0.25)",
                      }}
                      android_ripple={{ color: "#ffffff30" }}
                    >
                      <Text baseSize={14} style={{ color: "#93C5FD", fontWeight: "600" }}>
                        Refresh
                      </Text>
                    </Pressable>
                    <Pressable
                      onPress={handleBackHome}
                      style={{
                        paddingHorizontal: 10,
                        paddingVertical: 6,
                        borderRadius: 8,
                        backgroundColor: "rgba(255,255,255,0.12)",
                      }}
                      android_ripple={{ color: "#ffffff30" }}
                    >
                      <Text baseSize={14} style={{ color: "#EAF2FF", fontWeight: "600" }}>
                        Home
                      </Text>
                    </Pressable>
                  </View>
                </View>

                {showReflection && reflection && (
                  <ReflectionCard
                    title={reflection.title}
                    message={reflection.message}
                    verses={reflection.verses}
                    onShare={shareReflection}
                    onClose={closeReflection}
                    onVersePress={handleVersePress}
                  />
                )}

                {mode === "reflective" && favorites.length > 0 && (
                  <View style={{ marginTop: 16, paddingHorizontal: 12 }}>
                    <Text baseSize={16} style={{ fontWeight: "700", marginBottom: 8 }}>
                      Your Favorites
                    </Text>
                    {favorites.map((f) => (
                      <View
                        key={f.ref}
                        style={{
                          backgroundColor: "rgba(255,255,255,0.06)",
                          borderColor: "rgba(255,255,255,0.12)",
                          borderWidth: 1,
                          borderRadius: 12,
                          padding: 12,
                          marginBottom: 8,
                        }}
                      >
                        <Text baseSize={15} style={{ color: "#A5B4FC", fontWeight: "700" }}>
                          {f.ref}
                        </Text>
                        {!!f.text && (
                          <Text baseSize={14} numberOfLines={3} style={{ marginTop: 6, lineHeight: 22 }}>
                            {f.text}
                          </Text>
                        )}
                        <View style={{ flexDirection: "row", gap: 12, marginTop: 10 }}>
                          <Pressable
                            onPress={() =>
                              setInputText((prev) =>
                                prev ? prev + `\n${f.ref}: ` : `${f.ref}: `
                              )
                            }
                            style={{
                              paddingHorizontal: 10,
                              paddingVertical: 6,
                              borderRadius: 8,
                              backgroundColor: "#3B82F6",
                            }}
                          >
                            <Text baseSize={13} style={{ color: "#fff" }}>
                              Insert
                            </Text>
                          </Pressable>
                          <Pressable
                            onPress={async () => {
                              try {
                                await navigator.clipboard.writeText(`${f.ref}: ${f.text ?? ""}`);
                              } catch {}
                            }}
                            style={{
                              paddingHorizontal: 10,
                              paddingVertical: 6,
                              borderRadius: 8,
                              backgroundColor: "rgba(255,255,255,0.12)",
                            }}
                          >
                            <Text baseSize={13} style={{ color: "#EAF2FF" }}>
                              Copy
                            </Text>
                          </Pressable>
                          <Pressable
                            onPress={async () => {
                              await removeFavorite(f.ref);
                              loadFavorites();
                            }}
                            style={{
                              paddingHorizontal: 10,
                              paddingVertical: 6,
                              borderRadius: 8,
                              backgroundColor: "rgba(239,68,68,0.25)",
                            }}
                          >
                            <Text baseSize={13} style={{ color: "#FCA5A5" }}>
                              Remove
                            </Text>
                          </Pressable>
                        </View>
                      </View>
                    ))}
                  </View>
                )}

                <FlatList
                  ref={flatListRef}
                  data={messages}
                  keyExtractor={(item) => item.id}
                  renderItem={({ item }) => {
                    if (item.role === "assistant") {
                      const verses = (item.verses ?? []).map((v: Verse) => ({ ref: v.ref }));
                      return (
                        <View style={{ paddingHorizontal: 16, paddingVertical: 10 }}>
                          <BrandedMessageCard
                            title={item.title ?? "A Moment of Peace 🙏"}
                            body={item.content}
                            verses={verses}
                            onReadAloud={item.content ? () => handleReadAloud(item.content) : undefined}
                            autoReadEnabled={item.autoRead ?? autoReadEnabled}
                            onToggleAutoRead={toggleAutoRead}
                            onShareLink={item.shareUrl ?? APP_LINK}
                            onClose={() => dismissMessage(item.id)}
                            compact={width < 400}
                          />
                        </View>
                      );
                    }
                    return (
                      <MessageBubble role="user">
                        {item.content}
                      </MessageBubble>
                    );
                  }}
                  style={{ flex: 1, paddingHorizontal: 8 }}
                  contentContainerStyle={{
                    paddingVertical: 16,
                    paddingBottom: Platform.OS === "ios" ? 12 : 20,
                    ...(messages.length === 0 ? { flexGrow: 1, justifyContent: "center" } : {}),
                  }}
                  contentInset={{
                    bottom: Platform.OS === "ios" ? insets.bottom + 108 : insets.bottom + 48,
                  }}
                  scrollIndicatorInsets={{
                    bottom: Platform.OS === "ios" ? insets.bottom + 108 : insets.bottom + 48,
                  }}
                  showsVerticalScrollIndicator={false}
                  keyboardShouldPersistTaps="handled"
                  keyboardDismissMode={Platform.OS === "ios" ? "interactive" : "on-drag"}
                  refreshControl={
                    <RefreshControl
                      refreshing={refreshing}
                      onRefresh={onRefresh}
                      tintColor="#9FB0C3"
                      colors={["#9FB0C3"]}
                    />
                  }
                  ListEmptyComponent={
                    <View
                      style={{
                        justifyContent: "center",
                        alignItems: "center",
                        paddingHorizontal: 24,
                        paddingTop: 20,
                      }}
                    >
                      <Text baseSize={16} style={{ color: "#9FB0C3", textAlign: "center" }}>
                        Start a conversation - Tap the microphone to speak your thoughts or type to
                        begin chatting
                      </Text>
                    </View>
                  }
                />

                <View
                  style={{
                    backgroundColor: "rgba(20,27,35,0.6)",
                    borderTopWidth: 1,
                    borderTopColor: "rgba(255,255,255,0.05)",
                    paddingBottom: insets.bottom > 0 ? insets.bottom / 2 : 0,
                  }}
                >
                  <ChatInput
                    value={inputText}
                    onChangeText={setInputText}
                    onSend={handleSend}
                    onVoiceStart={startRecording}
                    onVoiceEnd={stopRecording}
                    recording={recording}
                    disabled={loading}
                    bottomInset={insets.bottom}
                  />
                </View>

                <View style={{ position: "absolute", right: isMobile ? 12 : -40, top: isMobile ? 20 : 56 }}>
                  <Pressable
                    onPress={() => nav.navigate("Settings")}
                    style={{ padding: 8, borderRadius: 8 }}
                    android_ripple={{ color: "rgba(255,255,255,0.1)" }}
                  >
                    <Text baseSize={18} style={{ color: "#9FB0C3" }}>
                      ⚙️
                    </Text>
                  </Pressable>
                </View>
              </KeyboardAvoidingView>
            ) : (
              <View style={{ flex: 1 }}>
                <View
                  style={{
                    paddingTop: 56,
                    paddingBottom: 16,
                    paddingHorizontal: 20,
                    backgroundColor: "rgba(20,27,35,0.6)",
                    borderBottomWidth: 1,
                    borderBottomColor: "rgba(255,255,255,0.05)",
                    alignItems: "center",
                  }}
                >
                  <View style={{ width: "100%", maxWidth: 400, alignItems: "center" }}>
                    <View style={{ alignItems: "center", marginBottom: 12 }}>
                      <Animated.View
                        style={{
                          opacity: fadeAnim,
                          transform: t.translateYAnimated(
                            fadeAnim.interpolate({
                              inputRange: [0, 1],
                              outputRange: [-20, 0],
                            })
                          ),
                        }}
                      >
                        <Text
                          baseSize={32}
                          style={{
                            fontWeight: "bold",
                            textAlign: "center",
                            textShadowColor: "rgba(0,0,0,0.3)",
                            textShadowOffset: { width: 0, height: 2 },
                            textShadowRadius: 4,
                          }}
                        >
                          Daily Peace
                        </Text>
                      </Animated.View>
                      <Animated.View
                        style={{
                          opacity: fadeAnim,
                          transform: t.translateYAnimated(
                            fadeAnim.interpolate({
                              inputRange: [0, 1],
                              outputRange: [-10, 0],
                            })
                          ),
                        }}
                      >
                        <Text
                          baseSize={18}
                          style={{
                            color: "#9FB0C3",
                            textAlign: "center",
                            marginTop: 6,
                            fontStyle: "italic",
                          }}
                        >
                          find strength, peace and hope from scripture
                        </Text>
                      </Animated.View>
                    </View>
                  </View>
                  {width >= 768 && (
                    <View style={{ position: "absolute", left: 20, top: 56 }}>
                      <Animated.View
                        style={{
                          opacity: 1,
                          transform: t.scaleAnimated(logoAnim),
                          shadowColor: "#EAF2FF",
                          shadowOffset: { width: 0, height: 0 },
                          shadowOpacity: logoAnim.interpolate({
                            inputRange: [0.95, 1.05],
                            outputRange: [0.3, 0.6],
                          }),
                          shadowRadius: 10,
                          elevation: 5,
                        }}
                      >
                        <Image
                          source={logo}
                          style={{ width: 120, height: 120, resizeMode: "contain" }}
                        />
                      </Animated.View>
                    </View>
                  )}
                  <View style={{ alignSelf: "center" }}>
                    <Animated.View
                      style={{
                        opacity: fadeAnim,
                        transform: t.scaleAnimated(fadeAnim),
                      }}
                    >
                      <ModeToggle value={mode} onChange={setMode} />
                    </Animated.View>
                  </View>
                  <View
                    style={{
                      flexDirection: "row",
                      gap: 8,
                      marginTop: 10,
                      justifyContent: "center",
                    }}
                  >
                    <Pressable
                      onPress={handleClearChat}
                      style={{
                        paddingHorizontal: 10,
                        paddingVertical: 6,
                        borderRadius: 8,
                        backgroundColor: "rgba(239,68,68,0.25)",
                      }}
                    >
                      <Text baseSize={14} style={{ color: "#FCA5A5", fontWeight: "600" }}>
                        Clear
                      </Text>
                    </Pressable>
                    <Pressable
                      onPress={handleRefresh}
                      style={{
                        paddingHorizontal: 10,
                        paddingVertical: 6,
                        borderRadius: 8,
                        backgroundColor: "rgba(59,130,246,0.25)",
                      }}
                    >
                      <Text baseSize={14} style={{ color: "#93C5FD", fontWeight: "600" }}>
                        Refresh
                      </Text>
                    </Pressable>
                    <Pressable
                      onPress={handleBackHome}
                      style={{
                        paddingHorizontal: 10,
                        paddingVertical: 6,
                        borderRadius: 8,
                        backgroundColor: "rgba(255,255,255,0.12)",
                      }}
                    >
                      <Text baseSize={14} style={{ color: "#EAF2FF", fontWeight: "600" }}>
                        Home
                      </Text>
                    </Pressable>
                  </View>
                </View>

                {showReflection && reflection && (
                  <ReflectionCard
                    title={reflection.title}
                    message={reflection.message}
                    verses={reflection.verses}
                    onShare={shareReflection}
                    onClose={closeReflection}
                    onVersePress={handleVersePress}
                  />
                )}

                {mode === "reflective" && favorites.length > 0 && (
                  <View style={{ marginTop: 16, paddingHorizontal: 12 }}>
                    <Text baseSize={16} style={{ fontWeight: "700", marginBottom: 8 }}>
                      Your Favorites
                    </Text>
                    {favorites.map((f) => (
                      <View
                        key={f.ref}
                        style={{
                          backgroundColor: "rgba(255,255,255,0.06)",
                          borderColor: "rgba(255,255,255,0.12)",
                          borderWidth: 1,
                          borderRadius: 12,
                          padding: 12,
                          marginBottom: 8,
                        }}
                      >
                        <Text baseSize={15} style={{ color: "#A5B4FC", fontWeight: "700" }}>
                          {f.ref}
                        </Text>
                        {!!f.text && (
                          <Text baseSize={14} numberOfLines={3} style={{ marginTop: 6, lineHeight: 22 }}>
                            {f.text}
                          </Text>
                        )}
                        <View style={{ flexDirection: "row", gap: 12, marginTop: 10 }}>
                          <Pressable
                            onPress={() =>
                              setInputText((prev) =>
                                prev ? prev + `\n${f.ref}: ` : `${f.ref}: `
                              )
                            }
                            style={{
                              paddingHorizontal: 10,
                              paddingVertical: 6,
                              borderRadius: 8,
                              backgroundColor: "#3B82F6",
                            }}
                          >
                            <Text baseSize={13} style={{ color: "#fff" }}>
                              Insert
                            </Text>
                          </Pressable>
                          <Pressable
                            onPress={async () => {
                              try {
                                await navigator.clipboard.writeText(`${f.ref}: ${f.text ?? ""}`);
                              } catch {}
                            }}
                            style={{
                              paddingHorizontal: 10,
                              paddingVertical: 6,
                              borderRadius: 8,
                              backgroundColor: "rgba(255,255,255,0.12)",
                            }}
                          >
                            <Text baseSize={13} style={{ color: "#EAF2FF" }}>
                              Copy
                            </Text>
                          </Pressable>
                          <Pressable
                            onPress={async () => {
                              await removeFavorite(f.ref);
                              loadFavorites();
                            }}
                            style={{
                              paddingHorizontal: 10,
                              paddingVertical: 6,
                              borderRadius: 8,
                              backgroundColor: "rgba(239,68,68,0.25)",
                            }}
                          >
                            <Text baseSize={13} style={{ color: "#FCA5A5" }}>
                              Remove
                            </Text>
                          </Pressable>
                        </View>
                      </View>
                    ))}
                  </View>
                )}

                <FlatList
                  ref={flatListRef}
                  data={messages}
                  keyExtractor={(item) => item.id}
                  renderItem={({ item }) => {
                    if (item.role === "assistant") {
                      const verses = (item.verses ?? []).map((v: Verse) => ({ ref: v.ref }));
                      return (
                        <View style={{ paddingHorizontal: 16, paddingVertical: 10 }}>
                          <BrandedMessageCard
                            title={item.title ?? "A Moment of Peace 🙏"}
                            body={item.content}
                            verses={verses}
                            onReadAloud={item.content ? () => handleReadAloud(item.content) : undefined}
                            autoReadEnabled={item.autoRead ?? autoReadEnabled}
                            onToggleAutoRead={toggleAutoRead}
                            onShareLink={item.shareUrl ?? APP_LINK}
                            onClose={() => dismissMessage(item.id)}
                            compact={width < 400}
                          />
                        </View>
                      );
                    }
                    return (
                      <MessageBubble role="user">
                        {item.content}
                      </MessageBubble>
                    );
                  }}
                  style={{ flex: 1, paddingHorizontal: 8 }}
                  contentContainerStyle={{
                    paddingVertical: 16,
                    paddingBottom: 20,
                    ...(messages.length === 0 ? { flexGrow: 1, justifyContent: "center" } : {}),
                  }}
                  showsVerticalScrollIndicator={false}
                  keyboardShouldPersistTaps="handled"
                  refreshControl={
                    <RefreshControl
                      refreshing={refreshing}
                      onRefresh={onRefresh}
                      tintColor="#9FB0C3"
                      colors={["#9FB0C3"]}
                    />
                  }
                  ListEmptyComponent={
                    <View
                      style={{
                        justifyContent: "center",
                        alignItems: "center",
                        paddingHorizontal: 24,
                        paddingTop: 20,
                      }}
                    >
                      <Text baseSize={16} style={{ color: "#9FB0C3", textAlign: "center" }}>
                        Start a conversation - Tap the microphone to speak your thoughts or type to
                        begin chatting
                      </Text>
                    </View>
                  }
                />

                <View
                  style={{
                    backgroundColor: "rgba(20,27,35,0.6)",
                    borderTopWidth: 1,
                    borderTopColor: "rgba(255,255,255,0.05)",
                    paddingBottom: insets.bottom > 0 ? insets.bottom / 2 : 0,
                  }}
                >
                  <ChatInput
                    value={inputText}
                    onChangeText={setInputText}
                    onSend={handleSend}
                    onVoiceStart={startRecording}
                    onVoiceEnd={stopRecording}
                    recording={recording}
                    disabled={loading}
                    bottomInset={insets.bottom}
                  />
                </View>

                <View style={{ position: "absolute", right: isMobile ? 12 : -40, top: isMobile ? 20 : 56 }}>
                  <Pressable onPress={() => nav.navigate("Settings")} style={{ padding: 8, borderRadius: 8 }}>
                    <Text baseSize={18} style={{ color: "#9FB0C3" }}>
                      ⚙️
                    </Text>
                  </Pressable>
                </View>
              </View>
            )}
          </View>
        </Animated.View>
      </SafeAreaView>
    </AtmosphericBackground>
  );
}


