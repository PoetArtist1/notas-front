// app/categories/[id].tsx
import React, { useEffect, useState, useContext } from 'react';
import {View,Text,FlatList,Button,StyleSheet,Alert,TouchableOpacity} from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { AuthContext } from '../../src/context/AuthContext';

const datos = require('../../config.json');

type Note = {
  id: number;
  title: string;
  description: string;
  is_public: boolean;
  priority: number | null;
};

export default function CategoryNotes() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const [notes, setNotes] = useState<Note[]>([]);
  const [allNotes, setAllNotes] = useState<Note[]>([]);
  const { token } = useContext(AuthContext);
  const router = useRouter();

  const fetchCategoryNotes = async () => {
    try {
      const resp = await fetch(`${datos.API_URL}/api/categories/${id}/notes`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await resp.json();
      setNotes(data);
    } catch {
      Alert.alert('Error', 'No se pudo cargar notas de categoría');
    }
  };

  const fetchAllNotes = async () => {
    try {
      const resp = await fetch(`${datos.API_URL}/api/notes`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await resp.json();
      setAllNotes(data);
    } catch {
      Alert.alert('Error', 'No se pudo cargar todas las notas');
    }
  };

  useEffect(() => {
    fetchCategoryNotes();
    fetchAllNotes();
  }, []);

  const handleAddToCategory = async (noteId: number) => {
    try {
      await fetch('http://localhost:3000/api/categories/add-note', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ note_id: noteId, category_id: parseInt(id) })
      });
      fetchCategoryNotes();
    } catch {
      Alert.alert('Error', 'No se pudo asociar nota');
    }
  };

  const handleRemoveFromCategory = async (noteId: number) => {
    try {
      await fetch('http://localhost:3000/api/categories/remove-note', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ note_id: noteId, category_id: parseInt(id) })
      });
      fetchCategoryNotes();
    } catch {
      Alert.alert('Error', 'No se pudo remover nota');
    }
  };

  const renderCatNote = ({ item }: { item: Note }) => (
    <View style={styles.noteItem}>
      <Text style={styles.noteTitle}>{item.title}</Text>
      <Button
        title="Quitar"
        color="#d9534f"
        onPress={() => handleRemoveFromCategory(item.id)}
      />
    </View>
  );

  const renderAllNote = ({ item }: { item: Note }) => (
    <TouchableOpacity
      style={styles.noteItem}
      onPress={() => handleAddToCategory(item.id)}
    >
      <Text style={styles.noteTitle}>{item.title}</Text>
    </TouchableOpacity>
  );

  return (
    <View style={{ flex: 1 }}>
      <View style={styles.header}>
        <Button title="Volver a Categorías" onPress={() => router.push('/categories')} />
      </View>
      <Text style={styles.sectionTitle}>Notas en esta Categoría</Text>
      <FlatList
        data={notes}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderCatNote}
        contentContainerStyle={{ padding: 16 }}
        ListEmptyComponent={<Text style={{ textAlign: 'center' }}>Sin notas</Text>}
      />

      <Text style={styles.sectionTitle}>Agregar Nota a Categoría</Text>
      <FlatList
        data={allNotes.filter((n) => !notes.some((cn) => cn.id === n.id))}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderAllNote}
        contentContainerStyle={{ padding: 16 }}
        ListEmptyComponent={<Text style={{ textAlign: 'center' }}>No hay notas disponibles</Text>}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  header: { padding: 8, flexDirection: 'row', justifyContent: 'flex-start', marginTop: 40 },
  sectionTitle: { marginLeft: 16, marginTop: 12, fontSize: 18, fontWeight: 'bold' },
  noteItem: {
    backgroundColor: '#eef',
    padding: 12,
    marginBottom: 10,
    borderRadius: 6,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  noteTitle: { fontSize: 16 }
});
