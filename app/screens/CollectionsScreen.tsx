import React, { useMemo } from "react";
import { View, Text, Pressable, FlatList } from "react-native";
import { addFavorite } from "../../lib/verseFavorites";

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
        renderItem={({ item }) => (
          <View style={{ borderRadius: 16, backgroundColor: "#141B23", borderWidth: 1, borderColor: "rgba(255,255,255,0.1)", paddingHorizontal: 16, paddingVertical: 16 }}>
            <Text style={{ color: "#FFFFFF", fontSize: 16, lineHeight: 22 }}>{item.text}</Text>
            <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 8, marginTop: 12 }}>
              {item.verses.map((v) => (
                <View key={v} style={{ paddingHorizontal: 8, paddingVertical: 4, borderRadius: 8, backgroundColor: "rgba(255,255,255,0.1)", borderWidth: 1, borderColor: "rgba(255,255,255,0.1)" }}>
                  <Text style={{ color: "#A5B4FC", fontWeight: "700", fontSize: 13 }}>{v}</Text>
                </View>
              ))}
            </View>
            <View style={{ flexDirection: 'row', gap: 10, marginTop: 12 }}>
              <Pressable onPress={() => navigation.navigate('Chat', { seedText: item.text })} style={{ paddingHorizontal: 10, paddingVertical: 6, borderRadius: 8, backgroundColor: '#3B82F6' }}>
                <Text style={{ color: '#fff', fontWeight: '600' }}>Open in Chat</Text>
              </Pressable>
              <Pressable onPress={async () => { try { await navigator.clipboard.writeText(`${item.text}\n\n${item.verses.join(', ')}`); } catch {} }} style={{ paddingHorizontal: 10, paddingVertical: 6, borderRadius: 8, backgroundColor: 'rgba(255,255,255,0.12)' }}>
                <Text style={{ color: '#EAF2FF' }}>Copy</Text>
              </Pressable>
              <Pressable onPress={async () => { for (const v of item.verses) { await addFavorite({ ref: v, text: undefined, addedAt: Date.now() }); } }} style={{ paddingHorizontal: 10, paddingVertical: 6, borderRadius: 8, backgroundColor: 'rgba(255,255,255,0.12)' }}>
                <Text style={{ color: '#EAF2FF' }}>Save</Text>
              </Pressable>
            </View>
          </View>
        )}
      />
    </View>
  );
}


