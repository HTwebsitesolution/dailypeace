
import React, { useEffect, useMemo, useRef, useState } from "react";
import { View, TextInput, Pressable, Text, ScrollView, Alert } from "react-native";
import * as Speech from "expo-speech";
import { Mode } from "@/lib/types";
import { ModeToggle } from "@/app/components/ModeToggle";
import { MicButton } from "@/app/components/MicButton";
import { MessageBubble } from "@/app/components/MessageBubble";
import { apiGenerate } from "@/lib/api";
import { loadKJVIndex, selectVerses } from "@/lib/verse";
import { classifyNeeds } from "@/lib/classifier";
import { analytics } from "@/lib/analytics";
import { sharing } from "@/lib/sharing";
import { notifications } from "@/lib/notifications";
import seedsIndex from "@/assets/seeds/index.json";

export default function ChatScreen() {
  const [mode, setMode] = useState<Mode>("conversational");
  const [text, setText] = useState("");
  const [msgs, setMsgs] = useState<{role:"user"|"app"; text:string}[]>([
    { role:"app", text:"Welcome to Daily Peace. Share what's on your heart by typing or holding the mic. 🙏" }
  ]);
  const [busy, setBusy] = useState(false);
  const scroll = useRef<ScrollView>(null);

  const seeds = useMemo(()=> seedsIndex as any, []);
  const [kjv, setKjv] = useState<Record<string,string>>({});

  useEffect(()=>{ (async()=> setKjv(await loadKJVIndex()))(); }, []);

  async function onSend(userText: string) {
    if (!userText.trim() || busy) return;
    
    // Analytics: Track user input
    const needIds = classifyNeeds(userText);
    analytics.track('message_sent', { 
      mode, 
      needIds, 
      messageLength: userText.length,
      hasAnxietyKeywords: /anxious|worry|fear|scared/i.test(userText)
    });
    
    // Minimal crisis check
    if (/suicide|kill myself|end my life/i.test(userText)) {
      analytics.track('crisis_detected', { userText: userText.substring(0, 50) });
      const crisisMessage = "I'm really sorry you're feeling this. You matter and your life is precious. Please talk to someone who can help right now. In the UK, call Samaritans at 116 123. If you're elsewhere, contact your local crisis line or emergency services.";
      setMsgs(m => [...m, { role:"user", text: userText }, { role:"app", text: crisisMessage }]);
      
      // Send follow-up encouragement notification
      setTimeout(() => {
        notifications.sendEncouragement(
          "You are not alone 💙",
          "Remember, there are people who care about you. Take it one moment at a time.",
          300 // 5 minutes later
        );
      }, 1000);
      return;
    }
    
    setMsgs(m => [...m, { role:"user", text: userText }]);
    setText("");
    setBusy(true);
    
    try {
      const verses = await selectVerses(mode, seeds as any, kjv, needIds);
      const res = await apiGenerate(userText, mode, verses);

      if (res.inspired_message?.text) {
        const block = res.inspired_message.text + "\n\n" + res.inspired_message.disclaimer;
        setMsgs(m => [...m, { role:"app", text: block }]);
        
        // Analytics: Track successful response
        analytics.track('ai_response_generated', { 
          mode,
          needIds,
          responseLength: res.inspired_message.text.length,
          citationsCount: res.inspired_message.citations?.length || 0
        });
        
        // Optional TTS
        Speech.speak(res.inspired_message.text, { rate: 0.95, pitch: 1.0, language: "en-US" });
        
        // Show sharing options for meaningful responses
        if (res.inspired_message.text.length > 100) {
          setTimeout(() => {
            Alert.alert(
              "Share this reflection? 💫",
              "Would you like to save or share this meaningful response?",
              [
                { text: "Cancel", style: "cancel" },
                { 
                  text: "Save Favorite ⭐", 
                  onPress: () => {
                    const verseText = verses.map(v => `${v.text} (${v.ref})`).join("; ");
                    sharing.saveFavorite(res.inspired_message.text, verseText, new Date().toLocaleDateString());
                    analytics.track('reflection_saved_from_alert');
                  }
                },
                { 
                  text: "Share 📤", 
                  onPress: () => {
                    const verseText = verses.map(v => `${v.text} (${v.ref})`).join("; ");
                    sharing.shareReflection(res.inspired_message.text, verseText);
                    analytics.track('reflection_shared_from_alert');
                  }
                }
              ]
            );
          }, 3000); // Show after user has time to read
        }
      }

      const scriptureText = verses.map((v: any) => `> ${v.text} (${v.ref})`).join("\n\n");
      setMsgs(m => [...m, { role:"app", text: scriptureText }]);
      
      // Analytics: Track verse delivery
      analytics.track('verses_delivered', { 
        needIds,
        versesCount: verses.length,
        mode
      });
      
    } catch (e: any) {
      analytics.captureError(e, { 
        context: 'message_generation',
        userText: userText.substring(0, 100),
        mode
      });
      setMsgs(m => [...m, { role:"app", text: "Sorry—something went wrong. Please try again." }]);
    } finally {
      setBusy(false);
      setTimeout(()=> scroll.current?.scrollToEnd({ animated: true }), 50);
    }
  }

  return (
    <View style={{ flex:1, backgroundColor:"#0B1016", paddingTop: 56 }}>
      <ModeToggle mode={mode} onChange={setMode} />
      <ScrollView ref={scroll} contentContainerStyle={{ padding: 10 }}>
        {msgs.map((m,i)=> <MessageBubble key={i} role={m.role}>{m.text}</MessageBubble>)}
      </ScrollView>

      <View style={{ flexDirection:"row", gap:8, padding:10, alignItems:"center" }}>
        <MicButton onTranscribed={(t)=> setText(t)} />
        <TextInput
          placeholder="Share what's on your heart…"
          placeholderTextColor="#9FB0C3"
          value={text}
          onChangeText={setText}
          style={{ flex:1, backgroundColor:"#141B23", color:"#EAF2FF", padding:12, borderRadius:12 }}
        />
        <Pressable disabled={busy} onPress={()=> onSend(text)} style={{ padding:12, borderRadius:12, backgroundColor: busy ? "#3a485d" : "#2F80ED" }}>
          <Text style={{ color:"#fff", fontWeight: "700" }}>{busy ? "…" : "Send"}</Text>
        </Pressable>
      </View>
    </View>
  );
}
