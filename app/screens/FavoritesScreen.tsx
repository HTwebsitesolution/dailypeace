import React, { useEffect, useState } from "react";
import { View, Text, FlatList, Pressable, Alert, Share, Platform } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { getFavorites, removeFavorite, FavoriteVerse } from "../../lib/verseFavorites";
import { APP_LINK } from "../../lib/config";

export default function FavoritesScreen() {
  const navigation = useNavigation<any>();
  const [favorites, setFavorites] = useState<FavoriteVerse[]>([]);

  const load = async () => {
    try {
      const list = await getFavorites();
      setFavorites(list.sort((a, b) => b.addedAt - a.addedAt));
    } catch {}
  };

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', load);
    load();
    return unsubscribe;
  }, [navigation]);

  const shareFav = async (f: FavoriteVerse) => {
    const base = f.text ? `${f.ref}: ${f.text}` : f.ref;
    const payload = `${base}\n\nGet the app: ${APP_LINK}`;
    // Prefer web share if available
    try {
      const nav: any = (globalThis as any)?.navigator;
      if (nav && nav.share) {
        await nav.share({ title: 'Daily Peace', text: payload });
        return;
      }
    } catch {}
    // Native share
    try {
      if (Platform.OS !== 'web') {
        await Share.share({ title: 'Daily Peace', message: payload });
        return;
      }
    } catch {}
    // Fallback: copy to clipboard if available
    try {
      const Clipboard = require("expo-clipboard");
      if (Clipboard?.setStringAsync) {
        await Clipboard.setStringAsync(payload);
        Alert.alert('Copied', 'Favorite copied to clipboard.');
        return;
      }
    } catch {}
  };

  return (
    <View style={{ flex: 1, backgroundColor: "#0B1016", paddingHorizontal: 16, paddingTop: 24 }}>
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
        <Pressable onPress={() => navigation.goBack()} style={{ paddingHorizontal: 12, paddingVertical: 8, borderRadius: 10, backgroundColor: 'rgba(255,255,255,0.12)' }}>
          <Text style={{ color: '#EAF2FF', fontWeight: '600' }}>Back</Text>
        </Pressable>
        <Text style={{ color: "#FFFFFF", fontSize: 22, fontWeight: "700" }}>Favorites</Text>
        <Pressable onPress={() => navigation.navigate('Home')} style={{ paddingHorizontal: 12, paddingVertical: 8, borderRadius: 10, backgroundColor: 'rgba(255,255,255,0.12)' }}>
          <Text style={{ color: '#EAF2FF', fontWeight: '600' }}>Home</Text>
        </Pressable>
      </View>

      {favorites.length === 0 ? (
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
          <Text style={{ color: '#9FB0C3' }}>No favorites yet. Save verses from Collections or Chat.</Text>
        </View>
      ) : (
        <FlatList
          data={favorites}
          keyExtractor={(f) => f.ref}
          ItemSeparatorComponent={() => <View style={{ height: 10 }} />}
          renderItem={({ item: f }) => (
            <View style={{ borderRadius: 16, backgroundColor: '#141B23', borderWidth: 1, borderColor: 'rgba(255,255,255,0.1)', paddingHorizontal: 16, paddingVertical: 16 }}>
              <Text style={{ color: '#A5B4FC', fontWeight: '700', marginBottom: 6 }}>{f.ref}</Text>
              {!!f.text && (
                <Text style={{ color: '#EAF2FF', lineHeight: 20 }}>{f.text}</Text>
              )}
              <View style={{ flexDirection: 'row', gap: 12, marginTop: 12 }}>
                <Pressable onPress={() => shareFav(f)} style={{ paddingHorizontal: 12, paddingVertical: 8, borderRadius: 12, backgroundColor: 'rgba(255,255,255,0.1)', borderWidth: 1, borderColor: 'rgba(255,255,255,0.1)' }}>
                  <Text style={{ color: '#EAF2FF' }}>Share</Text>
                </Pressable>
                <Pressable onPress={async () => { await removeFavorite(f.ref); load(); }} style={{ paddingHorizontal: 12, paddingVertical: 8, borderRadius: 12, backgroundColor: 'rgba(239,68,68,0.25)' }}>
                  <Text style={{ color: '#FCA5A5' }}>Remove</Text>
                </Pressable>
              </View>
            </View>
          )}
        />
      )}
    </View>
  );
}


