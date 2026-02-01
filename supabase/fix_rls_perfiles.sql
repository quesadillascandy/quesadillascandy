-- ================================================
-- ARREGLO DE RLS PARA TABLA PERFILES
-- ================================================
-- Problema: Las políticas RLS impedían el acceso
-- Solución: Recrear políticas más permisivas
-- ================================================

-- Paso 1: Reactivar RLS
ALTER TABLE perfiles ENABLE ROW LEVEL SECURITY;

-- Paso 2: Eliminar políticas existentes
DROP POLICY IF EXISTS "Usuarios pueden ver su propio perfil" ON perfiles;
DROP POLICY IF EXISTS "Usuarios pueden actualizar su propio perfil" ON perfiles;
DROP POLICY IF EXISTS "Admin puede ver todos los perfiles" ON perfiles;
DROP POLICY IF EXISTS "Admin puede gestionar perfiles" ON perfiles;
DROP POLICY IF EXISTS "Permitir inserción de perfiles" ON perfiles;

-- Paso 3: Crear políticas corregidas

-- SELECT: Usuarios autenticados pueden ver su propio perfil
CREATE POLICY "usuarios_ver_propio_perfil" ON perfiles
  FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

-- SELECT: Admin puede ver todos los perfiles
CREATE POLICY "admin_ver_todos_perfiles" ON perfiles
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM perfiles
      WHERE id = auth.uid() AND rol = 'admin'
    )
  );

-- INSERT: Permitir creación de perfiles (para registro)
CREATE POLICY "permitir_creacion_perfiles" ON perfiles
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = id);

-- UPDATE: Usuarios pueden actualizar su propio perfil
CREATE POLICY "usuarios_actualizar_propio_perfil" ON perfiles
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

-- UPDATE: Admin puede actualizar cualquier perfil
CREATE POLICY "admin_actualizar_perfiles" ON perfiles
  FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM perfiles
      WHERE id = auth.uid() AND rol = 'admin'
    )
  );

-- DELETE: Solo admin puede eliminar perfiles
CREATE POLICY "admin_eliminar_perfiles" ON perfiles
  FOR DELETE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM perfiles
      WHERE id = auth.uid() AND rol = 'admin'
    )
  );

-- Verificar políticas creadas
SELECT schemaname, tablename, policyname, permissive, roles, cmd, qual 
FROM pg_policies 
WHERE tablename = 'perfiles';

-- ================================================
-- RESULTADO ESPERADO
-- ================================================
-- ✅ RLS habilitado
-- ✅ 6 políticas activas
-- ✅ Usuarios pueden:
--    - Ver su propio perfil
--    - Actualizar su propio perfil
-- ✅ Admin puede:
--    - Ver todos los perfiles
--    - Actualizar cualquier perfil
--    - Eliminar perfiles
-- ================================================
