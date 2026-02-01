-- ================================================
-- MIGRACIÓN 4: DATOS INICIALES
-- Proyecto: Quesadillas Candy
-- Fecha: 2026-01-31
-- ================================================

-- ========================================
-- PRODUCTOS INICIALES
-- ========================================
INSERT INTO productos (id, nombre, precios, activo) VALUES
  (
    '11111111-1111-1111-1111-111111111111',
    'Quesadilla Grande',
    '{"admin": 10, "gerente_produccion": 10, "analista_financiero": 10, "mayorista": 10, "minorista": 12, "exportacion": 15}'::jsonb,
    TRUE
  ),
  (
    '22222222-2222-2222-2222-222222222222',
    'Quesadilla Pequeña',
    '{"admin": 5, "gerente_produccion": 5, "analista_financiero": 5, "mayorista": 5, "minorista": 6, "exportacion": 8}'::jsonb,
    TRUE
  );

-- ========================================
-- ITEMS DE INVENTARIO INICIALES
-- ========================================
INSERT INTO items_inventario (id, nombre, tipo, categoria, unidad, stock_actual, stock_minimo, stock_maximo, costo_promedio, ultimo_precio, ubicacion) VALUES
  (
    'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa',
    'Queso Duro Viejo',
    'MATERIA_PRIMA',
    'PERECEDERO',
    'kg',
    45.00,
    20.00,
    100.00,
    4.50,
    4.50,
    'Cámara Fría 1'
  ),
  (
    'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb',
    'Crema Especial',
    'MATERIA_PRIMA',
    'PERECEDERO',
    'litros',
    30.00,
    15.00,
    60.00,
    4.20,
    4.20,
    'Cámara Fría 1'
  ),
  (
    'cccccccc-cccc-cccc-cccc-cccccccccccc',
    'Harina de Arroz',
    'MATERIA_PRIMA',
    'NO_PERECEDERO',
    'kg',
    120.00,
    200.00,
    1000.00,
    0.85,
    0.90,
    'Bodega Secos'
  ),
  (
    'dddddddd-dddd-dddd-dddd-dddddddddddd',
    'Polvo de Hornear',
    'MATERIA_PRIMA',
    'NO_PERECEDERO',
    'kg',
    10.00,
    5.00,
    20.00,
    2.50,
    2.50,
    'Bodega Secos'
  ),
  (
    'eeeeeeee-eeee-eeee-eeee-eeeeeeeeeeee',
    'Moldes Quesadilla G',
    'INSUMO',
    'ACTIVO',
    'unidades',
    150.00,
    100.00,
    300.00,
    12.00,
    12.00,
    'Estantería B1'
  ),
  (
    'ffffffff-ffff-ffff-ffff-ffffffffffff',
    'Gas Propano',
    'INSUMO',
    'NO_PERECEDERO',
    'tanques',
    2.00,
    2.00,
    6.00,
    125.00,
    125.00,
    'Patio'
  );

-- ========================================
-- LOTES DE INVENTARIO
-- ========================================
INSERT INTO lotes_inventario (id_item, numero_lote, cantidad_inicial, cantidad_actual, fecha_vencimiento, costo_unitario) VALUES
  (
    'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa',
    'L-101',
    20.00,
    20.00,
    '2026-03-20',
    4.50
  ),
  (
    'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa',
    'L-102',
    25.00,
    25.00,
    '2026-03-25',
    4.50
  );

-- ========================================
-- RECETA: Quesadilla Grande Tradicional
-- ========================================
INSERT INTO recetas (id, id_producto, nombre, version, rendimiento, tiempo_preparacion_minutos, instrucciones, activa) VALUES
  (
    'aaaabbbb-cccc-dddd-eeee-111111111111',
    '11111111-1111-1111-1111-111111111111',
    'Quesadilla Grande Tradicional',
    1,
    1.00,
    45,
    'Mezclar queso y crema. Agregar harina tamizada y polvo de hornear. Amasar hasta obtener consistencia suave. Moldear y hornear a 180°C por 30 minutos.',
    TRUE
  );

-- Vincular receta al producto
UPDATE productos SET id_receta = 'aaaabbbb-cccc-dddd-eeee-111111111111' 
WHERE id = '11111111-1111-1111-1111-111111111111';

-- ========================================
-- INGREDIENTES DE LA RECETA
-- ========================================
INSERT INTO ingredientes_receta (id_receta, id_item_inventario, cantidad, unidad, porcentaje_merma) VALUES
  ('aaaabbbb-cccc-dddd-eeee-111111111111', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 0.150, 'kg', 2.00),
  ('aaaabbbb-cccc-dddd-eeee-111111111111', 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', 0.050, 'litros', 1.00),
  ('aaaabbbb-cccc-dddd-eeee-111111111111', 'cccccccc-cccc-cccc-cccc-cccccccccccc', 0.200, 'kg', 5.00),
  ('aaaabbbb-cccc-dddd-eeee-111111111111', 'dddddddd-dddd-dddd-dddd-dddddddddddd', 0.005, 'kg', 0.00);

-- ========================================
-- COSTOS DE LA RECETA
-- ========================================
INSERT INTO costos_receta (id_receta, concepto, monto, es_por_unidad) VALUES
  ('aaaabbbb-cccc-dddd-eeee-111111111111', 'Mano de Obra', 0.50, TRUE),
  ('aaaabbbb-cccc-dddd-eeee-111111111111', 'Gas Propano', 0.30, TRUE),
  ('aaaabbbb-cccc-dddd-eeee-111111111111', 'Electricidad', 0.10, TRUE);

-- ========================================
-- MIGRACIÓN COMPLETADA
-- ========================================
-- Datos iniciales insertados exitosamente:
-- - 2 productos
-- - 6 items de inventario
-- - 2 lotes
-- - 1 receta con 4 ingredientes y 3 costos
