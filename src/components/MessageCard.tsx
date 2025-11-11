import React from "react";
import { View, StyleSheet, Pressable, Share, Image, useColorScheme } from "react-native";
import { BlurView } from "expo-blur";
import { LinearGradient } from "expo-linear-gradient";
import { dp } from "@/ui/tokens";

let T: any;
try {
  T = require("@/ux/ScaledText").Text;
} catch {
  T = require("react-native").Text;
}

type Props = {
  title?: string;
  body: string;
  verses?: string[];
  onSharePress?: () => void;
  onClose?: () => void;
  logoUri?: string;
  watermarkUri?: string;
  testID?: string;
};

export default function MessageCard({
  title = "A Moment of Peace",
  body,
  verses = [],
  onSharePress,
  onClose,
  logoUri,
  watermarkUri,
  testID,
}: Props) {
  const scheme = useColorScheme();
  const blurTint = scheme === "dark" ? "dark" : "light";

  const shareDefault = async () => {
    try {
      const verseLine = verses.length ? `\n\n${verses.join(" • ")}` : "";
      await Share.share({ message: `${body}${verseLine}\n\n— Daily Peace` });
    } catch {}
  };

  return (
    <View testID={testID} style={styles.wrap}>
      <LinearGradient
        colors={dp.gradient.border}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.gradientBorder}
      >
        <BlurView intensity={40} tint={blurTint} style={styles.blur}>
          <View style={styles.inner}>
            {watermarkUri ? (
              <Image
                source={{ uri: watermarkUri }}
                style={styles.watermark}
                resizeMode="contain"
              />
            ) : null}

            <View style={styles.header}>
              <View style={styles.titleRow}>
                {logoUri ? (
                  <Image source={{ uri: logoUri }} style={styles.logo} resizeMode="contain" />
                ) : null}
                <T baseSize={16} style={styles.title}>
                  {title}
                </T>
              </View>

              {onClose ? (
                <Pressable
                  onPress={onClose}
                  hitSlop={12}
                  style={styles.closeBtn}
                  accessibilityRole="button"
                  accessibilityLabel="Close"
                >
                  <T baseSize={18} style={{ color: dp.text.meta }}>✕</T>
                </Pressable>
              ) : null}
            </View>

            <T baseSize={16} style={styles.body}>
              {body}
            </T>

            {!!verses.length && (
              <View style={styles.chips}>
                {verses.map((v) => (
                  <View key={v} style={styles.chip}>
                    <T baseSize={13} style={styles.chipText}>{v}</T>
                  </View>
                ))}
              </View>
            )}

            <View style={styles.actions}>
              <Pressable
                onPress={onSharePress ?? shareDefault}
                style={({ pressed }) => [
                  styles.share,
                  pressed && { transform: [{ scale: 0.98 }] },
                ]}
                accessibilityRole="button"
                accessibilityLabel="Share"
              >
                <T baseSize={14} style={styles.shareText}>Share this blessing 🔗</T>
              </Pressable>
            </View>
          </View>
        </BlurView>
      </LinearGradient>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    marginHorizontal: 16,
    marginTop: 14,
  },
  gradientBorder: {
    borderRadius: dp.radius + 2,
    padding: 1.2,
    ...dp.shadow.card,
  },
  blur: {
    borderRadius: dp.radius,
    overflow: "hidden",
  },
  inner: {
    position: "relative",
    borderRadius: dp.radius,
    backgroundColor: dp.glass.bg,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: dp.glass.stroke,
    padding: dp.pad,
  },
  watermark: {
    position: "absolute",
    alignSelf: "center",
    width: 220,
    height: 220,
    opacity: 0.08,
    top: 40,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },
  titleRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    flex: 1,
  },
  logo: {
    width: 22,
    height: 22,
    borderRadius: 11,
  },
  title: {
    color: dp.text.title,
    fontWeight: "700",
  },
  closeBtn: {
    padding: 6,
    borderRadius: 10,
  },
  body: {
    color: dp.text.body,
    marginTop: 6,
  },
  chips: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    marginTop: 12,
  },
  chip: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.16)",
    backgroundColor: "rgba(255,255,255,0.08)",
  },
  chipText: {
    color: dp.text.chip,
    fontWeight: "700",
  },
  actions: {
    marginTop: 14,
    flexDirection: "row",
    justifyContent: "flex-start",
    gap: 10,
  },
  share: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 12,
    backgroundColor: "rgba(59,130,246,0.18)",
    borderWidth: 1,
    borderColor: "rgba(96,165,250,0.35)",
  },
  shareText: {
    color: "#DCE8FF",
    fontWeight: "700",
  },
});


