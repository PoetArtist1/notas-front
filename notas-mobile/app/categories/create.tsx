// app/categories/create.tsx
import React, { useState, useContext } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { AuthContext } from '../../src/context/AuthContext';

const datos = require('../../config.json');

export default function CreateCategory() {
  const [name, setName] = useState('');
  const { token } = useContext(AuthContext);
  const router = useRouter();

  const handleCreate = async () => {
    if (!name) {
      Alert.alert('Error', 'El nombre es obligatorio');
      return;
    }
    try {
      const resp = await fetch(`${datos.API_URL}/api/categories`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ name })
      });
      if (!resp.ok) {
        const data = await resp.json();
        Alert.alert('Error', data.msg || 'No se pudo crear categoría');
        return;
      }
      router.push('/categories');
    } catch {
      Alert.alert('Error', 'No se pudo conectar al servidor');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Nombre de la Categoría</Text>
      <TextInput
        style={styles.input}
        value={name}
        onChangeText={setName}
        maxLength={100}
      />
      <Button title="Crear Categoría" onPress={handleCreate} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16 },
  label: { marginTop: 12, fontWeight: 'bold' },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 8,
    marginTop: 6,
    borderRadius: 4
  }
});
