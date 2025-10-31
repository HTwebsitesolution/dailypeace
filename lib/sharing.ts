// lib/sharing.ts
import * as Sharing from 'expo-sharing';
import { captureRef } from 'react-native-view-shot';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { track } from './analytics';
import { APP_LINK } from './config';

export const sharing = {
  // Share a text reflection
  async shareReflection(reflection: string, verse?: string) {
    try {
      const shareText = verse 
        ? `${reflection}\n\n"${verse}"\n\nShared from Daily Peace app 🙏\nGet the app: ${APP_LINK}`
        : `${reflection}\n\nShared from Daily Peace app 🙏\nGet the app: ${APP_LINK}`;

      if (await Sharing.isAvailableAsync()) {
        await Sharing.shareAsync(shareText);
        track('reflection_shared', { hasVerse: !!verse });
      } else {
        // Fallback for platforms without native sharing
        console.log('Sharing not available');
      }
    } catch (error) {
      track('share_reflection_error', { error: (error as Error).message });
    }
  },

  // Capture and share conversation as image
  async shareConversationImage(viewRef: any) {
    try {
      const imageUri = await captureRef(viewRef, {
        format: 'png',
        quality: 0.8,
        result: 'tmpfile',
      });

      if (await Sharing.isAvailableAsync()) {
        await Sharing.shareAsync(imageUri, {
          mimeType: 'image/png',
          dialogTitle: 'Share your Daily Peace conversation',
        });
        track('conversation_image_shared');
      }
    } catch (error) {
      track('share_image_error', { error: (error as Error).message });
    }
  },

  // Save favorite reflection
  async saveFavorite(reflection: string, verse: string, date: string) {
    try {
      const favorites = await this.getFavorites();
      const newFavorite = {
        id: Date.now().toString(),
        reflection,
        verse,
        date,
        timestamp: Date.now(),
      };

      const updatedFavorites = [newFavorite, ...favorites].slice(0, 50); // Keep max 50
      await AsyncStorage.setItem('favorites', JSON.stringify(updatedFavorites));
      
      track('reflection_favorited');
      return newFavorite;
    } catch (error) {
      track('save_favorite_error', { error: (error as Error).message });
      return null;
    }
  },

  // Get saved favorites
  async getFavorites() {
    try {
      const stored = await AsyncStorage.getItem('favorites');
      return stored ? JSON.parse(stored) : [];
    } catch (error) {
      track('get_favorites_error', { error: (error as Error).message });
      return [];
    }
  },

  // Remove favorite
  async removeFavorite(id: string) {
    try {
      const favorites = await this.getFavorites();
      const updated = favorites.filter((f: any) => f.id !== id);
      await AsyncStorage.setItem('favorites', JSON.stringify(updated));
      
      track('favorite_removed', { id });
    } catch (error) {
      track('remove_favorite_error', { error: (error as Error).message });
    }
  }
};