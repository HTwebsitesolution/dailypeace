import React from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { Text } from "@/ux/ScaledText";

interface Props {
  message?: string;
  onRetry?: () => void;
}

export default function FallbackScreen({ 
  message = "Something went wrong. Please restart the app.", 
  onRetry 
}: Props) {
  return (
    <View style={styles.container}>
      <Text baseSize={48} style={styles.icon}>⚠️</Text>
      <Text baseSize={22} style={styles.title}>Oops!</Text>
      <Text baseSize={16} style={styles.message}>{message}</Text>
      {onRetry && (
        <TouchableOpacity style={styles.button} onPress={onRetry}>
          <Text baseSize={16} style={styles.buttonText}>Try Again</Text>
        </TouchableOpacity>
      )}
      <TouchableOpacity 
        style={styles.buttonSecondary} 
        onPress={() => {
          // Attempt to reload the app
          if (typeof window !== 'undefined' && window.location) {
            window.location.reload();
          }
        }}
      >
        <Text baseSize={16} style={styles.buttonTextSecondary}>Restart App</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0B1016',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  icon: {
    marginBottom: 16,
  },
  title: {
    fontWeight: 'bold',
    color: '#EAF2FF',
    marginBottom: 16,
    textAlign: 'center',
  },
  message: {
    color: '#87BFFF',
    marginBottom: 32,
    textAlign: 'center',
  },
  button: {
    backgroundColor: '#2F80ED',
    paddingHorizontal: 32,
    paddingVertical: 14,
    borderRadius: 8,
    marginBottom: 12,
    minWidth: 200,
  },
  buttonText: {
    color: '#FFFFFF',
    fontWeight: '600',
    textAlign: 'center',
  },
  buttonSecondary: {
    backgroundColor: 'transparent',
    paddingHorizontal: 32,
    paddingVertical: 14,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#2F80ED',
    minWidth: 200,
  },
  buttonTextSecondary: {
    color: '#2F80ED',
    fontWeight: '600',
    textAlign: 'center',
  },
});



