
import React, { useState, useEffect, useRef, useCallback } from "react";
import { View, FlatList, KeyboardAvoidingView, Platform, Alert, Animated, Text, Pressable, Image, useWindowDimensions } from "react-native";
import { Audio } from "expo-av";
import * as FileSystem from "expo-file-system";
import { useNavigation } from "@react-navigation/native";
import { useSettings } from "../../lib/settings";
import { apiGenerate, apiTranscribe } from "../../lib/api";
import { loadKJVIndex, selectVerses } from "../../lib/verse";
import fearAnxietySeeds from "../../assets/seeds/fear_anxiety.json";
import { track } from "../../lib/analytics";
import type { Mode, Verse, InspiredMessage } from "../../lib/types";
import ModeToggle from "../components/ModeToggle";
import { MessageBubble } from "../components/MessageBubble";
import ChatInput from "../components/ChatInput";
import ReflectionCard from "../components/ReflectionCard";
import AtmosphericBackground from "../components/AtmosphericBackground";

const logo = require("../../assets/DailyPeace App Logo.png");

interface Message {
  id: string;
  role: "user" | "app";
  content: string;
  timestamp: Date;
}

interface Reflection {
  message: string;
  verses: string[];
}

export default function ChatScreen() {
  const nav = useNavigation<any>();
  const { width } = useWindowDimensions();
  const { settings } = useSettings();
  const [mode, setMode] = useState<Mode>(settings.defaultMode);
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputText, setInputText] = useState("");
  const [recording, setRecording] = useState(false);
  const [loading, setLoading] = useState(false);
  const [reflection, setReflection] = useState<Reflection | null>(null);
  const [kjvIndex, setKjvIndex] = useState<Record<string, string> | null>(null);
  const [needSeeds, setNeedSeeds] = useState<any>(null);

  const recordingRef = useRef<Audio.Recording | null>(null);
  const speechRecognitionRef = useRef<any>(null);
  const flatListRef = useRef<FlatList>(null);
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const logoAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    loadData();
    requestPermissions();
    loadDailyReflection();
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
  }, []);

  const loadDailyReflection = async () => {
    try {
      // Load a default daily reflection
      const dailyMessage = "Peace I leave with you; my peace I give you. I do not give to you as the world gives. Do not let your hearts be troubled and do not be afraid.";
      const dailyVerses = ["John 14:27"];

      setReflection({
        message: dailyMessage,
        verses: dailyVerses,
      });
    } catch (error) {
      console.error("Failed to load daily reflection:", error);
    }
  };

  const loadData = async () => {
    try {
      const idx = await loadKJVIndex();
      setKjvIndex(idx);
      setNeedSeeds(fearAnxietySeeds);
    } catch (error) {
      console.error("Failed to load data:", error);
    }
  };

  const requestPermissions = async () => {
    try {
      await Audio.requestPermissionsAsync();
    } catch (error) {
      console.warn("Audio permissions not granted:", error);
    }
  };

  const addMessage = useCallback((role: "user" | "app", content: string) => {
    const message: Message = {
      id: Date.now().toString(),
      role,
      content,
      timestamp: new Date(),
    };
    setMessages(prev => [...prev, message]);
    setTimeout(() => {
      flatListRef.current?.scrollToEnd({ animated: true });
    }, 100);
  }, []);

  const handleSend = async () => {
    if (!inputText.trim() || loading) return;

    const userMessage = inputText.trim();
    setInputText("");
    addMessage("user", userMessage);

    setLoading(true);
    track("message_sent", { mode, length: userMessage.length });

    try {
      // Get relevant verses
      let verses: Verse[] = [];
      if (kjvIndex && needSeeds) {
        try {
          verses = await selectVerses(mode, needSeeds, kjvIndex, ["fear", "anxiety"]);
          console.log(`[Chat] Selected ${verses.length} verses for context`);
        } catch (verseError) {
          console.warn("[Chat] Verse selection failed, continuing without verses:", verseError);
          verses = [];
        }
      } else {
        console.warn("[Chat] kjvIndex or needSeeds not loaded yet");
      }

      // Generate response with timeout
      const result = await Promise.race([
        apiGenerate(userMessage, mode, verses),
        new Promise((_, reject) => 
          setTimeout(() => reject(new Error("Request timeout after 30 seconds")), 30000)
        )
      ]) as GenerateResult;

      if (result.inspired_message) {
        const response = result.inspired_message;
        addMessage("app", response.text);

        // Show reflection card if we have verses
        if (response.citations.length > 0) {
          setReflection({
            message: response.text,
            verses: response.citations,
          });
        }
      } else {
        addMessage("app", "I'm here to listen and share wisdom from Scripture. How are you feeling today?");
      }
    } catch (error: any) {
      console.error("Generation error:", error);
      // Provide more specific error information for debugging
      const errorMsg = error?.message || "Unknown error";
      console.error("Full error details:", { errorMsg, error });
      addMessage("app", `I'm having a little trouble right now. Let's try again in a moment, okay?`);
    } finally {
      setLoading(false);
    }
  };

  const startRecording = async () => {
    try {
      setRecording(true);
      
      // Check if Web Speech API is available (web browsers)
      const SpeechRecognition = (window as any).webkitSpeechRecognition || (window as any).SpeechRecognition;
      
      if (SpeechRecognition && typeof window !== 'undefined') {
        // Use Web Speech API for web browsers
        const recognition = new SpeechRecognition();
        recognition.continuous = true;
        recognition.interimResults = false;
        recognition.lang = 'en-US';

        recognition.onresult = (event: any) => {
          const transcript = Array.from(event.results)
            .map((result: any) => result[0].transcript)
            .join('');
          setInputText(prev => prev + transcript + ' ');
        };

        recognition.onerror = (event: any) => {
          console.error('Speech recognition error:', event.error);
          if (event.error === 'no-speech') {
            // User didn't speak, just stop recording silently
          } else {
            Alert.alert("Speech Recognition Error", "Could not recognize speech. Please try again.");
          }
          setRecording(false);
        };

        recognition.onend = () => {
          setRecording(false);
        };

        speechRecognitionRef.current = recognition;
        recognition.start();
        return;
      }

      // Fallback to Expo Audio for mobile apps
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
  };

  const stopRecording = async () => {
    // Stop Web Speech API if active (web browsers)
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

    // Stop Expo Audio recording (mobile apps)
    if (!recordingRef.current) return;

    try {
      setRecording(false);
      await recordingRef.current.stopAndUnloadAsync();
      const uri = recordingRef.current.getURI();

      if (uri) {
        // Convert to base64 for API
        const base64 = await FileSystem.readAsStringAsync(uri, {
          encoding: FileSystem.EncodingType.Base64,
        });

        // Transcribe
        const transcribedText = await apiTranscribe("voice.mp3", base64);
        setInputText(transcribedText);
      }
    } catch (error) {
      console.error("Recording stop error:", error);
      Alert.alert("Transcription Error", "Unable to process voice recording.");
    } finally {
      recordingRef.current = null;
    }
  };

  const shareReflection = async () => {
    if (!reflection) return;

    const shareText = `${reflection.message}\n\n${reflection.verses.join('\n')}\n\n— Shared from Daily Peace`;

    // Try native share API first (works on mobile browsers)
    if (navigator.share) {
      try {
        await navigator.share({
          title: "A Moment of Peace",
          text: shareText,
        });
        return;
      } catch (error) {
        console.log("Share cancelled or failed");
      }
    }

    // Fallback: Copy to clipboard
    try {
      await navigator.clipboard.writeText(shareText);
      Alert.alert("Copied!", "Message copied to clipboard 📋");
    } catch (error) {
      console.error("Failed to copy to clipboard:", error);
      Alert.alert("Share", shareText);
    }
  };

  const closeReflection = () => {
    setReflection(null);
  };

  return (
    <AtmosphericBackground 
      mode={mode} 
      rotationInterval={50000}
      enableTimeRotation={true}
      enableModeRotation={true}
    >
      <Animated.View style={{ flex: 1, opacity: fadeAnim }}>
        <View style={{ flex: 1, paddingHorizontal: 60, position: 'relative' }}>
            <KeyboardAvoidingView
              style={{ flex: 1 }}
              behavior={Platform.OS === "ios" ? "padding" : "height"}
              keyboardVerticalOffset={Platform.OS === "ios" ? 0 : 20}
            >
          {/* Header */}
          <View style={{ paddingTop: 56, paddingBottom: 16, paddingHorizontal: 20, backgroundColor: "rgba(20,27,35,0.6)", borderBottomWidth: 1, borderBottomColor: "rgba(255,255,255,0.05)", alignItems: "center" }}>
            <View style={{ width: "100%", maxWidth: 400, alignItems: "center" }}>
              <View style={{ alignItems: "center", marginBottom: 12 }}>
                <Animated.View
                  style={{
                    opacity: fadeAnim,
                    transform: [{ translateY: fadeAnim.interpolate({
                      inputRange: [0, 1],
                      outputRange: [-20, 0]
                    })}],
                  }}
                >
                  <Text style={{ color: "#EAF2FF", fontSize: 38, fontWeight: "bold", textAlign: "center", textShadowColor: "rgba(0,0,0,0.3)", textShadowOffset: {width: 0, height: 2}, textShadowRadius: 4 }}>
                    Daily Peace
                  </Text>
                </Animated.View>
                <Animated.View
                  style={{
                    opacity: fadeAnim,
                    transform: [{ translateY: fadeAnim.interpolate({
                      inputRange: [0, 1],
                      outputRange: [-10, 0]
                    })}],
                  }}
                >
                  <Text style={{ color: "#9FB0C3", fontSize: 20, textAlign: "center", marginTop: 6, fontStyle: "italic" }}>
                    Find peace and hope from scriptures ✨
                  </Text>
                </Animated.View>
              </View>
            </View>
            {/* Decorative logo - hidden on mobile to prevent overlap */}
            {width >= 768 && (
              <View style={{ position: "absolute", left: 20, top: 56 }}>
                <Animated.View style={{ 
                  opacity: 1, 
                  transform: [{ scale: logoAnim }], 
                  shadowColor: '#EAF2FF',
                  shadowOffset: { width: 0, height: 0 },
                  shadowOpacity: logoAnim.interpolate({ inputRange: [0.95, 1.05], outputRange: [0.3, 0.6] }), 
                  shadowRadius: 10,
                  elevation: 5
                }}>
                  <Image 
                    source={logo} 
                    style={{ 
                      width: 120, 
                      height: 120, 
                      resizeMode: 'contain'
                    }} 
                  />
                </Animated.View>
              </View>
            )}
            <View style={{ alignSelf: 'center' }}>
              <Animated.View
                style={{
                  opacity: fadeAnim,
                  transform: [{ scale: fadeAnim }],
                }}
              >
                <ModeToggle value={mode} onChange={setMode} />
              </Animated.View>
            </View>
          </View>

          {/* Daily Reflection */}
          {reflection && (
            <ReflectionCard
              message={reflection.message}
              verses={reflection.verses}
              onShare={shareReflection}
              onClose={closeReflection}
            />
          )}

          {/* Messages */}
          <FlatList
            ref={flatListRef}
            data={messages}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <MessageBubble role={item.role}>
                {item.content}
              </MessageBubble>
            )}
            style={{ flex: 1, paddingHorizontal: 8 }}
            contentContainerStyle={{ paddingVertical: 16, flexGrow: messages.length === 0 ? 1 : 0 }}
            showsVerticalScrollIndicator={false}
            ListEmptyComponent={
              <View style={{ justifyContent: "center", alignItems: "center", paddingHorizontal: 24, paddingTop: 20 }}>
                <Text style={{ color: "#9FB0C3", fontSize: 16, textAlign: "center", lineHeight: 24 }}>
                  Start a conversation above, or tap the close button on the reflection to begin chatting. ✨
                </Text>
              </View>
            }
          />

          {/* Input */}
          <View style={{ backgroundColor: "rgba(20,27,35,0.6)", borderTopWidth: 1, borderTopColor: "rgba(255,255,255,0.05)" }}>
            <ChatInput
              value={inputText}
              onChangeText={setInputText}
              onSend={handleSend}
              onVoiceStart={startRecording}
              onVoiceEnd={stopRecording}
              recording={recording}
              disabled={loading}
            />
          </View>
          </KeyboardAvoidingView>
          <View style={{ position: "absolute", right: -40, top: 56 }}>
            <Pressable
              onPress={() => nav.navigate("Settings")}
              style={{ padding: 8, borderRadius: 8 }}
              android_ripple={{ color: "rgba(255,255,255,0.1)" }}
            >
              <Text style={{ color: "#9FB0C3", fontSize: 18 }}>⚙️</Text>
            </Pressable>
          </View>
          </View>
        </Animated.View>
    </AtmosphericBackground>
  );
}