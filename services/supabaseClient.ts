import { createClient } from '@supabase/supabase-js';

// Configuración de Supabase desde variables de entorno
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Validar que las variables estén configuradas
if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error(
    'Faltan variables de entorno. Asegúrate de configurar VITE_SUPABASE_URL y VITE_SUPABASE_ANON_KEY'
  );
}


// Crear cliente de Supabase
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
  },
  db: {
    schema: 'public',
  },
  global: {
    headers: {
      'X-Client-Info': 'quesadillas-candy-app@1.0.0',
    },
  },
});

/**
 * Helper para manejar errores de Supabase
 */
export const handleSupabaseError = (error: any) => {
  console.error('Error de Supabase:', error);

  if (error.code === 'PGRST116') {
    return 'Registro no encontrado';
  }

  if (error.code === '23505') {
    return 'Este registro ya existe';
  }

  if (error.code === '23503') {
    return 'No se puede eliminar porque tiene registros relacionados';
  }

  if (error.message) {
    return error.message;
  }

  return 'Error desconocido al comunicar con la base de datos';
};

/**
 * Helper para queries con manejo de errores
 */
export const executeQuery = async <T>(
  queryFn: () => Promise<{ data: T | null; error: any }>
): Promise<{ data: T | null; error: string | null }> => {
  try {
    const { data, error } = await queryFn();

    if (error) {
      return { data: null, error: handleSupabaseError(error) };
    }

    return { data, error: null };
  } catch (err) {
    console.error('Error ejecutando query:', err);
    return { data: null, error: 'Error de conexión con la base de datos' };
  }
};
