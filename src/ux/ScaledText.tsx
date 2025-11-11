import React from "react";
import { Text as RNText, TextProps, StyleSheet } from "react-native";
import { useFontScale } from "./useFontScale";

type Props = TextProps & { baseSize?: number; lineHeightMul?: number };

export function Text({ baseSize = 16, lineHeightMul = 1.35, style, ...rest }: Props) {
  const { fs } = useFontScale();
  const size = fs(baseSize);
  const lh = Math.round(size * lineHeightMul);

  return (
    <RNText
      allowFontScaling
      maxFontSizeMultiplier={3}
      style={[styles.base, { fontSize: size, lineHeight: lh }, style]}
      {...rest}
    />
  );
}

const styles = StyleSheet.create({
  base: { color: "#EAF2FF" },
});


