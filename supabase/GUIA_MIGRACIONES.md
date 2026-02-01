# 🚀 Guía de Ejecución de Migraciones SQL

## ✅ Archivos Creados

Se han generado **5 archivos de migración SQL** en la carpeta `supabase/migrations/`:

1. **001_tipos_enum.sql** - Tipos ENUM en español
2. **002_tablas_principales.sql** - Perfiles, productos, pedidos
3. **003_inventario_recetas.sql** - Inventario, recetas y auditoría
4. **004_datos_iniciales.sql** - Datos de prueba
5. **005_rls_policies.sql** - Políticas de seguridad (Row Level Security)

---

## 📋 Instrucciones de Ejecución

### Opción 1: Desde Supabase Dashboard (Recomendado)

1. **Accede a tu proyecto en Supabase:**
   - Ve a [https://supabase.com/dashboard](https://supabase.com/dashboard)
   - Selecciona tu proyecto "velcqeqsoslucjokimsb"

2. **Abre el SQL Editor:**
   - En el menú lateral, click en **"SQL Editor"**
   - Click en **"New query"**

3. **Ejecuta las migraciones en orden:**
   
   **Paso 1:** Copia el contenido de `001_tipos_enum.sql` y ejecuta
   ```
   ✅ Verifica que aparezcan los tipos ENUM en la consola
   ```

   **Paso 2:** Copia el contenido de `002_tablas_principales.sql` y ejecuta
   ```
   ✅ Verifica que se crearon: perfiles, productos, pedidos, items_pedido
   ```

   **Paso 3:** Copia el contenido de `003_inventario_recetas.sql` y ejecuta
   ```
   ✅ Verifica que se crearon todas las tablas de inventario y recetas
   ```

   **Paso 4:** Copia el contenido de `004_datos_iniciales.sql` y ejecuta
   ```
   ✅ Verifica que hay productos e items de inventario
   ```

   **Paso 5:** Copia el contenido de `005_rls_policies.sql` y ejecuta
   ```
   ✅ Verifica que RLS está activo en todas las tablas
   ```

4. **Verifica la creación:**
   - Ve a **"Table Editor"** en el menú lateral
   - Deberías ver todas las tablas con nombres en español
   - Click en "productos" para ver los datos iniciales

---

### Opción 2: Desde Supabase CLI

Si tienes Supabase CLI instalado:

```bash
# 1. Inicializar Supabase en tu proyecto (si no lo has hecho)
npx supabase init

# 2. Vincular tu proyecto
npx supabase link --project-ref velcqeqsoslucjokimsb

# 3. Aplicar migraciones
npx supabase db push
```

---

## 🔍 Verificación

Después de ejecutar todas las migraciones, verifica con estas queries:

```sql
-- Ver todas las tablas creadas
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public'
ORDER BY table_name;

-- Ver tipos ENUM creados
SELECT typname 
FROM pg_type 
WHERE typtype = 'e'
ORDER BY typname;

-- Ver datos iniciales de productos
SELECT * FROM productos;

-- Ver datos iniciales de inventario
SELECT * FROM items_inventario;

-- Ver receta con ingredientes
SELECT 
  r.nombre AS receta,
  ii.nombre AS ingrediente,
  ir.cantidad,
  ir.unidad,
  ir.porcentaje_merma
FROM recetas r
JOIN ingredientes_receta ir ON ir.id_receta = r.id
JOIN items_inventario ii ON ii.id = ir.id_item_inventario
WHERE r.nombre = 'Quesadilla Grande Tradicional';
```

---

## ⚠️ Notas Importantes

> [!WARNING]
> **Ejecuta las migraciones en el orden correcto (001 → 005)**
> 
> Si ejecutas fuera de orden, pueden fallar las dependencias entre tablas.

> [!IMPORTANT]
> **Row Level Security (RLS) está activado**
> 
> Las políticas de seguridad requieren que los usuarios estén autenticados. Para pruebas iniciales, puedes desactivar temporalmente RLS:
> ```sql
> ALTER TABLE perfiles DISABLE ROW LEVEL SECURITY;
> -- Repite para otras tablas si es necesario
> ```

> [!TIP]
> **Datos de prueba incluidos**
> 
> La migración 004 incluye:
> - 2 productos (Quesadilla Grande y Pequeña)
> - 6 items de inventario
> - 1 receta completa con ingredientes y costos

---

## 🎯 Próximos Pasos

Después de ejecutar las migraciones:

1. ✅ **Instalar Supabase en tu proyecto:**
   ```bash
   npm install @supabase/supabase-js
   ```

2. ✅ **El cliente ya está configurado:**
   - Archivo: `services/supabaseClient.ts`
   - Ya incluye las credenciales de tu proyecto

3. ✅ **Migrar los hooks:**
   - `useAuth.tsx` - Para autenticación real
   - `useOrders.tsx` - Conectar con tabla pedidos
   - `useInventory.tsx` - Conectar con items_inventario
   - `useRecipes.tsx` - Conectar con recetas

4. ✅ **Generar tipos TypeScript:**
   ```bash
   npx supabase gen types typescript --project-id velcqeqsoslucjokimsb > types/supabase.ts
   ```

---

## 📊 Estructura Final

```
Base de Datos Quesadillas Candy
│
├── 📁 Usuarios y Ventas
│   ├── perfiles (usuarios del sistema)
│   ├── productos (catálogo)
│   ├── pedidos (órdenes)
│   └── items_pedido (detalle de órdenes)
│
├── 📁 Inventario
│   ├── items_inventario (materias primas e insumos)
│   ├── lotes_inventario (trazabilidad FIFO/FEFO)
│   └── movimientos_inventario (kardex)
│
├── 📁 Recetas y Costos
│   ├── recetas (recetas estándar)
│   ├── ingredientes_receta (bill of materials)
│   └── costos_receta (costos indirectos)
│
└── 📁 Auditoría
    └── registros_auditoria (log de cambios)
```

---

**¡Todo listo para ejecutar!** 🎉
