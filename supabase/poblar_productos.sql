-- ================================================
-- POBLAR PRODUCTOS CON ESTRUCTURA CORRECTA
-- ================================================
-- Los productos usan JSONB para almacenar precios por rol

-- Insertar productos de prueba
INSERT INTO productos (nombre, precios, activo) VALUES
  ('Quesadilla de Pollo', 
   '{"mayorista": 10.00, "minorista": 12.00, "exportacion": 15.00}'::jsonb,
   true),
  
  ('Quesadilla de Res', 
   '{"mayorista": 12.00, "minorista": 15.00, "exportacion": 18.00}'::jsonb,
   true),
  
  ('Quesadilla de Queso', 
   '{"mayorista": 8.00, "minorista": 10.00, "exportacion": 12.00}'::jsonb,
   true),
  
  ('Quesadilla Mixta (Pollo + Res)', 
   '{"mayorista": 11.00, "minorista": 14.00, "exportacion": 16.00}'::jsonb,
   true),
  
  ('Quesadilla Vegetariana', 
   '{"mayorista": 9.00, "minorista": 11.00, "exportacion": 13.00}'::jsonb,
   true)
ON CONFLICT DO NOTHING;

-- Verificar productos creados
SELECT 
  id,
  nombre,
  precios,
  activo,
  created_at
FROM productos
ORDER BY created_at DESC;

-- Ver precios de forma más legible
SELECT 
  nombre,
  precios->>'mayorista' as precio_mayorista,
  precios->>'minorista' as precio_minorista,
  precios->>'exportacion' as precio_exportacion,
  activo
FROM productos
ORDER BY nombre;
