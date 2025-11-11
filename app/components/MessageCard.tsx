import React from "react";
import { View, Pressable, Share, StyleSheet, ImageSourcePropType } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Text } from "@/ux/ScaledText";

const defaultIcon = require("../../assets/Bible Circle Daily Peace Logo.png");

type Action = {
  label: string;
  onPress?: () => void;
};

type Props = {
  text: string;
  title?: string;
  verses?: string[];
  onClose?: () => void;
  onShare?: () => void;
  compact?: boolean;
  icon?: ImageSourcePropType;
  actions?: Action[];
};

export default function MessageCard({
  text,
  title = "Daily Peace",
  verses = [],
  onClose,
  onShare,
  compact,
  icon = defaultIcon,
  actions = [],
}: Props) {
  const handleShare = async () => {
    if (onShare) {
      onShare();
      return;
    }
    try {
      const payload = verses.length ? `${text}\n\n${verses.join(" • ")}` : text;
      await Share.share({ message: payload.trim() });
    } catch {}
  };

  return (
    <View style={[styles.card, compact && { marginVertical: 6 }] }>
      <View style={styles.headerRow}>
        <View style={styles.headerLeft}>
          <View style={styles.iconWrap}>
            <View style={styles.iconHalo} />
            <View style={styles.iconInner}>
              <Ionicons name="sparkles" size={16} color="#9DC0FF" />
            </View>
          </View>
          <Text baseSize={15} style={styles.headerTitle} numberOfLines={1}>
            {title}
          </Text>
        </View>
        <View style={styles.headerActions}>
          {onShare && (
            <Pressable onPress={handleShare} style={styles.headerButton} hitSlop={8}>
              <Ionicons name="share-outline" size={18} color="#B7CAFF" />
            </Pressable>
          )}
          {onClose && (
            <Pressable onPress={onClose} style={styles.headerButton} hitSlop={8}>
              <Ionicons name="close" size={18} color="#8FA0BF" />
            </Pressable>
          )}
        </View>
      </View>

      <Text baseSize={16} style={styles.bodyText}>
        {text}
      </Text>

      {!!verses.length && (
        <View style={styles.verseRow}>
          {verses.map((verse) => (
            <View key={verse} style={styles.versePill}>
              <Text baseSize={13} style={styles.versePillText}>
                {verse}
              </Text>
            </View>
          ))}
        </View>
      )}

      {!!actions.length && (
        <View style={styles.actionRow}>
          {actions.map((action) => (
            <Pressable
              key={action.label}
              onPress={action.onPress}
              style={styles.actionButton}
            >
              <Text baseSize={13} style={styles.actionText}>
                {action.label}
              </Text>
            </Pressable>
          ))}
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.08)",
    backgroundColor: "rgba(18,26,38,0.96)",
    padding: 16,
    marginVertical: 10,
    shadowColor: "#010409",
    shadowOpacity: 0.35,
    shadowRadius: 18,
    shadowOffset: { width: 0, height: 14 },
    elevation: 8,
  },
  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  headerLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    flex: 1,
  },
  iconWrap: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: "center",
    alignItems: "center",
    position: "relative",
  },
  iconHalo: {
    position: "absolute",
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: "rgba(111,165,255,0.22)",
  },
  iconInner: {
    width: 26,
    height: 26,
    borderRadius: 13,
    backgroundColor: "rgba(58,115,242,0.22)",
    justifyContent: "center",
    alignItems: "center",
  },
  headerTitle: {
    color: "#F0F5FF",
    fontWeight: "700",
  },
  headerActions: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  headerButton: {
    padding: 6,
    borderRadius: 8,
    backgroundColor: "rgba(255,255,255,0.05)",
  },
  bodyText: {
    color: "#EAF2FF",
    lineHeight: 22,
  },
  verseRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
    marginTop: 14,
  },
  versePill: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 12,
    backgroundColor: "rgba(72,96,140,0.35)",
    borderWidth: 1,
    borderColor: "rgba(152,176,216,0.45)",
  },
  versePillText: {
    color: "#DFE8FF",
    fontWeight: "700",
  },
  actionRow: {
    flexDirection: "row",
    gap: 12,
    marginTop: 16,
  },
  actionButton: {
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.12)",
    backgroundColor: "rgba(17,25,37,0.9)",
  },
  actionText: {
    color: "#E7EEFF",
    fontWeight: "600",
  },
});
