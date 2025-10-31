import React, { useMemo, useEffect, useState } from "react";
import { View, Text, Pressable, FlatList, Share, Alert, Platform, TouchableOpacity } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { addFavorite, getFavorites } from "../../lib/verseFavorites";

type Entry = {
  id: string;
  category: string;
  text: string;
  verses: string[];
  tones?: { morning?: string; night?: string };
};

// Use require to ensure bundlers (Expo/Metro) pick up the JSON asset
const messages = require("../../assets/rotations/messages.json") as Entry[];

const CATEGORY_LABEL: Record<string, string> = {
  peace_calm: "Peace & Calm",
  trust_provision: "Trust & Provision",
  purpose_direction: "Purpose & Direction",
  forgiveness_compassion: "Forgiveness & Compassion",
  hope_endurance: "Hope & Endurance",
  gratitude_praise: "Gratitude & Praise",
  courage_faith_action: "Courage & Faith in Action",
  rest_renewal: "Rest & Renewal",
  love_community: "Love & Community",
};

export default function CollectionsScreen({ navigation }: any) {
  const byCategory = useMemo(() => {
    const map: Record<string, Entry[]> = {};
    (messages as Entry[]).forEach((m) => {
      (map[m.category] ||= []).push(m);
    });
    Object.values(map).forEach((arr) =>
      arr.sort((a, b) => a.id.localeCompare(b.id, undefined, { numeric: true }))
    );
    return map;
  }, []);

  const data = Object.entries(byCategory).map(([category, items]) => ({
    key: category,
    title: CATEGORY_LABEL[category] || category,
    count: items.length,
  }));

  return (
    <View style={{ flex: 1, backgroundColor: "#0B1016", paddingHorizontal: 16, paddingTop: 24 }}>
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
        <Text style={{ color: "#FFFFFF", fontSize: 22, fontWeight: "700" }}>Collections</Text>
        <Pressable onPress={() => navigation.navigate('Home')} style={{ paddingHorizontal: 12, paddingVertical: 8, borderRadius: 10, backgroundColor: 'rgba(255,255,255,0.12)' }}>
          <Text style={{ color: '#EAF2FF', fontWeight: '600' }}>Home</Text>
        </Pressable>
      </View>
      <FlatList
        data={data}
        keyExtractor={(i) => i.key}
        ItemSeparatorComponent={() => <View style={{ height: 10 }} />}
        renderItem={({ item }) => (
          <Pressable
            onPress={() => navigation.navigate("CollectionDetail", { category: item.key })}
            style={{ borderRadius: 16, backgroundColor: "#141B23", borderWidth: 1, borderColor: "rgba(255,255,255,0.1)", paddingHorizontal: 16, paddingVertical: 16 }}
            android_ripple={{ color: "#1f3a68" }}
          >
            <Text style={{ color: "#FFFFFF", fontWeight: "600", fontSize: 16 }}>{item.title}</Text>
            <Text style={{ color: "#9FB0C3", marginTop: 4 }}>{item.count} reflections</Text>
          </Pressable>
        )}
      />
    </View>
  );
}

export function CollectionDetailScreen({ route, navigation }: any) {
  const { category } = route.params as { category: string };
  const items = (messages as Entry[]).filter((m) => m.category === category);

  const [favoriteRefs, setFavoriteRefs] = useState<Set<string>>(new Set());
  const refreshFavorites = async () => {
    try {
      const list = await getFavorites();
      setFavoriteRefs(new Set(list.map(f => f.ref)));
    } catch {}
  };
  useEffect(() => { refreshFavorites(); }, []);

  // Clipboard helper: prefer expo-clipboard when available
  let clipboardSetStringAsync: null | ((text: string) => Promise<void>) = null;
  try {
    // @ts-ignore - lazy require so web/builds without the module won't fail
    const Clipboard = require("expo-clipboard");
    if (Clipboard?.setStringAsync) clipboardSetStringAsync = Clipboard.setStringAsync;
  } catch {}

  const copyText = async (text: string) => {
    const payload = `${text}`;
    // 0) expo-clipboard if present
    if (clipboardSetStringAsync) {
      try {
        await clipboardSetStringAsync(payload);
        Alert.alert("Copied", "Text copied to clipboard.");
        return;
      } catch {}
    }
    // 1) Try modern Clipboard API on secure web contexts
    try {
      const nav: any = (globalThis as any)?.navigator;
      const isSecure = Boolean((globalThis as any)?.isSecureContext);
      if (nav && nav.clipboard && isSecure) {
        await nav.clipboard.writeText(payload);
        Alert.alert("Copied", "Text copied to clipboard.");
        return;
      }
    } catch {}
    // 2) Try navigator.share on web
    try {
      const nav: any = (globalThis as any)?.navigator;
      if (nav && nav.share) {
        await nav.share({ text: payload, title: 'Daily Peace' });
        return;
      }
    } catch {}
    // 3) Legacy fallback for web: hidden textarea + execCommand
    try {
      const doc: any = (globalThis as any)?.document;
      if (doc && doc.createElement) {
        const textarea = doc.createElement('textarea');
        textarea.value = payload;
        textarea.style.position = 'fixed';
        textarea.style.left = '-9999px';
        doc.body.appendChild(textarea);
        textarea.select();
        doc.execCommand('copy');
        doc.body.removeChild(textarea);
        Alert.alert("Copied", "Text copied to clipboard.");
        return;
      }
    } catch {}
    // 4) Native/web fallback: React Native Share API
    try {
      await Share.share({ message: payload, title: "Daily Peace" });
    } catch {}
  };

  const saveVerses = async (verses: string[]) => {
    try {
      for (const v of verses) {
        await addFavorite({ ref: v, text: undefined, addedAt: Date.now() });
      }
      Alert.alert("Saved", "Verses saved to favorites.");
      refreshFavorites();
    } catch (e) {
      Alert.alert("Oops", "Couldn't save right now. Please try again.");
    }
  };

	const shareContent = async (text: string, verses: string[]) => {
		const payload = `${text}\n\n${verses.join(' · ')}`;
		// 1) Web share sheet when available
		try {
			const nav: any = (globalThis as any)?.navigator;
			if (nav && nav.share) {
				await nav.share({ title: 'Daily Peace', text: payload });
				return;
			}
		} catch {}
		// 2) Native share sheet (iOS/Android)
		try {
			if (Platform.OS !== 'web') {
				await Share.share({ message: payload, title: 'Daily Peace' });
				return;
			}
		} catch {}
		// 3) Fallback: copy to clipboard and notify
		try {
			if (clipboardSetStringAsync) {
				await clipboardSetStringAsync(payload);
				Alert.alert('Copied', 'Content copied. Paste it into your app.');
				return;
			}
			const nav: any = (globalThis as any)?.navigator;
			const isSecure = Boolean((globalThis as any)?.isSecureContext);
			if (nav && nav.clipboard && isSecure) {
				await nav.clipboard.writeText(payload);
				Alert.alert('Copied', 'Content copied. Paste it into your app.');
				return;
			}
		} catch {}
		// 4) Final fallback: RN Share without assumptions
		try {
			await Share.share({ message: payload, title: 'Daily Peace' });
		} catch {}
	};

  return (
    <View style={{ flex: 1, backgroundColor: "#0B1016", paddingHorizontal: 16, paddingTop: 24 }}>
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
        <Pressable onPress={() => navigation.goBack()} style={{ paddingHorizontal: 12, paddingVertical: 8, borderRadius: 10, backgroundColor: 'rgba(255,255,255,0.12)' }}>
          <Text style={{ color: '#EAF2FF', fontWeight: '600' }}>Back</Text>
        </Pressable>
        <Text style={{ color: "#FFFFFF", fontSize: 22, fontWeight: "700" }}>
          {CATEGORY_LABEL[category] || category}
        </Text>
        <Pressable onPress={() => navigation.navigate('Home')} style={{ paddingHorizontal: 12, paddingVertical: 8, borderRadius: 10, backgroundColor: 'rgba(255,255,255,0.12)' }}>
          <Text style={{ color: '#EAF2FF', fontWeight: '600' }}>Home</Text>
        </Pressable>
      </View>
      <FlatList
        data={items}
        keyExtractor={(i) => i.id}
        ItemSeparatorComponent={() => <View style={{ height: 10 }} />}
        renderItem={({ item }) => {
          const savedCount = item.verses.filter(v => favoriteRefs.has(v)).length;
          const anySaved = savedCount > 0;
          return (
            <View style={{ position: 'relative', borderRadius: 16, backgroundColor: '#141B23', borderWidth: 1, borderColor: 'rgba(255,255,255,0.1)', paddingHorizontal: 16, paddingVertical: 16, marginVertical: 4 }} pointerEvents="auto">
              {/* Decorative overlay example (ensure it never captures clicks) */}
              {/* <Image source={require('../../assets/images/logo-dove.png')} style={{ position: 'absolute', right: -10, bottom: -10, width: 180, height: 180, opacity: 0.06, zIndex: 0, pointerEvents: 'none' }} /> */}

              <Text style={{ color: '#FFFFFF', fontSize: 16, lineHeight: 22, marginBottom: 12 }}>{item.text}</Text>
              {anySaved && (
                <View style={{ alignSelf: 'flex-start', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 8, backgroundColor: 'rgba(34,197,94,0.18)', borderWidth: 1, borderColor: 'rgba(34,197,94,0.35)', marginBottom: 8 }}>
                  <Text style={{ color: '#86EFAC', fontWeight: '700', fontSize: 12 }}>Saved</Text>
                </View>
              )}

              <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: 12 }}>
                {item.verses.map((v) => (
                  <View key={v} style={{ paddingHorizontal: 8, paddingVertical: 4, borderRadius: 8, backgroundColor: 'rgba(255,255,255,0.1)', borderWidth: 1, borderColor: 'rgba(255,255,255,0.1)' }}>
                    <Text style={{ color: '#A5B4FC', fontWeight: '700', fontSize: 13 }}>{v}</Text>
                  </View>
                ))}
              </View>

              <View style={{ position: 'relative', zIndex: 1, flexDirection: 'row', flexWrap: 'wrap', gap: 12, paddingTop: 8 }}>
                <TouchableOpacity
                  activeOpacity={0.85}
                  onPress={() => navigation.navigate('Chat', { seedText: item.text })}
                  style={{ paddingHorizontal: 12, paddingVertical: 8, borderRadius: 12, backgroundColor: '#3B82F6' }}
                >
                  <Text style={{ color: '#fff', fontWeight: '600' }}>Open in Chat</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  activeOpacity={0.85}
                  onPress={() => copyText(`${item.text}\n\n${item.verses.join(' · ')}`)}
                  style={{ paddingHorizontal: 12, paddingVertical: 8, borderRadius: 12, backgroundColor: 'rgba(255,255,255,0.1)', borderWidth: 1, borderColor: 'rgba(255,255,255,0.1)' }}
                >
                  <Text style={{ color: '#EAF2FF' }}>Copy</Text>
                </TouchableOpacity>

					<TouchableOpacity
						activeOpacity={0.85}
						onPress={() => shareContent(item.text, item.verses)}
						style={{ paddingHorizontal: 12, paddingVertical: 8, borderRadius: 12, backgroundColor: 'rgba(255,255,255,0.1)', borderWidth: 1, borderColor: 'rgba(255,255,255,0.1)' }}
					>
						<Text style={{ color: '#EAF2FF' }}>Share</Text>
					</TouchableOpacity>

                <TouchableOpacity
                  activeOpacity={0.85}
                  onPress={() => saveVerses(item.verses)}
                  style={{ paddingHorizontal: 12, paddingVertical: 8, borderRadius: 12, backgroundColor: 'rgba(255,255,255,0.1)', borderWidth: 1, borderColor: 'rgba(255,255,255,0.1)' }}
                >
                  <Text style={{ color: '#EAF2FF' }}>{anySaved ? `Save More` : `Save`}</Text>
                </TouchableOpacity>
              </View>
            </View>
          );
        }}
      />
    </View>
  );
}


