# 👥 Usuarios de Prueba - Quesadillas Candy

## 📋 Lista de Usuarios por Rol

### 1. 👑 Admin
- **Email:** `admin@quesadillas.com`
- **Password:** `Admin123!`
- **Nombre:** Carlos Administrador
- **Teléfono:** 7111-0001
- **Puede:** Todo (acceso completo)

---

### 2. 🏭 Gerente de Producción
- **Email:** `gerente@quesadillas.com`
- **Password:** `Gerente123!`
- **Nombre:** Juan Gerente
- **Teléfono:** 7111-0002
- **Puede:** Inventario, pedidos confirmados, producción

---

### 3. 💰 Analista Financiero
- **Email:** `analista@quesadillas.com`
- **Password:** `Analista123!`
- **Nombre:** María Analista
- **Teléfono:** 7111-0003
- **Puede:** Ver todos los pedidos, reportes financieros, costos

---

### 4. 🏢 Cliente Mayorista
- **Email:** `mayorista@empresa.com`
- **Password:** `Mayorista123!`
- **Nombre:** Distribuidora El Salvador S.A.
- **Teléfono:** 7222-0001
- **Precio:** $10 (Quesadilla Grande), $5 (Pequeña)
- **Puede:** Ver solo sus pedidos, pedir con precios mayoristas

---

### 5. 🛍️ Cliente Minorista
- **Email:** `minorista@cafe.com`
- **Password:** `Minorista123!`
- **Nombre:** Café La Esquina
- **Teléfono:** 7333-0001
- **Precio:** $12 (Quesadilla Grande), $6 (Pequeña)
- **Puede:** Ver solo sus pedidos, pedir con precios minoristas

---

### 6. 🌎 Cliente Exportación
- **Email:** `export@international.com`
- **Password:** `Export123!`
- **Nombre:** Global Foods Inc.
- **Teléfono:** 1-800-0001
- **Precio:** $15 (Quesadilla Grande), $8 (Pequeña)
- **Puede:** Ver solo sus pedidos, pedir con precios de exportación

---

## 🔧 Instrucciones de Creación

### Paso 1: Deshabilitar Confirmación de Email

1. Ve a **Supabase Dashboard** → **Settings** → **Authentication**
2. Desactiva **"Enable email confirmations"**
3. Guarda cambios

### Paso 2: Crear Usuarios en Auth

Por cada usuario:

1. **Authentication** → **Users** → **Add User**
2. Usa el email y password de la lista
3. ✅ **Marca "Auto Confirm User"**
4. Click **Create user**
5. **COPIA el UUID** generado

### Paso 3: Ejecutar Script SQL

1. Abre [`usuarios_prueba.sql`](file:///c:/Sistemas/Quesadillas-Candy/supabase/usuarios_prueba.sql)
2. **REEMPLAZA** cada `'REEMPLAZAR-CON-UUID-REAL'` con el UUID copiado
3. Ejecuta el script en **SQL Editor**

### Paso 4: Verificar

Ejecuta en SQL Editor:

```sql
SELECT 
  nombre_completo,
  email,
  rol,
  created_at
FROM perfiles
ORDER BY created_at;
```

Deberías ver 6 usuarios.

---

## 🧪 Casos de Prueba

### Test 1: Login como Admin
1. Login: `admin@quesadillas.com` / `Admin123!`
2. ✅ Debe ver TODOS los módulos
3. ✅ Puede acceder a "Esquema BD"
4. ✅ Puede acceder a "Chatbot"

### Test 2: Login como Gerente
1. Login: `gerente@quesadillas.com` / `Gerente123!`
2. ✅ Debe ver inventario completo
3. ✅ Puede registrar movimientos
4. ✅ Solo ve pedidos confirmados/en producción
5. ❌ NO ve "Esquema BD"
6. ❌ NO ve reportes financieros

### Test 3: Login como Analista
1. Login: `analista@quesadillas.com` / `Analista123!`
2. ✅ Debe ver TODOS los pedidos
3. ✅ Puede ver costos de recetas
4. ✅ Ve reportes financieros
5. ❌ NO puede gestionar inventario
6. ❌ NO puede actualizar estados de pedidos

### Test 4: Login como Cliente Mayorista
1. Login: `mayorista@empresa.com` / `Mayorista123!`
2. ✅ Puede crear pedidos
3. ✅ Ve precios $10 y $5
4. ✅ Solo ve sus propios pedidos
5. ❌ NO ve inventario
6. ❌ NO ve costos

### Test 5: Verificar Precios Diferenciados
1. Login como **mayorista**: Ver precio $10
2. Logout
3. Login como **minorista**: Ver precio $12
4. Logout
5. Login como **exportación**: Ver precio $15

### Test 6: Verificar Aislamiento de Pedidos

1. Login como **mayorista** → Crear pedido #1
2. Logout
3. Login como **minorista** → **NO** debe ver pedido #1
4. Crear pedido #2
5. Logout
6. Login como **admin** → Debe ver ambos pedidos

---

## 🎯 Quick Access

**Para pruebas rápidas:**

```
Admin:     admin@quesadillas.com     / Admin123!
Gerente:   gerente@quesadillas.com   / Gerente123!
Analista:  analista@quesadillas.com  / Analista123!
Mayorista: mayorista@empresa.com     / Mayorista123!
Minorista: minorista@cafe.com        / Minorista123!
Export:    export@international.com  / Export123!
```

---

**Creado:** 31 de enero de 2026
