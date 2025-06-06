// app/notes/index.tsx
import React, { useEffect, useState, useContext } from 'react';
import { View, Text, FlatList, TouchableOpacity, Button, StyleSheet, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { AuthContext } from '../../src/context/AuthContext';

const datos = require('../../config.json');

type Note = {
  id: number;
  title: string;
  description: string;
  is_public: boolean;
  priority: number | null;
};

export default function NotesList() {
  const [notes, setNotes] = useState<Note[]>([]);
  const { token, logout } = useContext(AuthContext);
  const router = useRouter();

  const fetchNotes = async () => {
    try {
      const resp = await fetch(`${datos.API_URL}/api/notes`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await resp.json();
      setNotes(data);
    } catch (err) {
      Alert.alert('Error', 'No se pudo cargar notas');
    }
  };

  useEffect(() => {
    fetchNotes();
  }, []);

  const renderItem = ({ item }: { item: Note }) => (
    <TouchableOpacity
      style={styles.noteItem}
      onPress={() => router.push(`/notes/${item.id}`)}
    >
      <Text style={styles.noteTitle}>{item.title}</Text>
      {item.priority && <Text style={styles.priority}>Prioridad: {item.priority}</Text>}
      {item.is_public && <Text style={styles.public}>Pública</Text>}
    </TouchableOpacity>
  );

  return (
    <View style={{ flex: 1 }}>
      <View style={styles.header}>
        <Button title="Cerrar Sesión" onPress={logout} />
        <Button title="+" onPress={() => router.push('/notes/create')} />
        <Button title="Categorías" onPress={() => router.push('/categories')} />
        <Button title="☆" onPress={() => router.push('/favorites')} />
      </View>
      <FlatList
        data={notes}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderItem}
        contentContainerStyle={{ 
          padding: 16,
          marginTop:40,
         }}
        ListEmptyComponent={<Text style={{ textAlign: 'center' }}>No hay notas</Text>}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    marginTop: 60,
    flexDirection: 'row',
    justifyContent: 'space-around',
    padding: 5
  },
  noteItem: {
    backgroundColor: '#f9f9f9',
    padding: 12,
    marginBottom: 10,
    borderRadius: 6
  },
  noteTitle: { fontSize: 18, fontWeight: 'bold' },
  priority: { color: '#d9534f' },
  public: { color: '#5cb85c' }
});
