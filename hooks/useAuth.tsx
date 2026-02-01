
import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '../services/supabaseClient';
import { UserProfile, UserRole } from '../types';
import type { User, Session } from '@supabase/supabase-js';

interface AuthContextType {
  user: User | null;
  profile: UserProfile | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  register: (data: RegisterData) => Promise<boolean>;
  logout: () => Promise<void>;
}

interface RegisterData {
  email: string;
  password: string;
  full_name: string;
  role: UserRole;
  phone_number?: string;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  // Cargar perfil del usuario desde la tabla perfiles
  const loadProfile = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from('perfiles')
        .select('*')
        .eq('id', userId)
        .single();

      if (error) {
        console.error('Error cargando perfil:', error);
        return null;
      }

      return {
        id: data.id,
        email: data.email,
        full_name: data.nombre_completo,
        role: data.rol as UserRole,
        phone_number: data.telefono,
        avatar_url: data.avatar_url,
      } as UserProfile;
    } catch (err) {
      console.error('Error al cargar perfil:', err);
      return null;
    }
  };

  // Inicializar sesión al cargar
  useEffect(() => {
    const initializeAuth = async () => {
      try {
        // Obtener sesión actual
        const { data: { session } } = await supabase.auth.getSession();

        if (session?.user) {
          setUser(session.user);
          const userProfile = await loadProfile(session.user.id);
          setProfile(userProfile);
        }

        // Escuchar cambios en la autenticación
        const { data: { subscription } } = supabase.auth.onAuthStateChange(
          async (_event, session) => {
            setUser(session?.user ?? null);

            if (session?.user) {
              const userProfile = await loadProfile(session.user.id);
              setProfile(userProfile);
            } else {
              setProfile(null);
            }
          }
        );

        setLoading(false);

        return () => {
          subscription.unsubscribe();
        };
      } catch (error) {
        console.error('Error inicializando autenticación:', error);
        setLoading(false);
      }
    };

    initializeAuth();
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      setLoading(true);

      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        console.error('Error en login:', error.message);
        setLoading(false);
        return false;
      }

      if (data.user) {
        setUser(data.user);
        const userProfile = await loadProfile(data.user.id);
        setProfile(userProfile);
        setLoading(false);
        return true;
      }

      setLoading(false);
      return false;
    } catch (err) {
      console.error('Error inesperado en login:', err);
      setLoading(false);
      return false;
    }
  };

  const register = async (data: RegisterData): Promise<boolean> => {
    try {
      setLoading(true);

      // 1. Crear usuario en Supabase Auth
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: data.email,
        password: data.password,
      });

      if (authError) {
        console.error('Error creando usuario:', authError.message);
        alert(`Error al registrar: ${authError.message}`);
        setLoading(false);
        return false;
      }

      if (!authData.user) {
        alert('Error: No se pudo crear el usuario');
        setLoading(false);
        return false;
      }

      // 2. Crear perfil en tabla perfiles
      const { error: profileError } = await supabase.from('perfiles').insert({
        id: authData.user.id,
        email: data.email,
        nombre_completo: data.full_name,
        rol: data.role,
        telefono: data.phone_number || null,
      });

      if (profileError) {
        console.error('Error creando perfil:', profileError.message);
        alert(`Error al crear perfil: ${profileError.message}`);
        setLoading(false);
        return false;
      }

      // 3. Auto-login después del registro
      const loginSuccess = await login(data.email, data.password);
      setLoading(false);
      return loginSuccess;
    } catch (err) {
      console.error('Error inesperado en registro:', err);
      alert('Error al registrar usuario');
      setLoading(false);
      return false;
    }
  };

  const logout = async () => {
    try {
      await supabase.auth.signOut();
      setUser(null);
      setProfile(null);
    } catch (err) {
      console.error('Error al cerrar sesión:', err);
    }
  };

  return (
    <AuthContext.Provider value={{ user, profile, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
};
