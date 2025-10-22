
import React, { useState, useEffect, useRef, useCallback } from "react";
import { View, FlatList, KeyboardAvoidingView, Platform, Alert, Animated, Text, Pressable, Image } from "react-native";
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
      const verses = kjvIndex && needSeeds ?
        await selectVerses(mode, needSeeds, kjvIndex, ["fear", "anxiety"]) :
        [];

      // Generate response
      const result = await apiGenerate(userMessage, mode, verses);

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
        addMessage("app", "Hello! I'm here to listen and offer comfort from God's Word. How can I support you today?");
      }
    } catch (error: any) {
      console.error("Generation error:", error);
      addMessage("app", "Oops, I'm having a little trouble right now. Let's try again in a moment, okay?");
    } finally {
      setLoading(false);
    }
  };

  const startRecording = async () => {
    try {
      setRecording(true);
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

  const shareReflection = () => {
    // TODO: Implement sharing
    Alert.alert("Share", "Sharing features are on the way—stay tuned!");
  };

  const closeReflection = () => {
    setReflection(null);
  };

  return (
    <Animated.View style={{ flex: 1, backgroundColor: "#0B1016", opacity: fadeAnim }}>
      <View style={{ flex: 1, paddingHorizontal: 60, position: 'relative' }}>
        <KeyboardAvoidingView
          style={{ flex: 1 }}
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          keyboardVerticalOffset={Platform.OS === "ios" ? 0 : 20}
        >
        {/* Header */}
        <View style={{ paddingTop: 56, paddingBottom: 16, paddingHorizontal: 20, backgroundColor: "#0B1016", borderBottomWidth: 1, borderBottomColor: "rgba(255,255,255,0.05)", alignItems: "center" }}>
          <View style={{ width: "100%", maxWidth: 400, alignItems: "center" }}>
            <View style={{ alignItems: "center", marginBottom: 12 }}>
              <Text style={{ color: "#EAF2FF", fontSize: 32, fontWeight: "bold", textAlign: "center", textShadowColor: "rgba(0,0,0,0.3)", textShadowOffset: {width: 0, height: 2}, textShadowRadius: 4 }}>
                Daily Peace
              </Text>
              <Text style={{ color: "#9FB0C3", fontSize: 18, textAlign: "center", marginTop: 6, fontStyle: "italic" }}>
                Find peace and hope from scriptures ✨
              </Text>
            </View>
          </View>
          <View style={{ position: "absolute", left: 20, top: 56 }}>
            <Animated.View style={{ opacity: 1, transform: [{ scale: logoAnim }], shadowOpacity: logoAnim.interpolate({ inputRange: [0.95, 1.05], outputRange: [0.3, 0.6] }), shadowColor: '#EAF2FF', shadowRadius: 10 }}>
              <Image source={logo} style={{ width: 120, height: 120, resizeMode: 'contain' }} />
            </Animated.View>
          </View>
          <View style={{ alignSelf: 'center' }}>
            <ModeToggle value={mode} onChange={setMode} />
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
                I'm here whenever you're ready to talk. Start a conversation or explore the daily reflection above. 🌟
              </Text>
            </View>
          }
        />

        {/* Input */}
        <View style={{ backgroundColor: "#0B1016", borderTopWidth: 1, borderTopColor: "rgba(255,255,255,0.05)" }}>
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
  );
}