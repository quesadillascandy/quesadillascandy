-- ================================================
-- MIGRACIÓN 5: ROW LEVEL SECURITY (RLS)
-- Proyecto: Quesadillas Candy
-- Fecha: 2026-01-31
-- ================================================

-- ========================================
-- HABILITAR RLS EN TODAS LAS TABLAS
-- ========================================
ALTER TABLE perfiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE productos ENABLE ROW LEVEL SECURITY;
ALTER TABLE pedidos ENABLE ROW LEVEL SECURITY;
ALTER TABLE items_pedido ENABLE ROW LEVEL SECURITY;
ALTER TABLE items_inventario ENABLE ROW LEVEL SECURITY;
ALTER TABLE lotes_inventario ENABLE ROW LEVEL SECURITY;
ALTER TABLE movimientos_inventario ENABLE ROW LEVEL SECURITY;
ALTER TABLE recetas ENABLE ROW LEVEL SECURITY;
ALTER TABLE ingredientes_receta ENABLE ROW LEVEL SECURITY;
ALTER TABLE costos_receta ENABLE ROW LEVEL SECURITY;
ALTER TABLE registros_auditoria ENABLE ROW LEVEL SECURITY;

-- ========================================
-- POLÍTICAS: perfiles
-- ========================================

-- Los usuarios pueden ver su propio perfil
CREATE POLICY "Los usuarios pueden ver su propio perfil"
  ON perfiles FOR SELECT
  USING (auth.uid() = id);

-- Los admins pueden ver todos los perfiles
CREATE POLICY "Los admins pueden ver todos los perfiles"
  ON perfiles FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM perfiles
      WHERE id = auth.uid() AND rol = 'admin'
    )
  );

-- Los usuarios pueden actualizar su propio perfil (excepto rol)
CREATE POLICY "Los usuarios pueden actualizar su propio perfil"
  ON perfiles FOR UPDATE
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id AND rol = (SELECT rol FROM perfiles WHERE id = auth.uid()));

-- Solo admins pueden insertar nuevos perfiles
CREATE POLICY "Solo admins pueden crear perfiles"
  ON perfiles FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM perfiles
      WHERE id = auth.uid() AND rol = 'admin'
    )
  );

-- ========================================
-- POLÍTICAS: productos
-- ========================================

-- Todos los usuarios autenticados pueden ver productos
CREATE POLICY "Todos pueden ver productos"
  ON productos FOR SELECT
  TO authenticated
  USING (TRUE);

-- Solo admin puede modificar productos
CREATE POLICY "Solo admin puede modificar productos"
  ON productos FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM perfiles
      WHERE id = auth.uid() AND rol = 'admin'
    )
  );

-- ========================================
-- POLÍTICAS: pedidos
-- ========================================

-- Los usuarios pueden ver sus propios pedidos
CREATE POLICY "Los usuarios pueden ver sus pedidos"
  ON pedidos FOR SELECT
  USING (id_usuario = auth.uid());

-- Gerentes y analistas pueden ver todos los pedidos
CREATE POLICY "Gerentes y analistas pueden ver todos los pedidos"
  ON pedidos FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM perfiles
      WHERE id = auth.uid() 
      AND rol IN ('admin', 'gerente_produccion', 'analista_financiero')
    )
  );

-- Los usuarios pueden crear sus propios pedidos
CREATE POLICY "Los usuarios pueden crear pedidos"
  ON pedidos FOR INSERT
  WITH CHECK (id_usuario = auth.uid());

-- Gerentes pueden actualizar cualquier pedido
CREATE POLICY "Gerentes pueden actualizar pedidos"
  ON pedidos FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM perfiles
      WHERE id = auth.uid() 
      AND rol IN ('admin', 'gerente_produccion')
    )
  );

-- ========================================
-- POLÍTICAS: items_pedido
-- ========================================

-- Los usuarios pueden ver items de sus propios pedidos
CREATE POLICY "Los usuarios pueden ver items de sus pedidos"
  ON items_pedido FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM pedidos
      WHERE pedidos.id = items_pedido.id_pedido
      AND pedidos.id_usuario = auth.uid()
    )
  );

-- Gerentes y analistas pueden ver todos los items
CREATE POLICY "Gerentes y analistas pueden ver todos los items"
  ON items_pedido FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM perfiles
      WHERE id = auth.uid() 
      AND rol IN ('admin', 'gerente_produccion', 'analista_financiero')
    )
  );

-- ========================================
-- POLÍTICAS: items_inventario
-- ========================================

-- Gerentes y admin pueden ver inventario
CREATE POLICY "Gerentes pueden ver inventario"
  ON items_inventario FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM perfiles
      WHERE id = auth.uid() 
      AND rol IN ('admin', 'gerente_produccion')
    )
  );

-- Solo gerentes pueden modificar inventario
CREATE POLICY "Gerentes pueden modificar inventario"
  ON items_inventario FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM perfiles
      WHERE id = auth.uid() 
      AND rol IN ('admin', 'gerente_produccion')
    )
  );

-- ========================================
-- POLÍTICAS: movimientos_inventario
-- ========================================

-- Gerentes pueden ver todos los movimientos
CREATE POLICY "Gerentes pueden ver movimientos"
  ON movimientos_inventario FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM perfiles
      WHERE id = auth.uid() 
      AND rol IN ('admin', 'gerente_produccion')
    )
  );

-- Gerentes pueden registrar movimientos
CREATE POLICY "Gerentes pueden registrar movimientos"
  ON movimientos_inventario FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM perfiles
      WHERE id = auth.uid() 
      AND rol IN ('admin', 'gerente_produccion')
    )
  );

-- ========================================
-- POLÍTICAS: recetas
-- ========================================

-- Admin, gerentes y analistas pueden ver recetas
CREATE POLICY "Roles autorizados pueden ver recetas"
  ON recetas FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM perfiles
      WHERE id = auth.uid() 
      AND rol IN ('admin', 'gerente_produccion', 'analista_financiero')
    )
  );

-- Solo admin y gerentes pueden modificar recetas
CREATE POLICY "Gerentes pueden modificar recetas"
  ON recetas FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM perfiles
      WHERE id = auth.uid() 
      AND rol IN ('admin', 'gerente_produccion')
    )
  );

-- ========================================
-- POLÍTICAS: ingredientes_receta y costos_receta
-- ========================================

-- Heredan permisos de recetas
CREATE POLICY "Roles autorizados pueden ver ingredientes"
  ON ingredientes_receta FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM perfiles
      WHERE id = auth.uid() 
      AND rol IN ('admin', 'gerente_produccion', 'analista_financiero')
    )
  );

CREATE POLICY "Roles autorizados pueden ver costos"
  ON costos_receta FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM perfiles
      WHERE id = auth.uid() 
      AND rol IN ('admin', 'gerente_produccion', 'analista_financiero')
    )
  );

-- ========================================
-- POLÍTICAS: registros_auditoria
-- ========================================

-- Solo admin puede ver auditoría
CREATE POLICY "Solo admin puede ver auditoría"
  ON registros_auditoria FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM perfiles
      WHERE id = auth.uid() AND rol = 'admin'
    )
  );

-- ========================================
-- POLÍTICAS: lotes_inventario
-- ========================================

-- Gerentes pueden ver lotes
CREATE POLICY "Gerentes pueden ver lotes"
  ON lotes_inventario FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM perfiles
      WHERE id = auth.uid() 
      AND rol IN ('admin', 'gerente_produccion')
    )
  );
