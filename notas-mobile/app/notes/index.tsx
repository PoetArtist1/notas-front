// app/notes/index.tsx
import React, { useEffect, useState, useContext } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  Button,
  StyleSheet,
  Alert,
} from 'react-native';
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
        headers: { Authorization: `Bearer ${token}` },
      });
      const data: Note[] = await resp.json();
      // Ordenamos: primero favoritos (priority != null) por priority desc, luego los demás alfabéticamente
      const favs = data
        .filter((n) => n.priority !== null)
        .sort((a, b) => b.priority! - a.priority!);
      const others = data
        .filter((n) => n.priority === null)
        .sort((a, b) => a.title.localeCompare(b.title));
      setNotes([...favs, ...others]);
    } catch (err) {
      Alert.alert('Error', 'No se pudo cargar notas');
    }
  };

  useEffect(() => {
    fetchNotes();
  }, []);

  // Alternar favorito: si ya tiene priority, quitar; si no, marcar con prioridad 1
  const toggleFavorite = async (noteId: number, isFav: boolean) => {
    try {
      if (isFav) {
        // Quitar favorito
        await fetch(`${datos.API_URL}/api/favorites`, {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ note_id: noteId }),
        });
      } else {
        // Marcar favorito con prioridad 1 por defecto
        await fetch(`${datos.API_URL}/api/favorites`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ note_id: noteId, priority: 1 }),
        });
      }
      fetchNotes();
    } catch {
      Alert.alert('Error', 'No se pudo actualizar favorito');
    }
  };

  const renderItem = ({ item }: { item: Note }) => {
    const isFav = item.priority !== null;
    return (
      <View style={styles.noteItemContainer}>
        <TouchableOpacity
          style={styles.noteContent}
          onPress={() => router.push(`/notes/${item.id}`)}
        >
          <Text style={styles.noteTitle}>{item.title}</Text>
          {item.priority !== null && (
            <Text style={styles.priority}>Favorita</Text>
          )}
          <Text style={item.is_public ? styles.public : styles.private}>
            {item.is_public ? 'Pública' : 'Personal'}
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.starContainer}
          onPress={() => toggleFavorite(item.id, isFav)}
        >
          <Text style={styles.star}>{isFav ? '★' : '☆'}</Text>
        </TouchableOpacity>
      </View>
    );
  };

  return (
    <View style={{ flex: 1 }}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.headerButton} onPress={logout}>
          <Text style={styles.headerButtonText}>Cerrar Sesión</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.headerButton}
          onPress={() => router.push('/categories')}
        >
          <Text style={styles.headerButtonText}>Categorías</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.headerButton}
          onPress={() => router.push('/favorites')}
        >
          <Text style={styles.headerButtonText}>Favoritos</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.addButton}>
        <TouchableOpacity
          style={styles.headerButton} onPress={() => router.push('/notes/create')}
        >
        <Text style={styles.headerButtonText}>Crear nota</Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={notes}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderItem}
        contentContainerStyle={{
          padding: 15,
          marginTop: 20,
        }}
        ListEmptyComponent={
          <Text style={{ textAlign: 'center', fontWeight: 'bold' }}>
            No hay notas
          </Text>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    marginTop: 60,
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 15,
    elevation: 5,
  },
  headerButton: {
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 4,
    backgroundColor: '#ffffff',
  },
  headerButtonText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    textAlign: 'center',
  },
  addButton: {
    width: 180,
    flexDirection: 'row',
    padding: 15,
    marginTop: 10,
  },
  noteItemContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f9f9f9',
    padding: 12,
    marginBottom: 10,
    borderRadius: 10,
    elevation: 5,
  },
  noteContent: {
    flex: 1,
  },
  noteTitle: { fontSize: 18, fontWeight: 'bold' },
  priority: { color: '#e0d619', fontSize: 14 },
  public: { color: '#5cb85c', fontSize: 14 },
  private: { color: '#b8000f', fontSize: 14 },
  starContainer: {
    marginLeft: 10,
    padding: 4,
  },
  star: {
    fontSize: 40,
    color: '#e0d619',
  },
});
