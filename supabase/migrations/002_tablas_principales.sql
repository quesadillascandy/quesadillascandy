-- ================================================
-- MIGRACIÓN 2: TABLAS PRINCIPALES
-- Proyecto: Quesadillas Candy
-- Fecha: 2026-01-31
-- ================================================

-- ========================================
-- TABLA: perfiles (Usuarios del sistema)
-- ========================================
CREATE TABLE perfiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  nombre_completo TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  rol tipo_rol NOT NULL DEFAULT 'minorista',
  telefono TEXT,
  avatar_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

COMMENT ON TABLE perfiles IS 'Usuarios del sistema Quesadillas Candy';
COMMENT ON COLUMN perfiles.rol IS 'Rol del usuario que determina permisos';

-- Índices
CREATE INDEX idx_perfiles_email ON perfiles(email);
CREATE INDEX idx_perfiles_rol ON perfiles(rol);

-- ========================================
-- TABLA: productos
-- ========================================
CREATE TABLE productos (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  nombre TEXT NOT NULL,
  id_receta UUID, -- FK se creará después cuando exista tabla recetas
  precios JSONB NOT NULL DEFAULT '{}'::jsonb,
  activo BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

COMMENT ON TABLE productos IS 'Catálogo de productos de Quesadillas Candy';
COMMENT ON COLUMN productos.precios IS 'Precios por rol en formato JSON: {"mayorista": 10, "minorista": 12}';

-- Índices
CREATE INDEX idx_productos_activo ON productos(activo);

-- ========================================
-- TABLA: pedidos
-- ========================================
CREATE TABLE pedidos (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  id_usuario UUID REFERENCES perfiles(id) ON DELETE SET NULL,
  nombre_usuario TEXT NOT NULL,
  rol_usuario tipo_rol NOT NULL,
  estado estado_pedido NOT NULL DEFAULT 'PENDIENTE',
  total DECIMAL(10,2) NOT NULL DEFAULT 0,
  notas TEXT,
  fecha_entrega TIMESTAMPTZ NOT NULL,
  metodo_pago TEXT,
  recibido_por TEXT,
  origen origen_pedido DEFAULT 'app',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

COMMENT ON TABLE pedidos IS 'Pedidos de clientes';
COMMENT ON COLUMN pedidos.origen IS 'Fuente del pedido: app manual o WhatsApp';

-- Índices
CREATE INDEX idx_pedidos_usuario ON pedidos(id_usuario);
CREATE INDEX idx_pedidos_estado ON pedidos(estado);
CREATE INDEX idx_pedidos_fecha_entrega ON pedidos(fecha_entrega);
CREATE INDEX idx_pedidos_created_at ON pedidos(created_at DESC);

-- ========================================
-- TABLA: items_pedido
-- ========================================
CREATE TABLE items_pedido (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  id_pedido UUID NOT NULL REFERENCES pedidos(id) ON DELETE CASCADE,
  id_producto UUID REFERENCES productos(id) ON DELETE SET NULL,
  nombre_producto TEXT NOT NULL,
  cantidad DECIMAL(10,2) NOT NULL,
  precio_unitario DECIMAL(10,2) NOT NULL,
  total DECIMAL(10,2) NOT NULL
);

COMMENT ON TABLE items_pedido IS 'Líneas de detalle de cada pedido';

-- Índices
CREATE INDEX idx_items_pedido_pedido ON items_pedido(id_pedido);
CREATE INDEX idx_items_pedido_producto ON items_pedido(id_producto);

-- ========================================
-- FUNCIÓN: Actualizar updated_at automáticamente
-- ========================================
CREATE OR REPLACE FUNCTION actualizar_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Triggers para actualizar updated_at
CREATE TRIGGER trigger_perfiles_updated_at
  BEFORE UPDATE ON perfiles
  FOR EACH ROW
  EXECUTE FUNCTION actualizar_updated_at();

CREATE TRIGGER trigger_pedidos_updated_at
  BEFORE UPDATE ON pedidos
  FOR EACH ROW
  EXECUTE FUNCTION actualizar_updated_at();
