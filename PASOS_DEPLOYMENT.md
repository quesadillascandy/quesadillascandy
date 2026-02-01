# 📋 Pasos para Subir a GitHub y Desplegar en Vercel

## ✅ Paso 1: Git Configurado

Ya hice:
- ✅ `git init`
- ✅ Configuré tu email: `quesadillascandyshop@gmail.com`
- ✅ `git add .`
- ✅ `git commit -m "Initial commit"`

---

## 🎯 Paso 2: Crear Repositorio en GitHub

### Opción A: Desde el navegador (MÁS FÁCIL)

1. **Abre:** https://github.com/new
2. **Repository name:** `quesadillas-candy`
3. **Description:** Sistema de Gestión Integral - Panadería
4. **Visibility:** Private (recomendado) o Public
5. ⚠️ **NO MARQUES** "Add a README file"
6. ⚠️ **NO MARQUES** "Add .gitignore"
7. Click **Create repository**

### Opción B: Desde GitHub CLI (si tienes instalado)

```bash
gh repo create quesadillas-candy --private --source=. --remote=origin --push
```

---

## 🚀 Paso 3: Subir Código a GitHub

**Después de crear el repo**, ejecuta estos comandos:

```bash
git remote add origin https://github.com/quesadillascandyshop/quesadillas-candy.git
git branch -M main
git push -u origin main
```

**Si pide autenticación:**
1. **Username:** quesadillascandyshop
2. **Password:** NO uses tu password, usa un **Personal Access Token**
   - Ve a: https://github.com/settings/tokens
   - **Generate new token (classic)**
   - Marca: `repo` (Full control of private repositories)
   - Copia el token y úsalo como password

---

## 📦 Paso 4: Desplegar en Vercel

### 4.1 Conectar GitHub con Vercel

1. **Ve a:** https://vercel.com/new
2. Click **Continue with GitHub**
3. Autoriza Vercel a acceder a tu cuenta GitHub
4. Selecciona **quesadillascandyshop** como scope

### 4.2 Importar Repositorio

1. Busca `quesadillas-candy`
2. Click **Import**

### 4.3 Configurar Variables de Entorno

En la pantalla de configuración, expande **Environment Variables** y agrega:

**Variable 1:**
- **Name:** `VITE_SUPABASE_URL`
- **Value:** `https://velcqeqsoslucjokimsb.supabase.co`

**Variable 2:**
- **Name:** `VITE_SUPABASE_ANON_KEY`
- **Value:** `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZlbGNxZXFzb3NsdWNqb2tpbXNiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njk5MTUyMjcsImV4cCI6MjA4NTQ5MTIyN30.XW2dRUa-fk2Sm_kA0Dep7Khbei61bsDgFi2g7qlzaGo`

**Variable 3 (opcional):**
- **Name:** `VITE_GEMINI_API_KEY`
- **Value:** (tu API key de Google Gemini si la tienes)

### 4.4 Deploy

1. Click **Deploy**
2. Espera 2-3 minutos mientras compila
3. ✅ **¡Listo!** Tu app estará en: `https://quesadillas-candy.vercel.app`

---

## 🔧 Comandos Que Voy a Ejecutar

Si me das permiso, ejecuto automáticamente:

```bash
# Ver estado actual
git status

# Configurar remote (después de que crees el repo)
git remote add origin https://github.com/quesadillascandyshop/quesadillas-candy.git

# Cambiar a rama main
git branch -M main

# Subir código
git push -u origin main
```

---

## ⚠️ Notas Importantes

1. **Token de GitHub:** Si pide password en el push, usa un Personal Access Token, NO tu contraseña
2. **Variables de Entorno:** Son críticas, cópialas exactamente como están arriba
3. **Build Time:** El primer deployment toma ~3 minutos
4. **URL Final:** Será algo como `quesadillas-candy-xxx.vercel.app`

---

## 📱 Siguiente Acción

**¿Ya creaste el repositorio en GitHub?**

- ✅ **Sí** → Dime y ejecuto los comandos `git remote` + `git push`
- ❌ **No** → Ve a https://github.com/new y créalo (nombre: `quesadillas-candy`)

---

**Tiempo estimado total:** 5-10 minutos ⏱️
