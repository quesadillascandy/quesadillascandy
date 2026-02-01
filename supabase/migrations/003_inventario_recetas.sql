-- ================================================
-- MIGRACIÓN 3: INVENTARIO Y RECETAS
-- Proyecto: Quesadillas Candy
-- Fecha: 2026-01-31
-- ================================================

-- ========================================
-- TABLA: items_inventario
-- ========================================
CREATE TABLE items_inventario (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  nombre TEXT NOT NULL,
  tipo tipo_item_inventario NOT NULL,
  categoria categoria_inventario NOT NULL DEFAULT 'NO_PERECEDERO',
  unidad TEXT NOT NULL,
  stock_actual DECIMAL(12,2) DEFAULT 0,
  stock_minimo DECIMAL(12,2) DEFAULT 0,
  stock_maximo DECIMAL(12,2) DEFAULT 0,
  costo_promedio DECIMAL(12,2) DEFAULT 0,
  ultimo_precio DECIMAL(12,2) DEFAULT 0,
  ubicacion TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

COMMENT ON TABLE items_inventario IS 'Catálogo de materias primas e insumos';
COMMENT ON COLUMN items_inventario.costo_promedio IS 'Costo promedio ponderado (PPP)';

-- Índices
CREATE INDEX idx_items_inventario_tipo ON items_inventario(tipo);
CREATE INDEX idx_items_inventario_categoria ON items_inventario(categoria);
CREATE INDEX idx_items_inventario_stock_bajo ON items_inventario(stock_actual) WHERE stock_actual < stock_minimo;

-- ========================================
-- TABLA: lotes_inventario
-- ========================================
CREATE TABLE lotes_inventario (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  id_item UUID NOT NULL REFERENCES items_inventario(id) ON DELETE CASCADE,
  numero_lote TEXT NOT NULL,
  cantidad_inicial DECIMAL(12,2) NOT NULL,
  cantidad_actual DECIMAL(12,2) NOT NULL,
  fecha_vencimiento TIMESTAMPTZ,
  costo_unitario DECIMAL(12,2) NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

COMMENT ON TABLE lotes_inventario IS 'Trazabilidad de lotes de inventario (FIFO/FEFO)';

-- Índices
CREATE INDEX idx_lotes_item ON lotes_inventario(id_item);
CREATE INDEX idx_lotes_vencimiento ON lotes_inventario(fecha_vencimiento);

-- ========================================
-- TABLA: movimientos_inventario
-- ========================================
CREATE TABLE movimientos_inventario (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  id_item UUID NOT NULL REFERENCES items_inventario(id) ON DELETE CASCADE,
  tipo tipo_movimiento NOT NULL,
  cantidad DECIMAL(12,2) NOT NULL,
  precio_unitario DECIMAL(12,2),
  costo_total DECIMAL(12,2),
  razon TEXT NOT NULL,
  id_usuario UUID REFERENCES perfiles(id) ON DELETE SET NULL,
  nombre_usuario TEXT NOT NULL,
  id_lote UUID REFERENCES lotes_inventario(id) ON DELETE SET NULL,
  stock_despues DECIMAL(12,2) NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

COMMENT ON TABLE movimientos_inventario IS 'Kardex de movimientos de inventario';
COMMENT ON COLUMN movimientos_inventario.stock_despues IS 'Stock resultante después del movimiento';

-- Índices
CREATE INDEX idx_movimientos_item ON movimientos_inventario(id_item);
CREATE INDEX idx_movimientos_tipo ON movimientos_inventario(tipo);
CREATE INDEX idx_movimientos_created_at ON movimientos_inventario(created_at DESC);
CREATE INDEX idx_movimientos_usuario ON movimientos_inventario(id_usuario);

-- ========================================
-- TABLA: recetas
-- ========================================
CREATE TABLE recetas (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  id_producto UUID REFERENCES productos(id) ON DELETE CASCADE,
  nombre TEXT NOT NULL,
  version INT DEFAULT 1,
  rendimiento DECIMAL(10,2) DEFAULT 1,
  tiempo_preparacion_minutos INT,
  instrucciones TEXT,
  activa BOOLEAN DEFAULT TRUE,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

COMMENT ON TABLE recetas IS 'Recetas estándar de productos';
COMMENT ON COLUMN recetas.rendimiento IS 'Cantidad de unidades que produce esta receta';
COMMENT ON COLUMN recetas.version IS 'Versión de la receta para control de cambios';

-- Índices
CREATE INDEX idx_recetas_producto ON recetas(id_producto);
CREATE INDEX idx_recetas_activa ON recetas(activa);

-- ========================================
-- TABLA: ingredientes_receta
-- ========================================
CREATE TABLE ingredientes_receta (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  id_receta UUID NOT NULL REFERENCES recetas(id) ON DELETE CASCADE,
  id_item_inventario UUID NOT NULL REFERENCES items_inventario(id) ON DELETE RESTRICT,
  cantidad DECIMAL(12,4) NOT NULL,
  unidad TEXT NOT NULL,
  porcentaje_merma DECIMAL(5,2) DEFAULT 0
);

COMMENT ON TABLE ingredientes_receta IS 'Ingredientes requeridos por cada receta';
COMMENT ON COLUMN ingredientes_receta.porcentaje_merma IS 'Porcentaje de desperdicio/merma (0-100)';

-- Índices
CREATE INDEX idx_ingredientes_receta ON ingredientes_receta(id_receta);
CREATE INDEX idx_ingredientes_item ON ingredientes_receta(id_item_inventario);

-- ========================================
-- TABLA: costos_receta
-- ========================================
CREATE TABLE costos_receta (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  id_receta UUID NOT NULL REFERENCES recetas(id) ON DELETE CASCADE,
  concepto TEXT NOT NULL,
  monto DECIMAL(10,2) NOT NULL,
  es_por_unidad BOOLEAN DEFAULT TRUE
);

COMMENT ON TABLE costos_receta IS 'Costos adicionales de producción (mano de obra, energía, etc)';
COMMENT ON COLUMN costos_receta.es_por_unidad IS 'TRUE: costo por unidad, FALSE: costo por lote completo';

-- Índices
CREATE INDEX idx_costos_receta ON costos_receta(id_receta);

-- ========================================
-- TABLA: registros_auditoria
-- ========================================
CREATE TABLE registros_auditoria (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  id_usuario UUID REFERENCES perfiles(id) ON DELETE SET NULL,
  accion TEXT NOT NULL,
  nombre_tabla TEXT NOT NULL,
  id_registro TEXT NOT NULL,
  datos_anteriores JSONB,
  datos_nuevos JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

COMMENT ON TABLE registros_auditoria IS 'Registro de auditoría de cambios críticos';

-- Índices
CREATE INDEX idx_auditoria_usuario ON registros_auditoria(id_usuario);
CREATE INDEX idx_auditoria_tabla ON registros_auditoria(nombre_tabla);
CREATE INDEX idx_auditoria_created_at ON registros_auditoria(created_at DESC);

-- ========================================
-- Triggers de updated_at
-- ========================================
CREATE TRIGGER trigger_items_inventario_updated_at
  BEFORE UPDATE ON items_inventario
  FOR EACH ROW
  EXECUTE FUNCTION actualizar_updated_at();

CREATE TRIGGER trigger_recetas_updated_at
  BEFORE UPDATE ON recetas
  FOR EACH ROW
  EXECUTE FUNCTION actualizar_updated_at();

-- ========================================
-- Agregar FK de productos a recetas
-- ========================================
ALTER TABLE productos 
  ADD CONSTRAINT fk_productos_receta 
  FOREIGN KEY (id_receta) REFERENCES recetas(id) ON DELETE SET NULL;
