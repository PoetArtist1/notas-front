// app/notes/[id].tsx
import React, { useEffect, useState, useContext } from 'react';
import { View, Text, TextInput, Switch, Button, StyleSheet, Alert } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { AuthContext } from '../../src/context/AuthContext';

const datos = require('../../config.json');

type NoteDetail = {
  id: number;
  title: string;
  description: string;
  is_public: boolean;
};

export default function NoteDetailPage() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const [note, setNote] = useState<NoteDetail | null>(null);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [isPublic, setIsPublic] = useState(false);
  const { token } = useContext(AuthContext);
  const router = useRouter();

  const fetchNote = async () => {
    try {
      const resp = await fetch(`${datos.API_URL}/api/notes/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (!resp.ok) {
        router.push('/notes');
        return;
      }
      const data = await resp.json();
      setNote(data);
      setTitle(data.title);
      setDescription(data.description);
      setIsPublic(data.is_public);
    } catch {
      Alert.alert('Error', 'No se pudo cargar la nota');
    }
  };

  useEffect(() => {
    fetchNote();
  }, []);

  const handleUpdate = async () => {
    if (!title || !description) {
      Alert.alert('Error', 'Título y descripción son obligatorios');
      return;
    }
    try {
      const resp = await fetch(`${datos.API_URL}/api/notes/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ title, description, is_public: isPublic })
      });
      if (!resp.ok) {
        const data = await resp.json();
        Alert.alert('Error', data.msg || 'No se pudo actualizar');
        return;
      }
      router.push('/notes');
    } catch {
      Alert.alert('Error', 'No se pudo conectar al servidor');
    }
  };

  const handleDelete = async () => {
    try {
      const resp = await fetch(`${datos.API_URL}/api/notes/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` }
      });
      if (resp.ok) {
        router.push('/notes');
      } else {
        const data = await resp.json();
        Alert.alert('Error', data.msg || 'No se pudo eliminar');
      }
    } catch {
      Alert.alert('Error', 'No se pudo conectar al servidor');
    }
  };

  if (!note) {
    return (
      <View style={styles.center}>
        <Text>Cargando...</Text>
      </View>
    );
  }

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
        <Text>Pública</Text>
        <Switch value={isPublic} onValueChange={setIsPublic} />
      </View>
      <Button title="Guardar Cambios" onPress={handleUpdate} />
      <View style={{ marginTop: 12 }}>
        <Button title="Eliminar Nota" color="#d9534f" onPress={handleDelete} />
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
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' }
});
