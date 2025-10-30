import React, { useEffect, useState } from "react";
import { Modal, View, Text, Pressable, Platform, ScrollView } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useSettings } from "../../lib/settings";

type Mode = "conversational" | "biblical" | "reflective";

const MODES: { id: Mode; label: string; desc: string }[] = [
  { id: "conversational", label: "Conversational", desc: "Warm, empathetic, everyday language." },
  { id: "biblical", label: "Scripture Wisdom", desc: "Short, verse‑anchored responses." },
  { id: "reflective", label: "Quiet Reflection", desc: "Gentle prompts and pauses for prayer." },
];

const NEEDS = [
  { id: "peace_calm", label: "Peace & Calm" },
  { id: "trust_provision", label: "Trust & Provision" },
  { id: "purpose_direction", label: "Purpose & Direction" },
  { id: "forgiveness_compassion", label: "Forgiveness & Compassion" },
  { id: "hope_endurance", label: "Hope & Endurance" },
  { id: "gratitude_praise", label: "Gratitude & Praise" },
  { id: "courage_faith_action", label: "Courage & Faith in Action" },
  { id: "rest_renewal", label: "Rest & Renewal" },
  { id: "love_community", label: "Love & Community" },
];

const TIMES = ["06:00","07:00","08:00","09:00","12:00","15:00","18:00","20:00"] as const;

async function maybeScheduleLocal(reminder: string) {
  try {
    if (!reminder) return;
    const Notifications = await import("expo-notifications");
    const { default: ExpoNotifications } = Notifications as any;
    // Create Android channel if possible
    if (Platform.OS === "android" && ExpoNotifications?.setNotificationChannelAsync) {
      await ExpoNotifications.setNotificationChannelAsync("daily-peace", {
        name: "Daily Peace",
        importance: 3,
      });
    }
    const [h, m] = reminder.split(":").map(Number);
    await ExpoNotifications.requestPermissionsAsync();
    const scheduled = await ExpoNotifications.getAllScheduledNotificationsAsync();
    for (const s of scheduled) {
      if ((s.content?.data as any)?.dp === "daily") {
        await ExpoNotifications.cancelScheduledNotificationAsync(s.identifier);
      }
    }
    await ExpoNotifications.scheduleNotificationAsync({
      content: { title: "🕊️ Daily Peace", body: "Your moment of peace is ready.", data: { dp: "daily" } },
      trigger: { hour: h, minute: m, repeats: true, channelId: Platform.OS === "android" ? "daily-peace" : undefined } as any,
    });
  } catch {
    // no-op on web or if not installed
  }
}

export default function OnboardingModal({ visible, onDone }: { visible: boolean; onDone: () => void }) {
  const { setSetting } = useSettings();
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [mode, setMode] = useState<Mode>("conversational");
  const [selectedNeeds, setSelectedNeeds] = useState<string[]>(["peace_calm"]);
  const [reminder, setReminder] = useState<string>("08:00");

  useEffect(() => {
    (async () => {
      const saved = await AsyncStorage.getItem("@dp/onboarding_done");
      if (saved === "1") onDone();
    })();
  }, [onDone]);

  const toggleNeed = (id: string) => {
    setSelectedNeeds((cur) =>
      cur.includes(id) ? cur.filter((x) => x !== id) : cur.length >= 5 ? cur : [...cur, id]
    );
  };

  const finish = async () => {
    try {
      setSetting("defaultMode", mode);
    } catch {}
    await AsyncStorage.multiSet([
      ["@dp/onboarding_done", "1"],
      ["@dp/mode", mode],
      ["@dp/needs", JSON.stringify(selectedNeeds)],
      ["@dp/reminder", reminder || ""],
    ]);
    if (reminder) await maybeScheduleLocal(reminder);
    onDone();
  };

  const canProceed = step === 1 || (step === 2 ? selectedNeeds.length > 0 : true);

  return (
    <Modal visible={visible} animationType="fade" transparent>
      <View style={{ flex: 1, backgroundColor: "rgba(0,0,0,0.7)", alignItems: "center", justifyContent: "center", paddingHorizontal: 16 }}>
        <View style={{ width: "100%", maxWidth: 720, borderRadius: 20, backgroundColor: "#141B23", borderWidth: 1, borderColor: "rgba(255,255,255,0.1)" }}>
          {/* Header */}
          <View style={{ paddingHorizontal: 20, paddingVertical: 12, borderTopLeftRadius: 20, borderTopRightRadius: 20, backgroundColor: "rgba(59,130,246,0.9)", borderBottomWidth: 1, borderBottomColor: "rgba(255,255,255,0.1)" }}>
            <Text style={{ color: "#FFFFFF", fontWeight: "700", fontSize: 18 }}>
              {step === 1 && "Choose your tone"}
              {step === 2 && "What do you need most right now?"}
              {step === 3 && "Daily reminder"}
            </Text>
          </View>

          {/* Body */}
          <View style={{ paddingHorizontal: 20, paddingVertical: 16 }}>
            {/* Step dots */}
            <View style={{ flexDirection: "row", gap: 6, marginBottom: 12, alignSelf: "center" }}>
              {[1,2,3].map((i) => (
                <View key={i} style={{ width: 8, height: 8, borderRadius: 4, backgroundColor: step === i ? "#3B82F6" : "rgba(255,255,255,0.25)" }} />
              ))}
            </View>

            {step === 1 && (
              <View style={{ gap: 10 }}>
                {MODES.map((m) => {
                  const active = mode === m.id;
                  return (
                    <Pressable key={m.id} onPress={() => setMode(m.id)} style={{ borderRadius: 12, paddingHorizontal: 12, paddingVertical: 12, borderWidth: 1, borderColor: active ? "#3B82F6" : "rgba(255,255,255,0.1)", backgroundColor: active ? "rgba(59,130,246,0.25)" : "rgba(255,255,255,0.05)" }} android_ripple={{ color: "#1f3a68" }}>
                      <Text style={{ color: active ? "#FFFFFF" : "#EAF2FF", fontSize: 16, fontWeight: "600" }}>{m.label}</Text>
                      <Text style={{ color: "#9FB0C3", marginTop: 4 }}>{m.desc}</Text>
                    </Pressable>
                  );
                })}
              </View>
            )}

            {step === 2 && (
              <View style={{ gap: 8 }}>
                <Text style={{ color: "#9FB0C3", marginBottom: 4 }}>Pick a few—this helps tailor verses and reflections.</Text>
                <Text style={{ color: "#9FB0C3", fontSize: 12 }}>Selected {selectedNeeds.length}/5</Text>
                <ScrollView style={{ maxHeight: 280 }} contentContainerStyle={{ gap: 8 }}>
                  <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 8 }}>
                    {NEEDS.map((item) => {
                      const active = selectedNeeds.includes(item.id);
                      return (
                        <Pressable key={item.id} onPress={() => toggleNeed(item.id)} style={{ paddingHorizontal: 12, paddingVertical: 10, borderRadius: 12, borderWidth: 1, borderColor: active ? "#3B82F6" : "rgba(255,255,255,0.1)", backgroundColor: active ? "rgba(59,130,246,0.25)" : "rgba(255,255,255,0.05)" }}>
                          <Text style={{ color: active ? "#FFFFFF" : "#EAF2FF", fontWeight: "600" }}>{item.label}</Text>
                        </Pressable>
                      );
                    })}
                  </View>
                </ScrollView>
              </View>
            )}

            {step === 3 && (
              <View style={{ gap: 10 }}>
                <Text style={{ color: "#9FB0C3" }}>Would you like a gentle daily nudge?</Text>
                <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 8 }}>
                  <Pressable onPress={() => setReminder("")} style={{ paddingHorizontal: 12, paddingVertical: 8, borderRadius: 12, borderWidth: 1, borderColor: !reminder ? "#FFFFFF33" : "#FFFFFF1A", backgroundColor: !reminder ? "#FFFFFF26" : "#FFFFFF0D" }}>
                    <Text style={{ color: !reminder ? "#FFFFFF" : "#EAF2FF" }}>No reminder</Text>
                  </Pressable>
                  {TIMES.map((t) => {
                    const active = reminder === t;
                    return (
                      <Pressable key={t} onPress={() => setReminder(t)} style={{ paddingHorizontal: 12, paddingVertical: 8, borderRadius: 12, borderWidth: 1, borderColor: active ? "#3B82F6" : "#FFFFFF1A", backgroundColor: active ? "#3B82F640" : "#FFFFFF0D" }}>
                        <Text style={{ color: active ? "#FFFFFF" : "#EAF2FF" }}>{t}</Text>
                      </Pressable>
                    );
                  })}
                </View>
                <Text style={{ color: "#9FB0C3", fontSize: 12 }}>You can change this later in Settings.</Text>
              </View>
            )}
          </View>

          {/* Footer */}
          <View style={{ paddingHorizontal: 20, paddingVertical: 12, borderTopWidth: 1, borderTopColor: "rgba(255,255,255,0.1)", flexDirection: "row", justifyContent: "space-between", borderBottomLeftRadius: 20, borderBottomRightRadius: 20 }}>
            <Pressable onPress={() => setStep((s) => Math.max(1, (s - 1) as 1))} disabled={step === 1} style={{ paddingHorizontal: 16, paddingVertical: 8, borderRadius: 12, backgroundColor: step === 1 ? "#FFFFFF0D" : "#FFFFFF1A" }}>
              <Text style={{ color: "#FFFFFF", fontWeight: "600" }}>Back</Text>
            </Pressable>
            {step < 3 ? (
              <Pressable disabled={!canProceed} onPress={() => setStep((s) => (s + 1) as 2 | 3)} style={{ paddingHorizontal: 16, paddingVertical: 8, borderRadius: 12, backgroundColor: canProceed ? "#3B82F6" : "#3B82F633" }}>
                <Text style={{ color: "#FFFFFF", fontWeight: "700" }}>Next</Text>
              </Pressable>
            ) : (
              <Pressable onPress={finish} style={{ paddingHorizontal: 16, paddingVertical: 8, borderRadius: 12, backgroundColor: "#3B82F6" }}>
                <Text style={{ color: "#FFFFFF", fontWeight: "700" }}>Finish</Text>
              </Pressable>
            )}
          </View>
        </View>
      </View>
    </Modal>
  );
}


