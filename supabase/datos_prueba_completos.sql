-- ================================================
-- POBLAR BASE DE DATOS CON DATOS DE PRUEBA
-- ================================================
-- Este script crea productos, inventario y pedidos de prueba
-- para poder probar toda la funcionalidad de la app
-- ================================================

-- 1. PRODUCTOS (si no existen)
INSERT INTO productos (nombre, sku, categoria, precio_mayorista, precio_menudeo, descripcion, activo) VALUES
  ('Quesadilla de Pollo', 'QUES-POL-001', 'quesadilla', 10.00, 12.00, 'Quesadilla rellena de pollo con queso', true),
  ('Quesadilla de Res', 'QUES-RES-001', 'quesadilla', 12.00, 15.00, 'Quesadilla rellena de carne de res', true),
  ('Quesadilla de Queso', 'QUES-QUE-001', 'quesadilla', 8.00, 10.00, 'Quesadilla tradicional de queso', true),
  ('Quesadilla Mixta', 'QUES-MIX-001', 'quesadilla', 11.00, 14.00, 'Quesadilla con pollo y res', true),
  ('Quesadilla Vegetariana', 'QUES-VEG-001', 'quesadilla', 9.00, 11.00, 'Quesadilla de verduras', true)
ON CONFLICT (sku) DO NOTHING;

-- 2. INVENTARIO (stock para cada producto)
INSERT INTO items_inventario (producto_id, cantidad_disponible, cantidad_reservada, stock_minimo, stock_maximo, ubicacion)
SELECT 
  id,
  100,  -- cantidad disponible
  0,    -- cantidad reservada
  20,   -- stock mínimo
  200,  -- stock máximo
  'Almacén Principal'
FROM productos
WHERE NOT EXISTS (
  SELECT 1 FROM items_inventario WHERE producto_id = productos.id
);

-- 3. PEDIDOS DE PRUEBA
-- Pedido 1: Mayorista Juan Jose Siguenza
INSERT INTO pedidos (cliente_id, estado, tipo_precio, total, metodo_pago, notas)
VALUES (
  '261f050c-7e94-46ba-b9e0-b846a9c64533',
  'pendiente',
  'mayorista',
  150.00,
  'transferencia',
  'Pedido de prueba - Cliente Mayorista'
) RETURNING id;

-- Pedido 2: Otro pedido para el mismo cliente
INSERT INTO pedidos (cliente_id, estado, tipo_precio, total, metodo_pago, notas)
VALUES (
  '261f050c-7e94-46ba-b9e0-b846a9c64533',
  'en_proceso',
  'mayorista',
  200.00,
  'efectivo',
  'Pedido urgente'
);

-- 4. ITEMS DE PEDIDO (detalles de qué productos incluye cada pedido)
-- Para el primer pedido (necesitas el ID del pedido recién creado)
-- Este script usa el último pedido creado
DO $$
DECLARE
  ultimo_pedido_id UUID;
  producto_pollo_id UUID;
  producto_res_id UUID;
BEGIN
  -- Obtener ID del último pedido
  SELECT id INTO ultimo_pedido_id FROM pedidos ORDER BY created_at DESC LIMIT 1;
  
  -- Obtener IDs de productos
  SELECT id INTO producto_pollo_id FROM productos WHERE sku = 'QUES-POL-001';
  SELECT id INTO producto_res_id FROM productos WHERE sku = 'QUES-RES-001';
  
  -- Crear items del pedido
  INSERT INTO items_pedido (pedido_id, producto_id, cantidad, precio_unitario, subtotal)
  VALUES 
    (ultimo_pedido_id, producto_pollo_id, 10, 10.00, 100.00),
    (ultimo_pedido_id, producto_res_id, 5, 12.00, 60.00);
END $$;

-- ================================================
-- VERIFICACIÓN
-- ================================================

-- Ver productos creados
SELECT COUNT(*) as total_productos FROM productos;

-- Ver inventario
SELECT 
  p.nombre,
  i.cantidad_disponible,
  i.stock_minimo,
  i.ubicacion
FROM items_inventario i
JOIN productos p ON p.id = i.producto_id;

-- Ver pedidos
SELECT 
  p.id,
  pr.nombre_completo as cliente,
  p.estado,
  p.total,
  p.created_at
FROM pedidos p
JOIN perfiles pr ON pr.id = p.cliente_id
ORDER BY p.created_at DESC;

-- Ver items de pedidos
SELECT 
  ped.id as pedido_id,
  prod.nombre as producto,
  ip.cantidad,
  ip.precio_unitario,
  ip.subtotal
FROM items_pedido ip
JOIN pedidos ped ON ped.id = ip.pedido_id
JOIN productos prod ON prod.id = ip.producto_id;

-- ================================================
-- RESULTADO ESPERADO
-- ================================================
-- ✅ 5 productos
-- ✅ 5 items de inventario
-- ✅ 2 pedidos
-- ✅ Items detallados en pedidos
-- ================================================
