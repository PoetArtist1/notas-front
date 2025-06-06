// app/index.tsx
import React from 'react';
import { View, ActivityIndicator, StyleSheet } from 'react-native';

export default function Index() {
  // Simplemente mostramos un spinner mientras AuthContext decide adónde ir
  return (
    <View style={styles.container}>
      <ActivityIndicator size="large" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center' }
});
