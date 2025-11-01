import React, { useEffect, useState } from "react";
import { View, Text, Switch, Pressable, Alert, Platform } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as Notifications from "expo-notifications";
import { useNavigation } from "@react-navigation/native";
import { useSettings } from "../../lib/settings";
import { notifications } from "../../lib/notifications";
import type { Mode } from "../../lib/types";
import { track } from "../../lib/analytics";
import SettingsCard from "../components/SettingsCard";
import TTSSettingsCard from "../components/TTSSettingsCard";

export default function SettingsScreen() {
  const nav = useNavigation<any>();
  const { settings, setSetting } = useSettings();
  const [notifEnabled, setNotifEnabled] = useState(false);
  const [notifSchedule, setNotifSchedule] = useState({ hour: 8, minute: 0, enabled: false });

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
      const perm = await Notifications.requestPermissionsAsync();
      if (!perm.granted) {
        Alert.alert(
          "Permission Required",
          "Daily Peace needs notification permission to send you daily reminders. Please enable notifications in your device settings.",
          [{ text: "OK" }]
        );
        return;
      }
      await notifications.scheduleDailyVerse(notifSchedule.hour, notifSchedule.minute);
      setNotifEnabled(true);
      setNotifSchedule(prev => ({ ...prev, enabled: true }));
    }
  }

  function changeNotificationTime() {
    const times = [
      { label: "6:00 AM", hour: 6, minute: 0 },
      { label: "7:00 AM", hour: 7, minute: 0 },
      { label: "8:00 AM", hour: 8, minute: 0 },
      { label: "9:00 AM", hour: 9, minute: 0 },
      { label: "10:00 AM", hour: 10, minute: 0 },
      { label: "12:00 PM", hour: 12, minute: 0 },
      { label: "6:00 PM", hour: 18, minute: 0 },
      { label: "8:00 PM", hour: 20, minute: 0 },
    ];

    Alert.alert(
      "Choose Reminder Time",
      "When would you like to receive your daily peace reminder?",
      [
        ...times.map(time => ({
          text: time.label,
          onPress: async () => {
            setNotifSchedule({ hour: time.hour, minute: time.minute, enabled: notifEnabled });
            if (notifEnabled) {
              await notifications.scheduleDailyVerse(time.hour, time.minute);
            }
          }
        })),
        { text: "Cancel", style: "cancel" as const }
      ]
    );
  }

  const modes: Mode[] = ["conversational", "biblical", "reflective"];

  return (
    <View style={{ flex: 1, backgroundColor: "#0B1016", paddingTop: 56, paddingHorizontal: 16, gap: 16 }}>
      <Header title="Settings" onBack={() => nav.goBack()} />

      <Section title="Default Mode">
        <View style={{ flexDirection:"row", gap:8 }}>
          {modes.map(m => (
            <Pressable key={m} onPress={() => setSetting("defaultMode", m)}
              style={{ paddingVertical:8, paddingHorizontal:12, borderRadius:16, backgroundColor: settings.defaultMode===m ? "#2F80ED" : "#141B23" }}>
              <Text style={{ color:"#EAF2FF" }}>{m[0].toUpperCase()+m.slice(1)}</Text>
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
            <Text style={{ color:"#EAF2FF", fontSize:12, lineHeight:16 }}>
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
      </Section>
    </View>
  );
}

function Header({ title, onBack }: { title: string; onBack: () => void }) {
  return (
    <View style={{ flexDirection: "row", alignItems: "center", paddingHorizontal: 16, marginBottom: 8 }}>
      <Pressable onPress={onBack} style={{ padding: 8, borderRadius: 8, backgroundColor: "#141B23", marginRight: 8 }}>
        <Text style={{ color: "#EAF2FF" }}>Back</Text>
      </Pressable>
      <Text style={{ color: "#EAF2FF", fontSize: 18, fontWeight: "bold" }}>{title}</Text>
    </View>
  );
}
function Section({ title, children }: { title:string; children: React.ReactNode }) {
  return (
    <View style={{ gap: 8 }}>
      <Text style={{ color: "#EAF2FF", fontWeight: "700" }}>{title}</Text>
      <View style={{ gap: 10 }}>{children}</View>
    </View>
  );
}