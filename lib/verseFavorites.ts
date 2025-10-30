import AsyncStorage from "@react-native-async-storage/async-storage";

const KEY = "@dailypeace/favorites/verses/v1";

export type FavoriteVerse = { ref: string; text?: string; addedAt: number };

export async function getFavorites(): Promise<FavoriteVerse[]> {
  try {
    const raw = await AsyncStorage.getItem(KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed)) return parsed;
    return [];
  } catch {
    return [];
  }
}

export async function addFavorite(v: FavoriteVerse): Promise<void> {
  const current = await getFavorites();
  const exists = current.some(x => x.ref === v.ref);
  const next = exists ? current : [...current, v];
  await AsyncStorage.setItem(KEY, JSON.stringify(next));
}

export async function removeFavorite(ref: string): Promise<void> {
  const current = await getFavorites();
  const next = current.filter(x => x.ref !== ref);
  await AsyncStorage.setItem(KEY, JSON.stringify(next));
}

