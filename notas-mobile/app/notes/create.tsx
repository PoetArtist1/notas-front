// app/notes/create.tsx
import React, { useState, useContext } from 'react';
import { View, Text, TextInput, Switch, Button, StyleSheet, Alert, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { AuthContext } from '../../src/context/AuthContext';

const datos = require('../../config.json');

export default function CreateNote() {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [isPublic, setIsPublic] = useState(false);
  const { token } = useContext(AuthContext);
  const router = useRouter();

  const handleCreate = async () => {
    if (!title || !description) {
      Alert.alert('Error', 'Título y descripción son obligatorios');
      return;
    }
    try {
      const resp = await fetch(`${datos.API_URL}/api/notes`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ title, description, is_public: isPublic })
      });
      if (!resp.ok) {
        const data = await resp.json();
        Alert.alert('Error', data.msg || 'No se pudo crear nota');
        return;
      }
      router.push('/notes');
    } catch (err) {
      Alert.alert('Error', 'No se pudo conectar al servidor');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Título</Text>
      <TextInput
        style={styles.input}
        value={title}
        onChangeText={setTitle}
        maxLength={100}
      />
      <Text style={styles.label}>Descripción (máx: 250)</Text>
      <TextInput
        style={[styles.input, { height: 100 }]}
        value={description}
        onChangeText={setDescription}
        multiline
        maxLength={250}
      />
      <View style={styles.switchRow}>
        <Text style={styles.label}>Pública</Text>
        <Switch value={isPublic} onValueChange={setIsPublic} />
      </View>
      <View style={styles.headerButton}>
      <TouchableOpacity onPress={handleCreate}>
        <Text style={styles.headerButtonText}>Crear nota</Text>
      </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, marginTop: 40 },
  label: { marginTop: 12, fontWeight: 'bold' },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 8,
    marginTop: 6,
    borderRadius: 4
  },
  switchRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 12,
    justifyContent: 'space-between'
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
