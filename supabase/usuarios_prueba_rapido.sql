-- ================================================
-- OPCIÓN RÁPIDA: CREAR USUARIOS SIN AUTH
-- ================================================
-- Este script crea perfiles directamente en la tabla
-- SIN crear usuarios en Supabase Auth primero.
-- 
-- ADVERTENCIA: Estos usuarios NO podrán hacer login
-- hasta que los crees manualmente en Auth con el mismo UUID.
--
-- Usa esto solo si quieres poblar la base de datos
-- para ver cómo se ven los datos.
-- ================================================

-- Generar UUIDs aleatorios para cada usuario
DO $$
DECLARE
  uuid_admin UUID := gen_random_uuid();
  uuid_gerente UUID := gen_random_uuid();
  uuid_analista UUID := gen_random_uuid();
  uuid_mayorista UUID := gen_random_uuid();
  uuid_minorista UUID := gen_random_uuid();
  uuid_export UUID := gen_random_uuid();
BEGIN
  -- Insertar perfiles con UUIDs generados
  INSERT INTO perfiles (id, email, nombre_completo, rol, telefono) VALUES
    (uuid_admin, 'admin@quesadillas.com', 'Carlos Administrador', 'admin', '7111-0001'),
    (uuid_gerente, 'gerente@quesadillas.com', 'Juan Gerente', 'gerente_produccion', '7111-0002'),
    (uuid_analista, 'analista@quesadillas.com', 'María Analista', 'analista_financiero', '7111-0003'),
    (uuid_mayorista, 'mayorista@empresa.com', 'Distribuidora El Salvador S.A.', 'mayorista', '7222-0001'),
    (uuid_minorista, 'minorista@cafe.com', 'Café La Esquina', 'minorista', '7333-0001'),
    (uuid_export, 'export@international.com', 'Global Foods Inc.', 'exportacion', '1-800-0001');

  -- Mostrar los UUIDs generados
  RAISE NOTICE 'UUIDs generados:';
  RAISE NOTICE 'Admin: %', uuid_admin;
  RAISE NOTICE 'Gerente: %', uuid_gerente;
  RAISE NOTICE 'Analista: %', uuid_analista;
  RAISE NOTICE 'Mayorista: %', uuid_mayorista;
  RAISE NOTICE 'Minorista: %', uuid_minorista;
  RAISE NOTICE 'Export: %', uuid_export;
  
  RAISE NOTICE '';
  RAISE NOTICE 'IMPORTANTE: Para hacer login, debes crear usuarios en Auth con estos mismos UUIDs y emails';
END $$;

-- Verificar que se crearon
SELECT 
  id,
  nombre_completo,
  email,
  rol,
  telefono
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
