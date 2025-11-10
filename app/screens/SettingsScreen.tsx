import React, { useEffect, useMemo, useState } from "react";
import { View, Switch, Pressable, Alert, Platform, ScrollView, Linking } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as Notifications from "expo-notifications";
import { useNavigation } from "@react-navigation/native";
import { useSettings } from "../../lib/settings";
import { notifications } from "../../lib/notifications";
import type { Mode } from "../../lib/types";
import { track } from "../../lib/analytics";
import SettingsCard from "../components/SettingsCard";
import TTSSettingsCard from "../components/TTSSettingsCard";
import { ReminderTimeSheet } from "../components/ReminderTimeSheet";
import Slider from "@react-native-community/slider";
import { Text } from "@/ux/ScaledText";
import { useFontScale } from "@/ux/useFontScale";
import SettingsTextSize from "@/screens/SettingsTextSize";

export default function SettingsScreen() {
  const nav = useNavigation<any>();
  const { settings, setSetting } = useSettings();
  const { appMult, setMultiplier } = useFontScale();
  const [notifEnabled, setNotifEnabled] = useState(false);
  const [notifSchedule, setNotifSchedule] = useState({ hour: 8, minute: 0, enabled: false });
  const [reminderVisible, setReminderVisible] = useState(false);

  const reminderOptions = useMemo(
    () => [
      { label: "6:00 AM", value: 360 },
      { label: "7:00 AM", value: 420 },
      { label: "8:00 AM", value: 480 },
      { label: "9:00 AM", value: 540 },
      { label: "12:00 PM", value: 720 },
      { label: "6:00 PM", value: 1080 },
      { label: "8:00 PM", value: 1200 },
    ],
    []
  );

  useEffect(() => { 
    loadNotificationStatus();
  }, []);

  async function loadNotificationStatus() {
    try {
      const { status } = await Notifications.getPermissionsAsync();
      const schedule = await notifications.getNotificationSchedule();
      setNotifEnabled(status === "granted" && schedule.enabled);
      setNotifSchedule(schedule);
    } catch (error) {
      console.warn("Failed to load notification status:", error);
    }
  }

  async function toggleDailyReminder() {
    // Web: simulate toggle and persist preference, since native notifications aren't supported
    if (Platform.OS === 'web') {
      if (notifEnabled) {
        setNotifEnabled(false);
        setNotifSchedule(prev => ({ ...prev, enabled: false }));
        await AsyncStorage.setItem('daily_notification_time', JSON.stringify({ hour: notifSchedule.hour, minute: notifSchedule.minute, enabled: false }));
      } else {
        setNotifEnabled(true);
        setNotifSchedule(prev => ({ ...prev, enabled: true }));
        await AsyncStorage.setItem('daily_notification_time', JSON.stringify({ hour: notifSchedule.hour, minute: notifSchedule.minute, enabled: true }));
        Alert.alert("Note", "Daily reminders are available on mobile apps. Preference saved.");
      }
      return;
    }

    if (notifEnabled) {
      await notifications.cancelDailyNotifications();
      setNotifEnabled(false);
      setNotifSchedule(prev => ({ ...prev, enabled: false }));
    } else {
      // Request permissions using the service method
      const granted = await notifications.requestPermissions();
      if (!granted) {
        Alert.alert(
          "Permission Required",
          "Daily Peace needs notification permission to send you daily reminders. Please enable notifications in your device settings.",
          [{ text: "OK" }]
        );
        return;
      }
      setReminderVisible(true);
    }
  }

  function changeNotificationTime() {
    if (Platform.OS === "web") {
      Alert.alert(
        "Choose Reminder Time",
        "Daily reminders are only available on mobile. Preference saved for when you use the app on your device."
      );
      return;
    }

    setReminderVisible(true);
  }

  const scheduleFromMinutes = async (minutes: number) => {
    const hour = Math.floor(minutes / 60) % 24;
    const minute = minutes % 60;
    setNotifSchedule({ hour, minute, enabled: true });
    setNotifEnabled(true);
    try {
      await notifications.scheduleDailyVerse(hour, minute);
    } catch (error) {
      console.warn("Failed to schedule reminder:", error);
    }
  };

  async function handleSelectReminder(minutes: number | null) {
    if (minutes === null) {
      await handleSelectNoReminder();
      return;
    }
    await scheduleFromMinutes(minutes);
  }

  async function handleSelectNoReminder() {
    setNotifEnabled(false);
    setNotifSchedule(prev => ({ ...prev, enabled: false }));
    try {
      await notifications.cancelDailyNotifications();
    } catch (error) {
      console.warn("Failed to cancel reminders:", error);
    }
  }

  const modes: Mode[] = ["conversational", "biblical", "reflective"];

  return (
    <View style={{ flex: 1, backgroundColor: "#0B1016" }}>
      <ScrollView style={{ flex: 1 }} contentContainerStyle={{ paddingTop: 56, paddingHorizontal: 16, gap: 16, paddingBottom: 40 }}>
        <Header title="Settings" onBack={() => nav.goBack()} />

        <Section title="Default Mode">
          <View style={{ flexDirection:"row", gap:8 }}>
            {modes.map(m => (
              <Pressable key={m} onPress={() => setSetting("defaultMode", m)}
                style={{ paddingVertical:8, paddingHorizontal:12, borderRadius:16, backgroundColor: settings.defaultMode===m ? "#2F80ED" : "#141B23" }}>
                <Text baseSize={14} style={{ color:"#EAF2FF" }}>{m[0].toUpperCase()+m.slice(1)}</Text>
              </Pressable>
            ))}
          </View>
        </Section>

        <Section title="Voice & Audio">
          <TTSSettingsCard />
          <SettingsCard
            title="Store voice recordings"
            subtitle="Voice recordings not stored by default"
            right={<Switch value={settings.storeVoiceRecordings} onValueChange={(v) => setSetting("storeVoiceRecordings", v)} />}
          />
        </Section>
        <Section title="Text Size">
          <View style={{ backgroundColor: "#141B23", borderRadius: 16 }}>
            <SettingsTextSize />
          </View>
        </Section>

        <Section title="Daily Reminder">
          <SettingsCard
            title="Daily peace notifications"
            subtitle="8:00 AM local time"
            right={<Switch value={notifEnabled} onValueChange={toggleDailyReminder} />}
          />

          {notifEnabled && (
            <SettingsCard
              title="Reminder time"
              subtitle={
                notifSchedule.hour === 12 ? "12:00 PM" :
                notifSchedule.hour > 12 ? `${notifSchedule.hour - 12}:00 PM` :
                notifSchedule.hour === 0 ? "12:00 AM" :
                `${notifSchedule.hour}:00 AM`
              }
              onPress={changeNotificationTime}
            />
          )}

          {notifEnabled && (
            <View style={{ backgroundColor:"#1a2332", padding:12, borderRadius:12 }}>
              <Text baseSize={12} style={{ color:"#EAF2FF", lineHeight: 18 }}>
                ✨ Daily inspirational messages with Scripture verses will be delivered at your chosen time.
                Notifications include encouraging words from Jesus and biblical wisdom to start your day with peace.
              </Text>
            </View>
          )}
        </Section>

        <Section title="About & Privacy">
          <SettingsCard
            title="View Disclaimer"
            subtitle="AI-generated reflection inspired by Scripture (not a divine message). Voice recordings are transcribed and (by default) not stored."
            onPress={() => nav.navigate("Disclaimer")}
          />
          <View style={{ backgroundColor:"#1a2332", padding:16, borderRadius:12, marginTop:4 }}>
            <Text baseSize={13} style={{ color:"#EAF2FF", lineHeight:20, marginBottom:8 }}>
              <Text baseSize={13} style={{ fontWeight:"600", color:"#EAF2FF" }}>Terms of Use:</Text> Daily Peace offers AI-generated reflections and conversations inspired by Scripture to support personal reflection and spiritual growth. The app is for inspiration only and is not a substitute for professional advice or pastoral care. By using Daily Peace, you agree to use it respectfully, understand that responses are generated by AI, and accept that all use is at your own discretion.
            </Text>
            <Pressable onPress={() => Linking.openURL("https://dailypeace.life/terms-of-use")}>
              <Text baseSize={13} style={{ color:"#A5B4FC", textDecorationLine:"underline" }}>
                View full Terms of Use
              </Text>
            </Pressable>
          </View>
        </Section>
      </ScrollView>
      <ReminderTimeSheet
        visible={reminderVisible}
        selectedMinutes={notifSchedule.hour * 60 + notifSchedule.minute}
        options={reminderOptions}
        onSelect={handleSelectReminder}
        onClose={() => {
          setReminderVisible(false);
        }}
      />
    </View>
  );
}

function Header({ title, onBack }: { title: string; onBack: () => void }) {
  return (
    <View style={{ flexDirection: "row", alignItems: "center", paddingHorizontal: 16, marginBottom: 8 }}>
      <Pressable onPress={onBack} style={{ padding: 8, borderRadius: 8, backgroundColor: "#141B23", marginRight: 8 }}>
        <Text baseSize={14} style={{ color: "#EAF2FF" }}>Back</Text>
      </Pressable>
      <Text baseSize={18} style={{ fontWeight: "bold" }}>{title}</Text>
    </View>
  );
}
function Section({ title, children }: { title:string; children: React.ReactNode }) {
  return (
    <View style={{ gap: 8 }}>
      <Text baseSize={15} style={{ fontWeight: "700" }}>{title}</Text>
      <View style={{ gap: 10 }}>{children}</View>
    </View>
  );
}