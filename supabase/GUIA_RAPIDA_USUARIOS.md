# 🚀 Guía Rápida: Crear Usuarios de Prueba

## ⚡ Opción 1: Script Rápido (RECOMENDADO PARA PRUEBAS)

**Archivo:** [`usuarios_prueba_rapido.sql`](file:///c:/Sistemas/Quesadillas-Candy/supabase/usuarios_prueba_rapido.sql)

### Paso 1: Ejecutar Script
1. Abre **SQL Editor** en Supabase
2. Copia y pega **TODO** el contenido de `usuarios_prueba_rapido.sql`
3. Click **Run**

✅ **Resultado:** Se crearán 6 perfiles con UUIDs generados automáticamente

### Paso 2: Ver los UUIDs Generados
En la consola verás algo como:
```
Admin: 123e4567-e89b-12d3-a456-426614174000
Gerente: 223e4567-e89b-12d3-a456-426614174001
...
```

### Paso 3: Crear Usuarios en Auth (DESPUÉS)
Por cada usuario:

1. **Authentication** → **Users** → **Add User**
2. **Usar el UUID del paso 2** (opción "Create user with custom UUID")
3. Email y password:
   - `admin@quesadillas.com` / `Admin123!`
   - `gerente@quesadillas.com` / `Gerente123!`
   - etc.

> [!IMPORTANT]
> Con esta opción, puedes ver los datos en la app INMEDIATAMENTE,
> pero NO podrás hacer login hasta crear los usuarios en Auth.

---

## 📝 Opción 2: Método Manual Completo

### Paso 1: Deshabilitar Confirmación Email
**Settings** → **Authentication** → Desactivar **"Enable email confirmations"**

### Paso 2: Crear Usuarios en Auth PRIMERO

Por cada usuario de la lista:

**Admin:**
1. **Authentication** → **Users** → **Add User**
2. Email: `admin@quesadillas.com`
3. Password: `Admin123!`
4. ✅ **Auto Confirm User**
5. Click **Create**
6. **COPIAR UUID** (ej: `a1b2c3d4-...`)

Repetir para los otros 5 usuarios.

### Paso 3: Actualizar Script Original

Abre [`usuarios_prueba.sql`](file:///c:/Sistemas/Quesadillas-Candy/supabase/usuarios_prueba.sql):

```sql
-- Busca esta línea:
INSERT INTO perfiles (id, email, nombre_completo, rol, telefono) VALUES
  ('REEMPLAZAR-CON-UUID-REAL',  -- ⚠️ REEMPLAZAR ESTO
   'admin@quesadillas.com', 
   ...

-- Reemplázala con el UUID real:
INSERT INTO perfiles (id, email, nombre_completo, rol, telefono) VALUES
  ('a1b2c3d4-e5f6-7890-abcd-ef1234567890',  -- ✅ UUID REAL
   'admin@quesadillas.com', 
   ...
```

Hacer esto para LOS 6 usuarios.

### Paso 4: Ejecutar Script
Ejecuta el script completo en **SQL Editor**.

---

## 🎯 ¿Cuál Usar?

| Opción | Para qué | Login funciona |
|--------|----------|----------------|
| **Opción 1 (Rápido)** | Ver datos rápido, desarrollar UI | ❌ Hasta crear en Auth |
| **Opción 2 (Manual)** | Login funcional inmediato | ✅ Sí |

### Recomendación:
- **Si solo quieres ver cómo se ven los datos:** Usa Opción 1
- **Si quieres probar login ahora:** Usa Opción 2

---

## 🧪 Test Rápido (Opción 1)

Después de ejecutar `usuarios_prueba_rapido.sql`:

```sql
-- Ver todos los usuarios creados
SELECT nombre_completo, email, rol FROM perfiles;

-- Debería mostrar 6 usuarios
```

---

## ⚠️ Problemas Comunes

### Error: "invalid input syntax for type uuid"
**Causa:** No reemplazaste `'REEMPLAZAR-CON-UUID-REAL'`  
**Solución:** Usa la **Opción 1** (script rápido)

### Error: "duplicate key value violates unique constraint"
**Causa:** Ya ejecutaste el script antes  
**Solución:**
```sql
-- Borrar usuarios existentes
DELETE FROM perfiles;
-- Ejecutar el script de nuevo
```

---

**Creado:** 31 de enero de 2026
