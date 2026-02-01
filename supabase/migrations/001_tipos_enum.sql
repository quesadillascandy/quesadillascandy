-- ================================================
-- MIGRACIÓN 1: TIPOS ENUM EN ESPAÑOL
-- Proyecto: Quesadillas Candy
-- Fecha: 2026-01-31
-- ================================================

-- Tipo de rol de usuario
CREATE TYPE tipo_rol AS ENUM (
  'admin',
  'gerente_produccion',
  'analista_financiero',
  'mayorista',
  'minorista',
  'exportacion'
);

-- Estado del pedido
CREATE TYPE estado_pedido AS ENUM (
  'PENDIENTE',
  'CONFIRMADO',
  'EN_PRODUCCION',
  'LISTO_ENTREGA',
  'EN_RUTA',
  'ENTREGADO',
  'COBRADO',
  'CANCELADO'
);

-- Tipo de item de inventario
CREATE TYPE tipo_item_inventario AS ENUM (
  'MATERIA_PRIMA',
  'INSUMO'
);

-- Categoría de inventario
CREATE TYPE categoria_inventario AS ENUM (
  'PERECEDERO',
  'NO_PERECEDERO',
  'ACTIVO'
);

-- Tipo de movimiento de inventario
CREATE TYPE tipo_movimiento AS ENUM (
  'ENTRADA',
  'SALIDA',
  'AJUSTE'
);

-- Origen del pedido
CREATE TYPE origen_pedido AS ENUM (
  'app',
  'whatsapp'
);

-- Comentarios informativos
COMMENT ON TYPE tipo_rol IS 'Roles de usuario en el sistema Quesadillas Candy';
COMMENT ON TYPE estado_pedido IS 'Estados del ciclo de vida de un pedido';
COMMENT ON TYPE tipo_item_inventario IS 'Clasificación de items: materia prima o insumo';
COMMENT ON TYPE categoria_inventario IS 'Categoría por perecibilidad';
COMMENT ON TYPE tipo_movimiento IS 'Tipo de movimiento de inventario';
COMMENT ON TYPE origen_pedido IS 'Origen del pedido: app o WhatsApp';
