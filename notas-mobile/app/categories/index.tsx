// app/categories/index.tsx
import React, { useEffect, useState, useContext } from 'react';
import { View, Text, FlatList, TouchableOpacity, Button, StyleSheet, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { AuthContext } from '../../src/context/AuthContext';

const datos = require('../../config.json');

type Category = {
  id: number;
  name: string;
};

export default function CategoriesList() {
  const [categories, setCategories] = useState<Category[]>([]);
  const { token } = useContext(AuthContext);
  const router = useRouter();

  const fetchCategories = async () => {
    try {
      const resp = await fetch(`${datos.API_URL}/api/categories`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await resp.json();
      setCategories(data);
    } catch {
      Alert.alert('Error', 'No se pudo cargar categorías');
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const handleDelete = async (catId: number) => {
    Alert.alert(
      'Confirmar',
      'Al borrar la categoría, las notas se desvincularán. ¿Continuar?',
      [
        { text: 'Cancelar' },
        {
          text: 'Sí, borrar',
          onPress: async () => {
            try {
              const resp = await fetch(`${datos.API_URL}/api/categories/${catId}`, {
                method: 'DELETE',
                headers: { Authorization: `Bearer ${token}` }
              });
              if (resp.ok) {
                fetchCategories();
              } else {
                const data = await resp.json();
                Alert.alert('Error', data.msg || 'No se pudo eliminar categoría');
              }
            } catch {
              Alert.alert('Error', 'No se pudo conectar al servidor');
            }
          }
        }
      ]
    );
  };

  const renderItem = ({ item }: { item: Category }) => (
    <TouchableOpacity
      style={styles.catItem}
      onPress={() => router.push(`/categories/${item.id}`)}
    >
      <Text style={styles.catName}>{item.name}</Text>
      <Button title="Borrar" color="#d9534f" onPress={() => handleDelete(item.id)} />
    </TouchableOpacity>
  );

  return (
    <View style={{ flex: 1 }}>
      <View style={styles.header}>
        <Button title="Agregar Categoría" onPress={() => router.push('/categories/create')} />
        <Button title="Volver a Notas" onPress={() => router.push('/notes')} />
      </View>
      <FlatList
        data={categories}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderItem}
        contentContainerStyle={{ padding: 16 }}
        ListEmptyComponent={<Text style={{ textAlign: 'center' }}>No hay categorías</Text>}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    padding: 8,
    marginTop: 40
  },
  catItem: {
    backgroundColor: '#f2f2f2',
    padding: 12,
    marginBottom: 10,
    borderRadius: 6,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  catName: { fontSize: 18 }
});
