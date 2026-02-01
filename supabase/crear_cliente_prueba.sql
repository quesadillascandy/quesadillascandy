-- ================================================
-- CREAR USUARIO CLIENTE PARA PRUEBAS DE PEDIDOS
-- ================================================
-- Paso 1: Crear usuario en Supabase Auth primero
-- Paso 2: Ejecutar este script con el UUID correcto
-- ================================================

-- INSTRUCCIONES:
-- 1. Ve a Supabase Dashboard → Authentication → Users
-- 2. Click "Add User" → "Create new user"
-- 3. Email: cliente@empresa.com
-- 4. Password: Cliente2025$
-- 5. ✅ Auto Confirm User
-- 6. Copia el UUID generado
-- 7. Reemplaza 'UUID-DEL-CLIENTE' abajo con el UUID real
-- 8. Ejecuta este script

-- ================================================
-- CLIENTE MAYORISTA (Ejemplo: Distribuidora)
-- ================================================
INSERT INTO perfiles (id, email, nombre_completo, rol, telefono, precio_mayorista, precio_menudeo) 
VALUES (
  'UUID-DEL-CLIENTE',  -- ⚠️ REEMPLAZAR CON UUID REAL
  'cliente@empresa.com',
  'Distribuidora El Salvador',
  'mayorista',
  '7222-5555',
  10.00,  -- Precio mayorista: $10
  5.00    -- Precio menudeo: $5
);

-- ================================================
-- VERIFICACIÓN
-- ================================================
SELECT 
  id,
  nombre_completo,
  email,
  rol,
  telefono,
  precio_mayorista,
  precio_menudeo,
  created_at
FROM perfiles 
WHERE email = 'cliente@empresa.com';

-- ================================================
-- CREDENCIALES PARA LOGIN
-- ================================================
-- Email:    cliente@empresa.com
-- Password: Cliente2025$
-- Rol:      Mayorista (puede hacer pedidos)
-- ================================================

-- ================================================
-- ALTERNATIVA: Crear varios tipos de clientes
-- ================================================

-- Cliente Minorista (Café, Restaurante)
-- INSERT INTO perfiles (id, email, nombre_completo, rol, telefono, precio_mayorista, precio_menudeo) 
-- VALUES (
--   'UUID-MINORISTA',
--   'cafe@ejemplo.com',
--   'Café La Esquina',
--   'minorista',
--   '7333-6666',
--   12.00,
--   6.00
-- );

-- Cliente Exportación (Internacional)
-- INSERT INTO perfiles (id, email, nombre_completo, rol, telefono, precio_mayorista, precio_menudeo) 
-- VALUES (
--   'UUID-EXPORTACION',
--   'export@company.com',
--   'Global Foods Inc.',
--   'exportacion',
--   '1-800-7777',
--   15.00,
--   8.00
-- );
