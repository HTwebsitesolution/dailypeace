import React from "react";
import { View, Text, StyleSheet } from "react-native";

export default function TestApp() {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>Daily Peace - Test Version</Text>
      <Text style={styles.subtext}>If you can see this, React Native Web is working!</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#0B1016',
  },
  text: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 16,
  },
  subtext: {
    fontSize: 16,
    color: '#ccc',
    textAlign: 'center',
  },
});