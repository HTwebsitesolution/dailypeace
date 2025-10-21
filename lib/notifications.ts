// lib/notifications.ts
import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { track } from './analytics';

// Configure notification behavior
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

export const notifications = {
  // Request permission and get push token
  async initialize() {
    try {
      const { status: existingStatus } = await Notifications.getPermissionsAsync();
      let finalStatus = existingStatus;
      
      if (existingStatus !== 'granted') {
        const { status } = await Notifications.requestPermissionsAsync();
        finalStatus = status;
      }
      
      if (finalStatus !== 'granted') {
        track('notification_permission_denied');
        return null;
      }

      if (Platform.OS === 'android') {
        await Notifications.setNotificationChannelAsync('daily-peace', {
          name: 'Daily Peace',
          importance: Notifications.AndroidImportance.MAX,
          vibrationPattern: [0, 250, 250, 250],
          lightColor: '#2F80ED',
        });
      }

      const token = await Notifications.getExpoPushTokenAsync();
      await AsyncStorage.setItem('push_token', token.data);
      
      track('notification_permission_granted', { token: token.data });
      return token.data;
    } catch (error) {
      track('notification_init_error', { error: (error as Error).message });
      return null;
    }
  },

  // Schedule daily verse notification
  async scheduleDailyVerse(hour: number = 8, minute: number = 0) {
    try {
      await Notifications.cancelAllScheduledNotificationsAsync();
      
      // Load the rotating reflections
      let reflections;
      try {
        reflections = require('../assets/rotations/messages.json');
      } catch {
        // Fallback messages if file not available
        reflections = [
          { id: "fallback_1", text: "Peace I leave with you, my peace I give unto you.", verses: ["John 14:27"] },
          { id: "fallback_2", text: "Let not your heart be troubled: ye believe in God, believe also in me.", verses: ["John 14:1"] }
        ];
      }

      // Pick a different reflection each day using date as seed
      const dayOfYear = Math.floor((Date.now() - new Date(new Date().getFullYear(), 0, 0).getTime()) / (1000 * 60 * 60 * 24));
      const reflection = reflections[dayOfYear % reflections.length];
      
      // Create beautiful notification content
      const title = "Daily Peace 🙏";
      const body = reflection.text.length > 120 
        ? reflection.text.substring(0, 117) + "..." 
        : reflection.text;

      await Notifications.scheduleNotificationAsync({
        content: {
          title,
          body,
          sound: 'default',
          data: { 
            type: 'daily_peace', 
            timestamp: Date.now(),
            reflectionId: reflection.id,
            category: reflection.category,
            verses: reflection.verses?.join(', ')
          }
        },
        trigger: {
          hour,
          minute,
          repeats: true,
        },
      });

      // Store the schedule settings
      await AsyncStorage.setItem('daily_notification_time', JSON.stringify({ hour, minute, enabled: true }));
      
      track('daily_notification_scheduled', { hour, minute });
    } catch (error) {
      track('schedule_notification_error', { error: (error as Error).message });
    }
  },

  // Get current notification schedule
  async getNotificationSchedule() {
    try {
      const stored = await AsyncStorage.getItem('daily_notification_time');
      if (stored) {
        return JSON.parse(stored);
      }
      return { hour: 8, minute: 0, enabled: false };
    } catch {
      return { hour: 8, minute: 0, enabled: false };
    }
  },

  // Cancel daily notifications
  async cancelDailyNotifications() {
    try {
      await Notifications.cancelAllScheduledNotificationsAsync();
      await AsyncStorage.setItem('daily_notification_time', JSON.stringify({ hour: 8, minute: 0, enabled: false }));
      track('daily_notifications_cancelled');
    } catch (error) {
      track('cancel_notifications_error', { error: (error as Error).message });
    }
  },

  // Get daily reflection message
  getDailyReflection(dayOffset: number = 0) {
    try {
      const reflections = require('../assets/rotations/messages.json');
      const dayOfYear = Math.floor((Date.now() - new Date(new Date().getFullYear(), 0, 0).getTime()) / (1000 * 60 * 60 * 24)) + dayOffset;
      return reflections[dayOfYear % reflections.length];
    } catch {
      return {
        id: "fallback",
        category: "peace_calm", 
        text: "Peace I leave with you, my peace I give unto you. Let not your heart be troubled.",
        verses: ["John 14:27", "John 14:1"]
      };
    }
  },

  // Get reflection by category
  getReflectionByCategory(category: string) {
    try {
      const reflections = require('../assets/rotations/messages.json');
      const categoryReflections = reflections.filter((r: any) => r.category === category);
      if (categoryReflections.length === 0) return this.getDailyReflection();
      
      const randomIndex = Math.floor(Math.random() * categoryReflections.length);
      return categoryReflections[randomIndex];
    } catch {
      return this.getDailyReflection();
    }
  },

  // Send encouragement notification
  async sendEncouragement(title: string, message: string, delaySeconds: number = 0) {
    try {
      await Notifications.scheduleNotificationAsync({
        content: {
          title,
          body: message,
          sound: 'default',
        },
        trigger: delaySeconds > 0 ? { seconds: delaySeconds } : null,
      });

      track('encouragement_sent', { title, delaySeconds });
    } catch (error) {
      track('encouragement_error', { error: (error as Error).message });
    }
  }
};