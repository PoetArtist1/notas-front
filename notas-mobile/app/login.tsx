// app/login.tsx
import React, { useState, useContext } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert, TouchableOpacity } from 'react-native';
import { AuthContext } from '../src/context/AuthContext';
import { useRouter } from 'expo-router';

const datos = require('../config.json');

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { login } = useContext(AuthContext);
  const router = useRouter();

  const handleSubmit = async () => {
    if (!email || !password) {
      Alert.alert('Error', 'Email y contraseña son obligatorios');
      return;
    }
    try {
      const resp = await fetch(`${datos.API_URL}/api/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      const data = await resp.json();
      if (!resp.ok) {
        Alert.alert('Error', data.msg || 'Credenciales inválidas');
        return;
      }
      // data: { token: string, username: string }
      await login(data.token, data.username);
    } catch (err) {
      Alert.alert('Error', 'No se pudo conectar al servidor');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Iniciar Sesión</Text>
      <TextInput
        style={styles.input}
        placeholder="Correo"
        value={email}
        onChangeText={setEmail}
        autoCapitalize="none"
        keyboardType="email-address"
      />
      <TextInput
        style={styles.input}
        placeholder="Contraseña"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />
      <View style={styles.headerButton}>
      <TouchableOpacity onPress={handleSubmit}>
        <Text style={styles.headerButtonText}>Iniciar sesión</Text>
      </TouchableOpacity>
      </View>
      <View style={styles.headerButton}>
        <TouchableOpacity onPress={() => router.push('/register')} >
          <Text style={styles.headerButtonText}>Registrarse</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, justifyContent: 'center' },
  title: { fontSize: 24, marginBottom: 16, textAlign: 'center', fontWeight: 'bold' },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 8,
    marginBottom: 20,
    borderRadius: 4,
  },
    headerButton: {
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 10,
    backgroundColor: '#4d91ff',
    marginTop: 20
  },
  headerButtonText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#ffffff',
    textAlign: 'center',
  }
});
