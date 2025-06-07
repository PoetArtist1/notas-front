// app/register.tsx
import React, { useState, useContext } from 'react';
import { View, Text, TextInput, StyleSheet, Alert, TouchableOpacity } from 'react-native';
import { AuthContext } from '../src/context/AuthContext';
import { useRouter } from 'expo-router';

const datos = require('../config.json');

export default function Register() {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { login } = useContext(AuthContext);
  const router = useRouter();


  const handleSubmit = async () => {
    if (!username || !email || !password) {
      Alert.alert('Error', 'Todos los campos son obligatorios');
      return;
    }
    try {
      const resp = await fetch(`${datos.API_URL}/api/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, email, password }),
      });
      const data = await resp.json();
      if (!resp.ok) {
        Alert.alert('Error', data.msg || 'No se pudo registrar');
        return;
      }
      // Después de registrar, hacemos login automáticamente
      const resp2 = await fetch(`${datos.API_URL}/api/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      const data2 = await resp2.json();
      if (resp2.ok) {
        await login(data2.token, data2.username);
      } else {
        Alert.alert('Error', 'Registrado, pero no se pudo logear');
      }
    } catch (err) {
      Alert.alert('Error', 'No se pudo conectar al servidor');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Registrarse</Text>
      <TextInput
        style={styles.input}
        placeholder="Usuario"
        value={username}
        onChangeText={setUsername}
        autoCapitalize="none"
        maxLength={20}
      />
      <TextInput
        style={styles.input}
        placeholder="Correo"
        value={email}
        onChangeText={setEmail}
        autoCapitalize="none"
        keyboardType="email-address"
        maxLength={40}
      />
      <TextInput
        style={styles.input}
        placeholder="Contraseña"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        maxLength={20}
      />
      <View style={styles.headerButton}>
      <TouchableOpacity onPress={handleSubmit} >
        <Text style={styles.headerButtonText}>Registrarse</Text>
      </TouchableOpacity>
      </View>
      <View style={styles.headerButton}>
        <TouchableOpacity onPress={() => router.push('/login')}>
          <Text style={styles.headerButtonText}>Ya tengo una cuenta</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, justifyContent: 'center' },
  title: { fontSize: 24, marginBottom: 16, textAlign: 'center' },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 8,
    marginBottom: 12,
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
