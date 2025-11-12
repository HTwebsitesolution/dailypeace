// app/components/TypingIndicator.tsx
import React, { useEffect, useMemo, useRef } from "react";
import {
  View,
  Text,
  Animated,
  Easing,
  Platform,
  StyleSheet,
  ViewStyle,
} from "react-native";
import { BlurView } from "expo-blur";
import { LinearGradient } from "expo-linear-gradient";

type Props = {
  /** Show/Hide the indicator */
  visible: boolean;
  /** Optional text. Keep short. */
  label?: string;
  /** Positioning overrides if needed */
  style?: ViewStyle;
  /** Smaller variant to embed inside a message row */
  compact?: boolean;
};

const DOTS = 3;
const DOT_DELAY = 160; // ms between dots
const CYCLE = 1200; // full animation cycle per dot

export default function TypingIndicator({
  visible,
  label = "Daily Peace is preparing a response…",
  style,
  compact,
}: Props) {
  const dots = useMemo(
    () => new Array(DOTS).fill(0).map(() => new Animated.Value(0)),
    []
  );

  // Animate each dot with a small vertical float + fade
  useEffect(() => {
    const anims = dots.map((val, i) =>
      Animated.loop(
        Animated.sequence([
          Animated.delay(DOT_DELAY * i),
          Animated.timing(val, {
            toValue: 1,
            duration: CYCLE / 2,
            easing: Easing.out(Easing.quad),
            useNativeDriver: true,
          }),
          Animated.timing(val, {
            toValue: 0,
            duration: CYCLE / 2,
            easing: Easing.in(Easing.quad),
            useNativeDriver: true,
          }),
        ])
      )
    );

    // start/stop when visible toggles
    if (visible) anims.forEach((a) => a.start());
    else anims.forEach((a) => a.stop());

    return () => anims.forEach((a) => a.stop());
  }, [visible, dots]);

  if (!visible) return null;

  const pillPadding = compact ? 8 : 12;

  return (
    <BlurCard style={[styles.container, { padding: pillPadding }, style as ViewStyle]}>
      <LinearGradient
        colors={["rgba(37, 99, 235, .18)", "rgba(14, 165, 233, .12)"]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.gradient}
      >
        {/* Dots + Label */}
        <View style={styles.row}>
          <View style={styles.dotsRow}>
            {dots.map((val, idx) => {
              const translateY = val.interpolate({
                inputRange: [0, 1],
                outputRange: [0, -5], // gentle float up
              });
              const opacity = val.interpolate({
                inputRange: [0, 1],
                outputRange: [0.4, 1],
              });
              return (
                <Animated.View
                  key={idx}
                  style={[
                    styles.dot,
                    {
                      transform: [{ translateY }],
                      opacity,
                    },
                  ]}
                />
              );
            })}
          </View>

          {!compact && (
            <Text
              accessibilityLiveRegion="polite"
              accessibilityRole="text"
              style={styles.label}
              numberOfLines={1}
            >
              {label}
            </Text>
          )}
        </View>

        {/* Subtle shimmer bar */}
        {!compact && <ShimmerBar />}
      </LinearGradient>
    </BlurCard>
  );
}

/** Small, reusable Blur container with graceful web fallback */
function BlurCard({
  children,
  style,
}: {
  children: React.ReactNode;
  style?: ViewStyle | ViewStyle[];
}) {
  if (Platform.OS === "web") {
    // web fallback: use translucent bg + shadow
    return <View style={[styles.webCard, style]}>{children}</View>;
  }
  return (
    <BlurView intensity={40} tint="dark" style={[styles.blurCard, style]}>
      {children}
    </BlurView>
  );
}

/** A gentle, branded shimmer line under the dots */
function ShimmerBar() {
  const progress = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(progress, {
          toValue: 1,
          duration: 1500,
          easing: Easing.inOut(Easing.quad),
          useNativeDriver: false,
        }),
        Animated.timing(progress, {
          toValue: 0,
          duration: 0,
          useNativeDriver: false,
        }),
      ])
    );
    loop.start();
    return () => loop.stop();
  }, [progress]);

  const width = progress.interpolate({
    inputRange: [0, 1],
    outputRange: ["10%", "100%"],
  });

  return (
    <View style={styles.shimmerTrack}>
      <Animated.View style={[styles.shimmerFill, { width }]} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignSelf: "center",
    borderRadius: 16,
    overflow: "hidden",
    maxWidth: 680,
    marginVertical: 8,
  },
  blurCard: {
    borderRadius: 16,
    overflow: "hidden",
  },
  webCard: {
    borderRadius: 16,
    backgroundColor: "rgba(15, 23, 42, 0.5)",
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: "rgba(255,255,255,0.08)",
    boxShadow: "0 6px 24px rgba(0,0,0,0.35)",
    backdropFilter: "blur(10px)",
  } as any,
  gradient: {
    borderRadius: 16,
    paddingHorizontal: 14,
    paddingVertical: 10,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  dotsRow: {
    flexDirection: "row",
    gap: 6,
    alignItems: "center",
    justifyContent: "center",
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 10,
    backgroundColor: "rgba(255,255,255,0.9)",
  },
  label: {
    color: "#EAF2FF",
    fontSize: 14,
    opacity: 0.9,
  },
  shimmerTrack: {
    height: 3,
    marginTop: 8,
    backgroundColor: "rgba(255,255,255,0.08)",
    borderRadius: 3,
    overflow: "hidden",
  },
  shimmerFill: {
    height: "100%",
    borderRadius: 3,
    backgroundColor: "rgba(255,255,255,0.5)",
  },
});
