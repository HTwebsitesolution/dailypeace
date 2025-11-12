import React, { useMemo, useEffect, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  Platform,
  Share,
  Image,
  Animated,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";

type Verse = { ref: string; url?: string };
type Props = {
  title?: string;                    // e.g., "A Moment of Peace"
  body: string;                      // reflection text
  verses?: Verse[];                  // chips like ["John 14:27", "Luke 6:38"]
  onReadAloud?: () => void;          // hook into your TTS
  autoReadEnabled?: boolean;
  onToggleAutoRead?: () => void;
  onClose?: () => void;
  onShareLink?: string;              // optional deep link to share
  compact?: boolean;                 // allow smaller padding on mobile
};

/** Brand constants (match your theme-premium tokens) */
const TOKENS = {
  bgA: "rgba(17, 24, 39, 0.55)",        // glass bg (dark)
  bgB: "rgba(31, 41, 55, 0.55)",
  border: "rgba(255,255,255,0.10)",
  text: "#EAF2FF",
  sub: "rgba(234,242,255,0.72)",
  pill: "rgba(59,130,246,0.18)",         // chip bg
  pillBorder: "rgba(255,255,255,0.18)",
  action: "#3B82F6",
  actionText: "#FFFFFF",
  glowA: "#60A5FA",
  glowB: "#F59E0B",
};

const LogoBadge = () => (
  <View style={styles.logoWrap}>
    <Image
      source={{ uri: "https://dailypeace.life/icon-40.png" }} // small square logo
      style={styles.logo}
      resizeMode="contain"
    />
  </View>
);

const VerseChip = ({ v }: { v: Verse }) => (
  <View style={styles.chip}>
    <Text style={styles.chipText}>{v.ref}</Text>
  </View>
);

export default function BrandedMessageCard({
  title = "A Moment of Peace 🙏",
  body,
  verses = [],
  onReadAloud,
  autoReadEnabled,
  onToggleAutoRead,
  onClose,
  onShareLink,
  compact,
}: Props) {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.95)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        tension: 50,
        friction: 7,
        useNativeDriver: true,
      }),
    ]).start();
  }, [fadeAnim, scaleAnim]);

  const share = async () => {
    const shareUrlWithUTM = onShareLink 
      ? `${onShareLink}?utm_source=app&utm_medium=share&utm_campaign=blessing`
      : "https://dailypeace.life?utm_source=app&utm_medium=share&utm_campaign=blessing";
    
    const message = `${title}\n\n${body}\n\n${verses.map(v => v.ref).join(" · ")}${
      shareUrlWithUTM ? `\n\n${shareUrlWithUTM}` : ""
    }`;
    try {
      await Share.share(
        Platform.select({
          ios: { message },
          android: { message },
          default: { message },
        }) as any
      );
    } catch {}
  };

  const padding = compact ? 14 : 18;

  const verseChips = useMemo(
    () => verses.slice(0, 6), // reasonable limit
    [verses]
  );

  const AnimatedLinearGradient = Animated.createAnimatedComponent(LinearGradient);

  return (
    <Animated.View
      style={{
        opacity: fadeAnim,
        transform: [{ scale: scaleAnim }],
      }}
    >
      <AnimatedLinearGradient
        colors={[TOKENS.bgA, TOKENS.bgB]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={[styles.card, { padding }]}
      >
      {/* subtle edge gradient sweep */}
      <LinearGradient
        pointerEvents="none"
        colors={[`${TOKENS.glowA}20`, `${TOKENS.glowB}22`]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
        style={styles.edge}
      />

      <View style={styles.headerRow}>
        <Text numberOfLines={1} style={styles.title}>
          {title}
        </Text>

        <View style={{ flexDirection: "row", gap: 8, alignItems: "center" }}>
          <LogoBadge />

          <Pressable onPress={onClose} hitSlop={10} style={styles.closeBtn}>
            <Text style={styles.closeX}>×</Text>
          </Pressable>
        </View>
      </View>

      <Text style={styles.body}>{body}</Text>

      {verseChips.length > 0 && (
        <View style={styles.chipsRow}>
          {verseChips.map((v, i) => (
            <VerseChip key={`${v.ref}-${i}`} v={v} />
          ))}
        </View>
      )}

      <View style={styles.actionsRow}>
        {!!onReadAloud && (
          <Pressable style={[styles.secondaryBtn]} onPress={onReadAloud}>
            <Text style={styles.secondaryText}>Read to me</Text>
          </Pressable>
        )}

        {typeof autoReadEnabled === "boolean" && !!onToggleAutoRead && (
          <Pressable style={styles.secondaryBtn} onPress={onToggleAutoRead}>
            <Text style={styles.secondaryText}>
              Auto-read: {autoReadEnabled ? "On" : "Off"}
            </Text>
          </Pressable>
        )}
      </View>

      <View style={{ height: 8 }} />

      <Pressable onPress={share} style={styles.primaryBtn}>
        <Text style={styles.primaryText}>Share this blessing 🔗</Text>
      </Pressable>

      {/* tiny watermark */}
      <View style={styles.watermark}>
        <Text style={styles.watermarkTxt}>dailypeace.life</Text>
      </View>
      </AnimatedLinearGradient>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: 18,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: TOKENS.border,
    shadowColor: "#000",
    shadowOpacity: 0.35,
    shadowOffset: { width: 0, height: 18 },
    shadowRadius: 28,
    elevation: 8,
  },
  edge: {
    position: "absolute",
    inset: 0,
    opacity: 0.7,
  },
  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 12,
    marginBottom: 10,
  },
  title: {
    color: TOKENS.text,
    fontSize: 16,
    fontWeight: "700",
  },
  body: {
    color: TOKENS.text,
    opacity: 0.96,
    lineHeight: 22,
    fontSize: 15,
  },
  chipsRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    marginTop: 14,
  },
  chip: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 10,
    backgroundColor: TOKENS.pill,
    borderWidth: 1,
    borderColor: TOKENS.pillBorder,
  },
  chipText: {
    color: "#A5B4FC",
    fontWeight: "700",
    fontSize: 12,
  },
  actionsRow: {
    flexDirection: "row",
    gap: 10,
    marginTop: 14,
  },
  secondaryBtn: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 10,
    backgroundColor: "rgba(255,255,255,0.08)",
    borderWidth: 1,
    borderColor: TOKENS.border,
  },
  secondaryText: {
    color: TOKENS.sub,
    fontWeight: "600",
    fontSize: 13,
  },
  primaryBtn: {
    alignSelf: "flex-start",
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 12,
    backgroundColor: TOKENS.action,
  },
  primaryText: {
    color: TOKENS.actionText,
    fontWeight: "700",
  },
  watermark: {
    position: "absolute",
    right: 10,
    bottom: 8,
    opacity: 0.6,
  },
  watermarkTxt: {
    color: TOKENS.sub,
    fontSize: 11,
  },
  logoWrap: {
    width: 22,
    height: 22,
    borderRadius: 6,
    overflow: "hidden",
  },
  logo: { width: "100%", height: "100%" },
  closeBtn: {
    width: 26,
    height: 26,
    borderRadius: 13,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(255,255,255,0.08)",
    borderWidth: 1,
    borderColor: TOKENS.border,
  },
  closeX: { color: TOKENS.sub, fontSize: 16, fontWeight: "700", lineHeight: 18 },
});
