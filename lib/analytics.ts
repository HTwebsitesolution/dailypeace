// lib/analytics.ts
import PostHog from 'posthog-react-native';
import * as Sentry from '@sentry/react-native';
import Constants from 'expo-constants';

// Initialize PostHog Analytics
const POSTHOG_KEY = Constants.expoConfig?.extra?.POSTHOG_KEY || process.env.EXPO_PUBLIC_POSTHOG_KEY;
const POSTHOG_HOST = Constants.expoConfig?.extra?.POSTHOG_HOST || process.env.EXPO_PUBLIC_POSTHOG_HOST;

if (POSTHOG_KEY) {
  PostHog.setup(POSTHOG_KEY, { host: POSTHOG_HOST });
}

// Initialize Sentry Error Tracking  
const SENTRY_DSN = Constants.expoConfig?.extra?.SENTRY_DSN || process.env.EXPO_PUBLIC_SENTRY_DSN;

if (SENTRY_DSN) {
  Sentry.init({
    dsn: SENTRY_DSN,
    tracesSampleRate: 0.2,
    debug: __DEV__,
  });
}

// Analytics Helper Functions
export const analytics = {
  // Track user events
  track: (eventName: string, properties?: Record<string, any>) => {
    if (POSTHOG_KEY) {
      PostHog.capture(eventName, properties);
    }
  },

  // Track user properties
  identify: (userId: string, properties?: Record<string, any>) => {
    if (POSTHOG_KEY) {
      PostHog.identify(userId, properties);
    }
  },

  // Track screens
  screen: (screenName: string, properties?: Record<string, any>) => {
    if (POSTHOG_KEY) {
      PostHog.screen(screenName, properties);
    }
  },

  // Error tracking
  captureError: (error: Error, context?: Record<string, any>) => {
    console.error(error);
    if (SENTRY_DSN) {
      Sentry.withScope((scope) => {
        if (context) {
          Object.keys(context).forEach(key => {
            scope.setContext(key, context[key]);
          });
        }
        Sentry.captureException(error);
      });
    }
  },

  // Custom message logging
  captureMessage: (message: string, level: 'info' | 'warning' | 'error' = 'info') => {
    if (SENTRY_DSN) {
      Sentry.captureMessage(message, level);
    }
  }
};

export { PostHog, Sentry };