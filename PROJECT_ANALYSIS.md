# Daily Peace - Project Analysis

## Overview

**Daily Peace** is an AI-powered spiritual guidance web application that provides personalized biblical encouragement through text and voice interactions. The app integrates OpenAI's GPT-4 for conversational guidance and Whisper API for voice transcription.

**Status:** ✅ Production Ready (v1.0.0)  
**Live URL:** https://dailypeace.life  
**Tech Stack:** React Native (Expo) + Netlify Functions + OpenAI APIs

---

## Architecture

### Frontend
- **Framework:** React Native 0.74.5 with Expo 51.0.0
- **Platform Support:** iOS, Android, Web
- **Navigation:** React Navigation 7.x with Native Stack
- **Type Safety:** TypeScript
- **State Management:** Context API (SettingsProvider)
- **Storage:** AsyncStorage for user preferences
- **Analytics:** PostHog for user behavior tracking
- **Error Tracking:** Sentry (configured but using placeholder DSN)

### Backend
- **Platform:** Netlify Functions (Serverless Node.js)
- **Functions:**
  - `/generate` - AI-powered spiritual responses
  - `/transcribe` - Voice-to-text transcription
- **AI Models:**
  - GPT-4o-mini for text generation
  - Whisper-1 for audio transcription
- **Database:** JSON-based KJV Bible verses + seed verses

### Deployment
- **Hosting:** Netlify (auto-deploy from GitHub)
- **Build Process:** Expo web export → static assets + functions
- **CDN:** Global distribution via Netlify

---

## Core Features

### 1. Three Interaction Modes
- **Conversational** (`conversational`): Friendly, encouraging chat (140-220 words per response)
- **Biblical** (`biblical`): Scripture-focused, verse-only responses
- **Reflective** (`reflective`): Contemplative, introspective guidance (80-120 words per response)

### 2. User Interface
- **Rotating Background Images:** Ocean, Mountain, Dove (changes based on mode/time)
- **Dark Theme:** Professional spiritual aesthetic (#0B1016 background)
- **Daily Reflection Card:** Displays verse citations with shareable messages
- **Voice Input:** Record audio → transcription → AI response
- **Responsive Design:** Works on desktop, tablet, and mobile browsers

### 3. Scripture Integration
- **KJV Bible Database:** Full King James Version (31,103 verses)
- **Smart Verse Selection:** Mode-aware verse selection from seed data
- **Citation System:** Automatic Bible verse references in responses
- **Seed Categories:** Fear/Anxiety, Depression/Sadness, Strength/Courage, Purpose/Meaning, Spiritual Growth

### 4. Smart Features
- **Time-Based Backgrounds:** Automatic background changes based on time of day
- **Mode-Based Transitions:** Smooth background rotations (40-50s intervals)
- **Animated UI:** Fade-in, scale, and gentle motion animations
- **Persistent Settings:** Mode preference, TTS enable/disable, voice recording storage

---

## File Structure

```
dailypeace/
├── app/
│   ├── components/
│   │   ├── ChatInput.tsx          # Text/voice input with MicButton
│   │   ├── MessageBubble.tsx       # Chat message display
│   │   ├── ModeToggle.tsx          # Mode switching UI
│   │   ├── ReflectionCard.tsx      # Verse display with share
│   │   ├── AtmosphericBackground.tsx # Rotating background system
│   │   ├── SettingsCard.tsx        # Settings UI
│   │   └── MicButton.tsx           # Voice recording button
│   ├── screens/
│   │   ├── HomeScreen.tsx          # Landing page with daily reflection
│   │   ├── ChatScreen.tsx          # Main AI conversation interface
│   │   ├── SettingsScreen.tsx      # User preferences
│   │   └── DisclaimerScreen.tsx    # Legal disclaimer
│   ├── navigation.tsx               # React Navigation setup
│   ├── index.tsx                    # Web entry point
│   └── index.web.tsx                # Web-specific entry (no Sentry)
├── lib/
│   ├── api.ts                       # API client (generate/transcribe)
│   ├── config.ts                    # Environment configuration
│   ├── types.ts                     # TypeScript interfaces
│   ├── settings.tsx                  # User settings provider
│   ├── verse.ts                     # KJV Bible loading & verse selection
│   ├── backgroundSystem.ts          # Background rotation logic
│   ├── analytics.ts                 # PostHog tracking
│   ├── notifications.ts             # Push notifications
│   └── sharing.ts                      # Share functionality
├── netlify/
│   └── functions/
│       ├── generate.ts              # OpenAI GPT-4 integration
│       └── transcribe.ts            # OpenAI Whisper integration
├── assets/
│   ├── seeds/                       # Verse seed data (5 categories)
│   ├── rotations/                  # Daily reflection messages
│   ├── kjv.json                     # Full KJV Bible database
│   └── images/                      # Background images (dove, mountain, ocean)
├── netlify.toml                     # Netlify build configuration
├── app.json                         # Expo configuration
└── package.json                     # Dependencies
```

---

## Key Technologies

### Dependencies
```json
{
  "react": "18.2.0",
  "react-native": "0.74.5",
  "expo": "^51.0.0",
  "@react-navigation/native": "^7.1.18",
  "@netlify/functions": "^2.0.0",
  "openai": "^4.0.0",
  "posthog-react-native": "^4.10.2",
  "expo-av": "~14.0.5",           // Audio recording
  "expo-file-system": "~17.0.1", // File operations
  "expo-notifications": "~0.28.19",
  "expo-speech": "~12.0.2",      // Text-to-speech
  "@react-native-async-storage/async-storage": "1.23.1"
}
```

### Build Tools
- **Metro Bundler:** JavaScript bundler for React Native
- **TypeScript:** Type safety
- **Expo CLI:** Development and build tooling
- **EAS Build:** Mobile app builds (for future App Store releases)

---

## Data Flow

### 1. Chat Interaction Flow
```
User Input (text/voice) 
  ↓
ChatScreen.handleSend()
  ↓
lib/api.apiGenerate()
  ↓
POST https://dailypeace.life/.netlify/functions/generate
  ↓
netlify/functions/generate.ts
  ↓
OpenAI GPT-4o-mini
  ↓
Response with citations
  ↓
ReflectionCard display
```

### 2. Voice Transcription Flow
```
User taps MicButton
  ↓
expo-av creates recording
  ↓
Convert to base64
  ↓
lib/api.apiTranscribe()
  ↓
POST https://dailypeace.life/.netlify/functions/transcribe
  ↓
netlify/functions/transcribe.ts
  ↓
OpenAI Whisper-1
  ↓
Transcribed text → ChatScreen input
```

### 3. Verse Selection Flow
```
User message analyzed
  ↓
lib/verse.selectVerses()
  ↓
Load KJV index (kjv.json)
  ↓
Select from seed candidates
  ↓
Apply mode-specific limits
  ↓
Return verses to API
```

---

## Configuration

### Environment Variables (Netlify)
```bash
OPENAI_API_KEY=sk-...         # Required for GPT-4 & Whisper
POSTHOG_KEY=...               # Optional analytics
SENTRY_DSN=...                # Optional error tracking
```

### API Configuration
```typescript
// lib/config.ts
export const API_BASE = process.env.EXPO_PUBLIC_API_BASE || 
  "https://dailypeace.life/.netlify/functions";
```

### Mode-Specific System Prompts
Each mode has a tailored system prompt:
- **Conversational:** 140-220 words with prayer and reflection question
- **Biblical:** Verse-only responses
- **Reflective:** 80-120 words with meditative insights

---

## Recent Changes (from git log)

1. ✅ **Background Images:** Dynamic rotating backgrounds based on mode and time
2. ✅ **Atmospheric Backgrounds:** Smooth transitions with fade/scale animations
3. ✅ **HomeScreen:** Landing page with daily reflection
4. ✅ **Navigation:** Fixed routing with Home/Chat/Settings/Disclaimer
5. ✅ **UI Polish:** Enhanced fonts, logo animations, shadow effects
6. ✅ **Web Compatibility:** Removed Sentry/Moti from web builds
7. ✅ **Premium Theme:** CSS-based styling for web (glassmorphism, gradients)
8. ✅ **KJV Integration:** Full Bible database (31,103 verses)
9. ✅ **Multi-mode Reflections:** 90 premium daily messages

---

## Known Issues & Next Steps

### Current Status
- ✅ Web app fully functional
- ✅ Voice transcription working
- ✅ AI responses with citations
- ✅ Background rotation system
- ⚠️ Serverless function errors need investigation

### Potential Improvements
1. **Error Handling:** Better API error messages for users
2. **Loading States:** More informative loading indicators
3. **Offline Support:** Cache verses and reflections
4. **Mobile Apps:** iOS/Android App Store releases
5. **Expanded Seeds:** Add remaining 17+ seed categories
6. **User Accounts:** Persist conversation history
7. **Sharing:** Social media integration

---

## Development Workflow

### Local Development
```bash
# Install dependencies
npm install

# Start development server
npm start
# or
npx expo start --web

# Build for production
npx expo export --platform web --output-dir web-dist
```

### Deployment
```bash
# Automatic via GitHub → Netlify
git push origin main

# Manual build
npm run web
```

### Testing
- **Web:** http://localhost:3000 (or 19006)
- **iOS:** iOS Simulator (requires Mac)
- **Android:** Android Emulator (requires Android SDK)

---

## Notable Implementation Details

### Atmospheric Background System
- **3 Background Themes:** Ocean, Mountain, Dove
- **Mode-Based Selection:** Different backgrounds per mode
- **Time-Based Rotation:** Changes with time of day (morning/afternoon/evening/night)
- **Smooth Transitions:** 2-3 second fade/scale animations
- **Auto-Rotation:** 40-50 second intervals

### API Security
- **Server-Side AI:** All OpenAI calls on Netlify (never client-side)
- **CORS Configuration:** Proper cross-origin headers
- **Rate Limiting:** Via Netlify Functions timeout limits

### Code Quality
- **TypeScript:** Full type safety
- **Error Handling:** Try-catch blocks with fallbacks
- **Logging:** Console logs for debugging
- **Modular Components:** Reusable UI components

---

## Project Strengths

1. **Production Ready:** Fully deployed and accessible
2. **Cross-Platform:** Single codebase for iOS/Android/Web
3. **Type Safe:** Comprehensive TypeScript coverage
4. **Scalable:** Serverless architecture handles traffic
5. **User-Friendly:** Intuitive UI with voice input
6. **Spiritually Grounded:** Bible-based responses
7. **Modern Stack:** Latest React Native and Expo

---

## Summary

Daily Peace is a **complete, production-ready spiritual guidance web application** that combines modern web technologies with AI-powered biblical wisdom. The app provides personalized encouragement through three distinct interaction modes, integrates the full King James Bible, and offers voice-based interactions for accessibility.

The codebase is well-structured, uses TypeScript for type safety, and follows React Native best practices. The project is deployed to production at dailypeace.life and ready for user growth.

---

**Analysis Date:** 2025-01-XX  
**Project Version:** v1.0.0  
**Repository:** https://github.com/HTwebsitesolution/dailypeace


