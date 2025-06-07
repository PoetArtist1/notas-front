// src/context/AuthContext.tsx

import React, { createContext, useState, useEffect, ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';  // para persistencia local
import { useRouter, useSegments } from 'expo-router';                  // para navegar y leer ruta actual

// Definimos la forma de nuestro contexto de autenticación
type AuthContextType = {
  token: string | null;                              // JWT o similar para API
  username: string | null;                           // nombre de usuario para mostrar saludo
  login: (newToken: string, newUsername: string) => Promise<void>;  // función para iniciar sesión
  logout: () => Promise<void>;                       // función para cerrar sesión
};

// Creamos el contexto con valores por defecto
export const AuthContext = createContext<AuthContextType>({
  token: null,
  username: null,
  login: async () => {},
  logout: async () => {},
});

// Proveedor que envuelve la app y maneja todo lo relacionado a auth
export function AuthProvider({ children }: { children: ReactNode }) {
  // Estado local para token y username. undefined = estamos cargando desde AsyncStorage
  const [token, setToken] = useState<string | null | undefined>(undefined);
  const [username, setUsername] = useState<string | null | undefined>(undefined);

  const router = useRouter();    // para redirecciones imperativas
  const segments = useSegments(); // array de segmentos de ruta (ej: ['notes','1'])

  // Al montar: leemos de AsyncStorage las credenciales guardadas
  useEffect(() => {
    AsyncStorage.getItem('token')
      .then((storedToken) => setToken(storedToken))  // si no existe, storedToken será null
      .catch(() => setToken(null));

    AsyncStorage.getItem('username')
      .then((storedUser) => setUsername(storedUser))
      .catch(() => setUsername(null));
  }, []);

  // Cuando token o username cambian de undefined a null/string, revisamos rutas
  useEffect(() => {
    // Si aún no sabemos ambos valores, no hacemos nada (evita redirección prematura)
    if (token === undefined || username === undefined) return;

    // Si NO estamos autenticados y no estamos en /login o /register, vamos a /login
    if (!token && segments[0] !== 'login' && segments[0] !== 'register') {
      router.replace('/login');
      return;
    }

    // Si ESTAMOS autenticados y estamos en la raíz (segments[0] es undefined), vamos a /notes
    if (token && segments[0] === undefined) {
      router.replace('/notes');
    }
  }, [token, username, segments]);

  // Función para iniciar sesión: guarda en AsyncStorage y actualiza estado
  const login = async (newToken: string, newUsername: string) => {
    await AsyncStorage.setItem('token', newToken);
    await AsyncStorage.setItem('username', newUsername);
    setToken(newToken);
    setUsername(newUsername);
    router.replace('/notes');  // después de login, llevamos a la lista de notas
  };

  // Función para cerrar sesión: limpia storage y estado, redirige a /login
  const logout = async () => {
    await AsyncStorage.removeItem('token');
    await AsyncStorage.removeItem('username');
    setToken(null);
    setUsername(null);
    router.replace('/login');
  };

  // Proveemos token, username y funciones a toda la app
  return (
    <AuthContext.Provider
      value={{
        token: token as string | null,
        username: username as string | null,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
