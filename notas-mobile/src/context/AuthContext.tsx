// src/context/AuthContext.tsx
import React, { createContext, useState, useEffect, ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter, useSegments } from 'expo-router';

type AuthContextType = {
  token: string | null;
  login: (newToken: string) => Promise<void>;
  logout: () => Promise<void>;
};

export const AuthContext = createContext<AuthContextType>({
  token: null,
  login: async () => {},
  logout: async () => {}
});

export function AuthProvider({ children }: { children: ReactNode }) {
  // 1) Inicializamos token en undefined → “aún no he leído AsyncStorage”
  const [token, setToken] = useState<string | null | undefined>(undefined);
  const router = useRouter();
  const segments = useSegments();

  // 2) Al montar, leemos AsyncStorage y luego seteamos token a string o a null
  useEffect(() => {
    AsyncStorage.getItem('token')
      .then((stored) => {
        setToken(stored); // si no existe, stored será null
      })
      .catch(() => {
        setToken(null);
      });
  }, []);

  // 3) Solo cuando `token` deja de ser undefined (es null o string), realizamos la lógica de redirección
  useEffect(() => {
    // Si aún sigue en undefined → no hago nada (está “cargando”)
    if (token === undefined) return;

    // Si no hay token y no estamos en /login ni /register → voy a /login
    if (!token && segments[0] !== 'login' && segments[0] !== 'register') {
      router.replace('/login');
      return;
    }

    // Si sí hay token y estoy en la ruta raíz ("/" o "index") → voy a /notes
    // segments = [] al estar en "/"
    if (token && (segments.length === 0 || segments[0] === 'index')) {
      router.replace('/notes');
    }
  }, [token, segments]);

  const login = async (newToken: string) => {
    await AsyncStorage.setItem('token', newToken);
    setToken(newToken);
    router.replace('/notes');
  };

  const logout = async () => {
    await AsyncStorage.removeItem('token');
    setToken(null);
    router.replace('/login');
  };

  return (
    <AuthContext.Provider value={{ token: token as string | null, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}
