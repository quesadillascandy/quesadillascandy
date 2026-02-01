-- ================================================
-- USUARIOS DE PRUEBA - QUESADILLAS CANDY
-- Fecha: 2026-01-31
-- ================================================
-- 
-- IMPORTANTE: Ejecuta este script DESPUÉS de crear los usuarios en Supabase Auth
-- 
-- Pasos para crear usuarios:
-- 1. Ve a Supabase Dashboard → Authentication → Users
-- 2. Por cada rol, click "Add User" → "Create new user"
-- 3. Usa los emails y passwords listados abajo
-- 4. MARCA "Auto Confirm User" para todos
-- 5. COPIA el UUID generado para cada usuario
-- 6. REEMPLAZA los UUIDs en este script con los reales
-- 7. Ejecuta este script en SQL Editor
-- 
-- ================================================

-- ========================================
-- 1. ADMIN - Acceso Total
-- ========================================
-- Email: admin@quesadillas.com
-- Password: Admin123!
-- UUID: REEMPLAZAR-CON-UUID-REAL

INSERT INTO perfiles (id, email, nombre_completo, rol, telefono) VALUES
  ('REEMPLAZAR-CON-UUID-REAL', 
   'admin@quesadillas.com', 
   'Carlos Administrador', 
   'admin',
   '7111-0001');

-- ========================================
-- 2. GERENTE DE PRODUCCIÓN
-- ========================================
-- Email: gerente@quesadillas.com
-- Password: Gerente123!
-- UUID: REEMPLAZAR-CON-UUID-REAL

INSERT INTO perfiles (id, email, nombre_completo, rol, telefono) VALUES
  ('REEMPLAZAR-CON-UUID-REAL', 
   'gerente@quesadillas.com', 
   'Juan Gerente', 
   'gerente_produccion',
   '7111-0002');

-- ========================================
-- 3. ANALISTA FINANCIERO
-- ========================================
-- Email: analista@quesadillas.com
-- Password: Analista123!
-- UUID: REEMPLAZAR-CON-UUID-REAL

INSERT INTO perfiles (id, email, nombre_completo, rol, telefono) VALUES
  ('REEMPLAZAR-CON-UUID-REAL', 
   'analista@quesadillas.com', 
   'María Analista', 
   'analista_financiero',
   '7111-0003');

-- ========================================
-- 4. CLIENTE MAYORISTA
-- ========================================
-- Email: mayorista@empresa.com
-- Password: Mayorista123!
-- UUID: REEMPLAZAR-CON-UUID-REAL

INSERT INTO perfiles (id, email, nombre_completo, rol, telefono) VALUES
  ('REEMPLAZAR-CON-UUID-REAL', 
   'mayorista@empresa.com', 
   'Distribuidora El Salvador S.A.', 
   'mayorista',
   '7222-0001');

-- ========================================
-- 5. CLIENTE MINORISTA
-- ========================================
-- Email: minorista@cafe.com
-- Password: Minorista123!
-- UUID: REEMPLAZAR-CON-UUID-REAL

INSERT INTO perfiles (id, email, nombre_completo, rol, telefono) VALUES
  ('REEMPLAZAR-CON-UUID-REAL', 
   'minorista@cafe.com', 
   'Café La Esquina', 
   'minorista',
   '7333-0001');

-- ========================================
-- 6. CLIENTE EXPORTACIÓN
-- ========================================
-- Email: export@international.com
-- Password: Export123!
-- UUID: REEMPLAZAR-CON-UUID-REAL

INSERT INTO perfiles (id, email, nombre_completo, rol, telefono) VALUES
  ('REEMPLAZAR-CON-UUID-REAL', 
   'export@international.com', 
   'Global Foods Inc.', 
   'exportacion',
   '1-800-0001');

-- ========================================
-- VERIFICACIÓN
-- ========================================
-- Ejecuta esto para verificar que todos los usuarios se crearon correctamente:

SELECT 
  nombre_completo,
  email,
  rol,
  telefono,
  created_at
FROM perfiles
ORDER BY 
  CASE rol
    WHEN 'admin' THEN 1
    WHEN 'gerente_produccion' THEN 2
    WHEN 'analista_financiero' THEN 3
    WHEN 'mayorista' THEN 4
    WHEN 'minorista' THEN 5
    WHEN 'exportacion' THEN 6
  END;

-- ========================================
-- NOTA FINAL
-- ========================================
-- Después de crear los usuarios, prueba el login con cada uno
-- para verificar que funciona correctamente y que los permisos
-- se aplican como se esperaba.
