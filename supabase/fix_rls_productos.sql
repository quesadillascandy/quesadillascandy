-- ============================================
-- FIX RLS PRODUCTOS - SOLUCIÓN PERMANENTE
-- ============================================
-- Problema: RLS activo sin políticas = acceso bloqueado
-- Solución: Crear políticas que permitan lectura a usuarios autenticados

-- 1. Verificar estado actual
SELECT 
  schemaname, 
  tablename, 
  rowsecurity 
FROM pg_tables 
WHERE tablename = 'productos';

-- 2. Eliminar políticas existentes (si las hay)
DROP POLICY IF EXISTS "productos_select_policy" ON productos;
DROP POLICY IF EXISTS "productos_insert_admin" ON productos;
DROP POLICY IF EXISTS "productos_update_admin" ON productos;
DROP POLICY IF EXISTS "productos_delete_admin" ON productos;

-- 3. Reactivar RLS (por si estaba desactivado)
ALTER TABLE productos ENABLE ROW LEVEL SECURITY;

-- 4. Crear políticas permanentes

-- Política SELECT: Todos los usuarios autenticados pueden ver productos activos
CREATE POLICY "productos_select_policy"
  ON productos
  FOR SELECT
  TO authenticated
  USING (activo = true);

-- Política INSERT: Solo admin y gerente_produccion pueden crear productos
CREATE POLICY "productos_insert_admin"
  ON productos
  FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM perfiles
      WHERE perfiles.id = auth.uid()
      AND perfiles.rol IN ('admin', 'gerente_produccion')
    )
  );

-- Política UPDATE: Solo admin y gerente_produccion pueden actualizar productos
CREATE POLICY "productos_update_admin"
  ON productos
  FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM perfiles
      WHERE perfiles.id = auth.uid()
      AND perfiles.rol IN ('admin', 'gerente_produccion')
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM perfiles
      WHERE perfiles.id = auth.uid()
      AND perfiles.rol IN ('admin', 'gerente_produccion')
    )
  );

-- Política DELETE: Solo admin puede eliminar productos
CREATE POLICY "productos_delete_admin"
  ON productos
  FOR DELETE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM perfiles
      WHERE perfiles.id = auth.uid()
      AND perfiles.rol = 'admin'
    )
  );

-- 5. Verificar que las políticas se crearon correctamente
SELECT 
  schemaname,
  tablename,
  policyname,
  permissive,
  roles,
  cmd
FROM pg_policies 
WHERE tablename = 'productos'
ORDER BY policyname;

-- 6. Probar acceso como usuario autenticado
SELECT 
  id,
  nombre,
  precios->>'mayorista' as precio_mayorista,
  precios->>'minorista' as precio_minorista,
  activo
FROM productos
WHERE activo = true
LIMIT 5;

-- ============================================
-- RESULTADO ESPERADO:
-- ✅ 4 políticas creadas
-- ✅ SELECT: authenticated (todos los usuarios autenticados)
-- ✅ INSERT/UPDATE: solo admin y gerente_produccion
-- ✅ DELETE: solo admin
-- ============================================
