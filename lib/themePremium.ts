/* lib/themePremium.ts
   Reusable class bundles + RN style helpers for premium look.
*/

import { Platform } from "react-native";

export const premium = {
  /* Layout overlays */
  heroOverlay: "absolute inset-0 bg-gradient-to-b from-black/50 via-black/40 to-[#0B1016]/90",
  vignette: "absolute inset-0", // use web CSS .vignette; on mobile keep gradient layer

  /* Cards */
  glassCard: "rounded-3xl border border-white/10 bg-white/10 backdrop-blur-md shadow-lg",
  glassDeep: "rounded-3xl border border-white/10 bg-[#141B23]/60 backdrop-blur-xl shadow-2xl",

  /* Chips / verse pills */
  chip: "px-2 py-1 rounded-lg bg-white/10 border border-white/10",
  chipText: "text-[13px] font-semibold text-[#A5B4FC]",

  /* Buttons */
  btnPrimary: "px-5 py-3 rounded-2xl bg-primary shadow-lg",
  btnGradient: Platform.select({
    web: "btn-gradient", // from CSS file
    default: "px-5 py-3 rounded-2xl bg-primary shadow-lg"
  }),

  /* Headings & text */
  h1: "text-white font-bold text-[28px]",
  subtitle: "text-[#9FB0C3] text-[14.5px]",
  body: "text-white text-[16px] leading-6",

  /* Helpful containers */
  padded: "px-4 py-3",
  section: "px-4 py-4",

  /* Inline RN style helpers (NativeWind can't do text-shadow) */
  styles: {
    titleGlow: {
      textShadowColor: "rgba(255,255,255,0.18)",
      textShadowOffset: { width: 0, height: 0 },
      textShadowRadius: 10
    } as const,
    titleGlowWarm: {
      textShadowColor: "rgba(250,200,120,0.22)",
      textShadowOffset: { width: 0, height: 0 },
      textShadowRadius: 16
    } as const,
    cardHalo: {
      shadowColor: "#000",
      shadowOpacity: 0.35,
      shadowOffset: { width: 0, height: 12 },
      shadowRadius: 24,
      elevation: 10
    } as const
  }
};

// Legacy exports for backward compatibility
export const colors = {
  bg: '#0B1016',
  surface: '#141B23',
  primary: '#3B82F6',
  accent: '#FCD34D',
  text: '#EAF2FF',
  muted: '#9FB0C3',
} as const;

export const presets = {
  heroTitle: {
    ...premium.styles.titleGlow,
    fontSize: 36,
    fontWeight: 'bold' as const,
    color: colors.text,
    textAlign: 'center' as const,
  },
  
  heroSubtitle: {
    fontSize: 16,
    color: colors.muted,
    textAlign: 'center' as const,
    marginTop: 8,
  },
  
  glassCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.06)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.12)',
    borderRadius: 20,
    padding: 24,
    ...premium.styles.cardHalo,
  },
  
  premiumButton: {
    backgroundColor: colors.primary,
    borderRadius: 16,
    paddingHorizontal: 20,
    paddingVertical: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.3,
    shadowRadius: 30,
    elevation: 8,
  },
  
  modeToggle: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  
  modeToggleActive: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
} as const;

export const effects = {
  textGlow: premium.styles.titleGlow,
  textGlowAccent: premium.styles.titleGlowWarm,
  halo: {
    shadowColor: '#FCD34D',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.35,
    shadowRadius: 20,
    elevation: 10,
  },
  shadowSoft: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.3,
    shadowRadius: 30,
    elevation: 8,
  },
} as const;
