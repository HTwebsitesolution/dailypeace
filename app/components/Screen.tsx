import React, { ReactNode } from "react";
import { Platform, ScrollView, StatusBar, ViewStyle } from "react-native";
import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context";

type Props = {
  children: ReactNode;
  scroll?: boolean;
  style?: ViewStyle;
  contentStyle?: ViewStyle;
  padTop?: number;
};

export default function Screen({
  children,
  scroll = true,
  style,
  contentStyle,
  padTop = 20,
}: Props) {
  const insets = useSafeAreaInsets();
  const topPad = Math.max(insets.top, 12) + padTop;

  const Body: any = scroll ? ScrollView : React.Fragment;
  const bodyProps = scroll
    ? ({
        contentInsetAdjustmentBehavior: "always",
        keyboardShouldPersistTaps: "handled",
        contentContainerStyle: [
          { paddingTop: topPad, paddingBottom: 24, paddingHorizontal: 16, flexGrow: 1 },
          contentStyle,
        ],
        children,
      } as any)
    : ({ children } as any);

  return (
    <SafeAreaView
      style={[{ flex: 1, backgroundColor: "#0B1220" }, style]}
      edges={["top", "left", "right"]}
    >
      <StatusBar
        barStyle="light-content"
        translucent={Platform.OS === "android"}
        backgroundColor="transparent"
      />
      {/* @ts-ignore */}
      <Body {...bodyProps} />
    </SafeAreaView>
  );
}
