
# Daily Peace — Expo + Netlify starter

This repo is a **ready-to-run starter** for the Daily Peace app:
- Expo (React Native) mobile app (iOS/Android)
- Netlify Functions backend (`/generate`, `/transcribe`)
- Local verse seeds + KJV sample
- Voice input (record → Whisper transcription) and voice output (TTS)

## Quick start

1) **Install & run**
```bash
npm i
npx expo start
```

2) **Configure backend (Netlify)**
- Connect this repo to Netlify (or copy `netlify/` to your API repo)
- Add env var: `OPENAI_API_KEY=sk-...`
- Deploy → custom domain: https://dailypeace.life (or use Netlify subdomain)

3) **Set API base URL**
- In `lib/config.ts` set `API_BASE` to your domain (e.g., `https://dailypeace.life/.netlify/functions`).
- For local dev with `netlify dev`, set `EXPO_PUBLIC_API_BASE=http://localhost:8888/.netlify/functions`

4) **Build for TestFlight / Play**
```bash
npm i -D eas-cli
eas build:configure
eas build --platform ios --profile preview
eas build --platform android --profile preview
```

## Notes
- Starter includes one seed (`fear_anxiety.json`) and a tiny KJV sample. Add remaining 17 seeds + full KJV JSONL later.
- All AI calls happen **server-side**. Never put your OpenAI key in the app.
# Deploy trigger 10/21/2025 15:52:14
