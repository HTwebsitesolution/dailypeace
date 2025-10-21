import React, { useEffect, useState } from "react";
import { View, Text, Switch, Pressable } from "react-native";
import * as Notifications from "expo-notifications";
import { useNavigation } from "@react-navigation/native";
import { useSettings } from "../../lib/settings";
import type { Mode } from "../../lib/types";
import { track } from "../../lib/analytics";

export default function SettingsScreen() {
  const nav = useNavigation<any>();
  const { settings, setSetting } = useSettings();
  const [notifEnabled, setNotifEnabled] = useState(false);

  useEffect(() => { (async () => {
    const { status } = await Notifications.getPermissionsAsync();
    setNotifEnabled(status === "granted");
  })(); }, []);

  async function scheduleDaily8AM() {
    const perm = await Notifications.requestPermissionsAsync();
    if (!perm.granted) return;
    await Notifications.cancelAllScheduledNotificationsAsync();
    const now = new Date();
    const at = new Date(now);
    at.setHours(8, 0, 0, 0);
    if (at.getTime() < now.getTime()) at.setDate(at.getDate() + 1);

    await Notifications.scheduleNotificationAsync({
      content: {
        title: "Daily Peace",
        body: "Your daily message is ready.",
        sound: "default"
      },
      trigger: {
        hour: 8, minute: 0, repeats: true
      } as any
    });
    setNotifEnabled(true);
    track("notif_daily_scheduled");
  }

  const modes: Mode[] = ["conversational", "biblical", "reflective"];

  return (
    <View style={{ flex:1, backgroundColor:"#0B1016", paddingTop: 56, paddingHorizontal: 16, gap: 16 }}>
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
        <Row label="Read replies aloud (TTS)">
          <Switch value={settings.ttsEnabled} onValueChange={(v) => setSetting("ttsEnabled", v)} />
        </Row>
        <Row label="Store voice recordings on device">
          <Switch value={settings.storeVoiceRecordings} onValueChange={(v) => setSetting("storeVoiceRecordings", v)} />
        </Row>
      </Section>

      <Section title="Daily Reminder">
        <Row label="8:00 AM notification">
          <Pressable onPress={scheduleDaily8AM} style={{ backgroundColor: notifEnabled ? "#1e8e3e" : "#2F80ED", paddingHorizontal:12, paddingVertical:8, borderRadius:8 }}>
            <Text style={{ color:"#fff" }}>{notifEnabled ? "Scheduled" : "Enable"}</Text>
          </Pressable>
        </Row>
      </Section>

      <Section title="About & Privacy">
        <Pressable onPress={() => nav.navigate("Disclaimer")} style={{ backgroundColor:"#141B23", padding:14, borderRadius:12 }}>
          <Text style={{ color:"#EAF2FF" }}>View Disclaimer</Text>
          <Text style={{ color:"#9FB0C3", marginTop:4, fontSize:12 }}>
            AI-generated reflection inspired by Scripture (not a divine message). Voice recordings are transcribed and (by default) not stored.
          </Text>
        </Pressable>
      </Section>
    </View>
  );
}

function Header({ title, onBack }: { title: string; onBack: () => void }) {
  return (
    <View style={{ flexDirection:"row", alignItems:"center", paddingHorizontal:16, marginBottom:8 }}>
      <Pressable onPress={onBack} style={{ padding:8, borderRadius:8, backgroundColor:"#141B23", marginRight:8 }}>
        <Text style={{ color:"#EAF2FF" }}>Back</Text>
      </Pressable>
      <Text style={{ color:"#EAF2FF", fontSize:18, fontWeight:"700" }}>{title}</Text>
    </View>
  );
}
function Section({ title, children }: { title:string; children: React.ReactNode }) {
  return (
    <View style={{ gap:8 }}>
      <Text style={{ color:"#9FB0C3", fontWeight:"600" }}>{title}</Text>
      <View style={{ gap:10 }}>{children}</View>
    </View>
  );
}
function Row({ label, children }: { label:string; children: React.ReactNode }) {
  return (
    <View style={{ backgroundColor:"#141B23", padding:12, borderRadius:12, flexDirection:"row", alignItems:"center", justifyContent:"space-between" }}>
      <Text style={{ color:"#EAF2FF" }}>{label}</Text>
      {children}
    </View>
  );
}