// lib/notifications.ts
import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { analytics } from './analytics';

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
        analytics.track('notification_permission_denied');
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
      
      analytics.track('notification_permission_granted', { token: token.data });
      return token.data;
    } catch (error) {
      analytics.captureError(error as Error, { context: 'notification_init' });
      return null;
    }
  },

  // Schedule daily verse notification
  async scheduleDailyVerse() {
    try {
      await Notifications.cancelAllScheduledNotificationsAsync();
      
      const verses = [
        { text: "Let not your heart be troubled: ye believe in God, believe also in me.", ref: "John 14:1" },
        { text: "Peace I leave with you, my peace I give unto you.", ref: "John 14:27" },
        { text: "But seek ye first the kingdom of God, and his righteousness.", ref: "Matthew 6:33" },
        { text: "Fear not, little flock; for it is your Father's good pleasure to give you the kingdom.", ref: "Luke 12:32" }
      ];

      const randomVerse = verses[Math.floor(Math.random() * verses.length)];

      await Notifications.scheduleNotificationAsync({
        content: {
          title: "Daily Peace 🙏",
          body: `"${randomVerse.text}" - ${randomVerse.ref}`,
          sound: 'default',
        },
        trigger: {
          hour: 9,
          minute: 0,
          repeats: true,
        },
      });

      analytics.track('daily_notification_scheduled');
    } catch (error) {
      analytics.captureError(error as Error, { context: 'schedule_notification' });
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

      analytics.track('encouragement_sent', { title, delaySeconds });
    } catch (error) {
      analytics.captureError(error as Error, { context: 'send_encouragement' });
    }
  }
};