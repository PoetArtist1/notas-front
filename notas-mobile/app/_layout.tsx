// app/_layout.tsx
import { Stack } from 'expo-router';
import React from 'react';
import { AuthProvider } from '../src/context/AuthContext'; // <-- Ruta corregida

export default function Layout() {
  return (
    <AuthProvider>
      <Stack>
        <Stack.Screen name="index" options={{ headerShown: false }} />
        <Stack.Screen name="login" options={{ headerShown: false }} />
        <Stack.Screen name="register" options={{ headerShown: false }} />
        <Stack.Screen name="notes/index" options={{ headerShown: false }} />
        <Stack.Screen name="notes/create" options={{ headerShown: false }} />
        <Stack.Screen name="notes/[id]" options={{ headerShown: false }} />
        <Stack.Screen name="categories/index" options={{ headerShown: false}} />
        <Stack.Screen name="categories/create" options={{ headerShown: false }} />
        <Stack.Screen name="categories/[id]" options={{ headerShown: false }} />
        <Stack.Screen name="favorites" options={{ headerShown: false }} />
      </Stack>
    </AuthProvider>
  );
}
