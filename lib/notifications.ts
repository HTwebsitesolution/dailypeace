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
      
      const inspiringMessages = [
        { title: "Your Daily Peace 🌅", body: "Good morning! Take a moment to find peace in God's presence today." },
        { title: "Morning Blessing ✨", body: "\"Peace I leave with you, my peace I give unto you.\" - John 14:27" },
        { title: "Start with Peace 🙏", body: "\"Let not your heart be troubled: ye believe in God, believe also in me.\" - John 14:1" },
        { title: "Divine Encouragement 💫", body: "\"But seek ye first the kingdom of God, and his righteousness.\" - Matthew 6:33" },
        { title: "Fear Not 🕊️", body: "\"Fear not, little flock; for it is your Father's good pleasure to give you the kingdom.\" - Luke 12:32" },
        { title: "Rest in Him ⭐", body: "\"Come unto me, all ye that labour and are heavy laden, and I will give you rest.\" - Matthew 11:28" },
        { title: "Trust His Plan 🌟", body: "\"For I know the thoughts that I think toward you, saith the Lord, thoughts of peace.\" - Jeremiah 29:11" },
        { title: "His Strength Today 💪", body: "\"I can do all things through Christ which strengtheneth me.\" - Philippians 4:13" },
        { title: "Be Still & Know 🧘‍♀️", body: "\"Be still, and know that I am God.\" - Psalm 46:10" },
        { title: "Renewed Each Morning 🌄", body: "\"His compassions fail not. They are new every morning.\" - Lamentations 3:22-23" }
      ];

      // Pick a different message each day using date as seed
      const dayOfYear = Math.floor((Date.now() - new Date(new Date().getFullYear(), 0, 0).getTime()) / (1000 * 60 * 60 * 24));
      const message = inspiringMessages[dayOfYear % inspiringMessages.length];

      await Notifications.scheduleNotificationAsync({
        content: {
          title: message.title,
          body: message.body,
          sound: 'default',
          data: { type: 'daily_peace', timestamp: Date.now() }
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