// app/favorites.tsx
import React, { useEffect, useState, useContext } from 'react';
import { View, Text, FlatList, Button, StyleSheet, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { AuthContext } from '../src/context/AuthContext';

const datos = require('../config.json');

type Note = {
  id: number;
  title: string;
  description: string;
  is_public: boolean;
  priority: number;
};

export default function Favorites() {
  const [favorites, setFavorites] = useState<Note[]>([]);
  const { token } = useContext(AuthContext);
  const router = useRouter();

  const fetchFavorites = async () => {
    try {
      const resp = await fetch(`${datos.API_URL}/api/favorites`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data: Note[] = await resp.json();
      setFavorites(data);
    } catch {
      Alert.alert('Error', 'No se pudo cargar favoritos');
    }
  };

  useEffect(() => {
    fetchFavorites();
  }, []);

  const renderItem = ({ item }: { item: Note }) => (
    <View style={styles.noteItem}>
      <Text style={styles.noteTitle}>{item.title}</Text>
      <Text>Favorito</Text>
      <Button title="Ver" onPress={() => router.push(`/notes/${item.id}`)} />
    </View>
  );

  return (
    <View style={{ flex: 1 }}>
      <View style={styles.header}>
        <Button title="Volver a Notas" onPress={() => router.push('/notes')} />
      </View>
      <FlatList
        data={favorites}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderItem}
        contentContainerStyle={{ padding: 16 }}
        ListEmptyComponent={<Text style={{ textAlign: 'center' }}>No hay favoritos</Text>}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  header: { padding: 8, flexDirection: 'row', justifyContent: 'flex-start', marginTop: 40 },
  noteItem: {
    backgroundColor: '#fff2e6',
    padding: 12,
    marginBottom: 10,
    borderRadius: 6,
  },
  noteTitle: { fontSize: 18, fontWeight: 'bold' },
});
