// app/categories/index.tsx
import React, { useEffect, useState, useContext } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  Alert,
  StyleSheet
} from 'react-native';
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
      'Al borrar la categoría, las notas enlazadas se eliminarán. ¿Continuar?',
      [
        { text: 'Cancelar' },
        {
          text: 'Sí, borrar',
          onPress: async () => {
            try {
              const resp = await fetch(
                `${datos.API_URL}/api/categories/${catId}`,
                {
                  method: 'DELETE',
                  headers: { Authorization: `Bearer ${token}` }
                }
              );
              if (resp.ok) {
                fetchCategories();
              } else {
                const data = await resp.json();
                Alert.alert(
                  'Error',
                  data.msg || 'No se pudo eliminar categoría'
                );
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
      <TouchableOpacity
        onPress={() => handleDelete(item.id)}
        style={styles.deleteButton}
      >
        <Text style={styles.deleteText}>Borrar</Text>
      </TouchableOpacity>
    </TouchableOpacity>
  );

  return (
    <View style={{ flex: 1 }}>
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.headerButton}
          onPress={() => router.push('/categories/create')}
        >
          <Text style={styles.headerButtonText}>Crear categoría</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.headerButton}
          onPress={() => router.push('/notes')}
        >
          <Text style={styles.headerButtonText}>Volver a notas</Text>
        </TouchableOpacity>
      </View>
      <FlatList
        data={categories}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderItem}
        contentContainerStyle={{ padding: 16 }}
        ListEmptyComponent={
          <Text style={{ textAlign: 'center' }}>
            No hay categorías
          </Text>
        }
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
  catName: { fontSize: 18 },
  deleteButton: {
    paddingVertical: 4,
    paddingHorizontal: 8,
    backgroundColor: '#d9534f',
    borderRadius: 4
  },
  deleteText: {
    color: '#fff',
    fontWeight: 'bold'
  }
});
