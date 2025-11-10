import React, { Component, ErrorInfo, ReactNode } from "react";
import { View, StyleSheet, Pressable } from "react-native";
import { Text } from "@/ux/ScaledText";

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  message?: string;
}

export class AppErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, message: error?.message };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.warn("Boundary caught", error, errorInfo);
  }

  handleReset = () => {
    this.setState({ hasError: false, message: undefined });
  };

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }
      return (
        <View style={styles.container}>
          <Text baseSize={18} style={styles.title}>
            Something went wrong
          </Text>
          {!!this.state.message && (
            <Text baseSize={14} style={styles.message}>
              {this.state.message}
            </Text>
          )}
          <Pressable style={styles.button} onPress={this.handleReset}>
            <Text baseSize={15} style={styles.buttonText}>
              Try again
            </Text>
          </Pressable>
        </View>
      );
    }
    return this.props.children;
  }
}

export const ErrorBoundary = AppErrorBoundary;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0B1016",
    justifyContent: "center",
    alignItems: "center",
    padding: 24,
  },
  title: {
    fontWeight: "700",
    color: "#FFFFFF",
  },
  message: {
    color: "#9FB3FF",
    marginTop: 8,
    textAlign: "center",
  },
  button: {
    marginTop: 16,
    paddingVertical: 12,
    paddingHorizontal: 20,
    backgroundColor: "#3B82F6",
    borderRadius: 10,
  },
  buttonText: {
    color: "#FFFFFF",
    fontWeight: "700",
  },
});