# 🎪 Eventos Tech — Sistema de Registro Inteligente

> **Gestión de participantes potenciada por Inteligencia Artificial**
> TP Integrador · Desarrollo Ágil Asistido por IA

[![CI/CD](https://github.com/Agustin1001/TP_Integrador_Desarrollo_-gil_Asistido_por_IA/actions/workflows/ci-cd.yml/badge.svg)](https://github.com/Agustin1001/TP_Integrador_Desarrollo_-gil_Asistido_por_IA/actions)
[![Deploy Frontend](https://img.shields.io/badge/Frontend-Vercel-black?logo=vercel)](https://tp-integrador-desarrollo-gil-asisti.vercel.app)
[![Deploy Backend](https://img.shields.io/badge/Backend-Render-46E3B7?logo=render)](https://tp-integrador-desarrollo-gil-asistido.onrender.com)
[![Powered by Groq](https://img.shields.io/badge/AI-Groq%20Llama%203.3-F55036)](https://groq.com)

---

## 🚀 ¿Qué es Eventos Tech?

**Eventos Tech** es una aplicación web Full-Stack para la gestión de participantes en eventos tecnológicos. No es un CRUD genérico: incorpora **inteligencia artificial real** para analizar datos y asistir al organizador en la toma de decisiones.

### ¿Qué hace diferente a esta app?

- 🤖 **Análisis IA en tiempo real** — Un modelo de lenguaje (Llama 3.3 vía Groq) examina todos los participantes y genera un informe ejecutivo con hallazgos, tendencias y recomendaciones accionables con un solo clic.
- 💡 **Sugerencia de nivel inteligente** — Al completar el formulario de registro, el sistema puede sugerir automáticamente el nivel de experiencia del participante basándose en las tecnologías que domina.
- 🔒 **Autenticación JWT + RBAC** — Dos roles diferenciados: `ADMIN` (CRUD completo) y `CONSULTA` (solo lectura).
- ⚡ **Despliegue continuo** — Cada push a `main` ejecuta el pipeline de CI/CD automáticamente.

---

## 🛠️ Stack Tecnológico

### Frontend
| Tecnología | Versión | Uso |
|---|---|---|
| React | 19 | UI reactiva con hooks |
| TypeScript | 5.9 | Tipado estático |
| Vite | 8 | Bundler y dev server |
| TailwindCSS | 4 | Estilos utilitarios (paleta teal/indigo) |
| React Router | 7 | Navegación SPA |
| Context API + useReducer | — | Estado global |

### Backend
| Tecnología | Versión | Uso |
|---|---|---|
| FastAPI | 0.111+ | Framework API REST |
| Python | 3.11 | Lenguaje principal |
| SQLite | built-in | Persistencia de datos |
| PyJWT | 2.8+ | Tokens de autenticación |
| httpx | 0.27+ | Llamadas HTTP async al servicio de IA |

### IA & DevOps
| Herramienta | Uso |
|---|---|
| **Groq (Llama 3.3 70B)** | Análisis de participantes + sugerencia de nivel |
| **GitHub Actions** | Pipeline CI/CD automatizado |
| **Vercel** | Deploy del frontend (React) |
| **Render** | Deploy del backend (FastAPI) |

---

## 🧠 Integración de IA — Cómo funciona

### 1. Panel de Análisis Inteligente (`GET /ai/analisis`)
El backend recopila estadísticas de todos los participantes, construye un prompt contextualizado y llama al modelo de IA. La respuesta incluye:
- Resumen ejecutivo del evento
- Hallazgos clave sobre el perfil de participantes
- Recomendaciones concretas para el organizador

### 2. Sugerencia de Nivel (`POST /ai/sugerir-nivel`)
Desde el formulario de registro, el organizador puede pedir a la IA que sugiera el nivel de experiencia apropiado según las tecnologías seleccionadas. La IA devuelve el nivel recomendado y una justificación breve en formato JSON.

```
Tecnologías: React, Node, Python
IA → { nivel: "Intermedio", justificacion: "Domina el stack web completo..." }
```

---

## 📁 Estructura del Proyecto

```
eventos-tech/
├── .github/
│   └── workflows/
│       └── ci-cd.yml          # Pipeline CI/CD automatizado
├── backend/
│   ├── main.py                # API FastAPI + SQLite + endpoints IA
│   └── requirements.txt       # Dependencias Python
├── src/
│   ├── components/
│   │   ├── Filtros.tsx         # Filtros con atajo de teclado Ctrl+B
│   │   ├── Formulario.tsx      # Formulario de registro
│   │   ├── ParticipanteCard.tsx# Tarjeta de participante
│   │   └── PanelIA.tsx         # Panel de análisis con IA
│   ├── context/
│   │   ├── AuthContext.tsx     # Contexto de autenticación JWT
│   │   └── ParticipantesContext.tsx
│   ├── hooks/
│   │   ├── useForm.ts          # Custom hook para formularios
│   │   ├── useShortcut.ts      # Custom hook para atajos de teclado
│   │   └── useSugerirNivel.ts  # Hook para sugerencia IA de nivel
│   ├── models/
│   │   └── Participante.ts     # Modelo de datos
│   ├── pages/
│   │   ├── LoginPage.tsx
│   │   ├── ListaPage.tsx       # Incluye PanelIA
│   │   ├── FormularioPage.tsx
│   │   └── EditarPage.tsx
│   ├── reducers/
│   │   └── participantesReducer.ts
│   └── routes/
│       └── PrivateRoute.tsx
└── README.md
```

---

## ⚙️ Guía de Instalación y Ejecución Local

### Prerrequisitos
- Node.js 20+ (o npm)
- Python 3.11+

### 1. Clonar el repositorio

```bash
git clone https://github.com/Agustin1001/TP_Integrador_Desarrollo_-gil_Asistido_por_IA.git
cd TP_Integrador_Desarrollo_-gil_Asistido_por_IA
```

### 2. Backend

```bash
cd backend

# (Opcional) Crear entorno virtual
python -m venv venv
venv\Scripts\activate        # Windows
# source venv/bin/activate   # Linux/Mac

# Instalar dependencias
pip install -r requirements.txt

# Configurar variables de entorno
set GROQ_API_KEY=tu_api_key_aqui     # Windows  (obtener en console.groq.com)
set SECRET_KEY=una_clave_secreta_segura

# Iniciar servidor (el DB SQLite se crea automáticamente)
uvicorn main:app --reload --port 8000
```

La API estará disponible en `http://localhost:8000`
Documentación interactiva: `http://localhost:8000/docs`

### 3. Frontend

```bash
# En la raíz del proyecto
npm install

# Crear archivo .env.local
echo VITE_API_URL=http://localhost:8000 > .env.local

# Iniciar servidor de desarrollo
npm run dev
```

La app estará en `http://localhost:5173`

---

## 👥 Usuarios de Prueba

| Usuario   | Contraseña | Rol      | Permisos              |
|-----------|------------|----------|-----------------------|
| `admin`   | `1234`     | ADMIN    | CRUD completo + IA    |
| `invitado`| `1234`     | CONSULTA | Solo lectura + IA     |

---

## 🌐 Despliegue en la Nube

### Frontend → Vercel
1. Importar el repositorio en [vercel.com](https://vercel.com)
2. Framework: **Vite**
3. Variable de entorno: `VITE_API_URL=https://tu-api.onrender.com`
4. Deploy automático en cada push a `main`

### Backend → Render
1. Crear un **Web Service** en [render.com](https://render.com)
2. Root Directory: `backend`
3. Build Command: `pip install -r requirements.txt`
4. Start Command: `uvicorn main:app --host 0.0.0.0 --port $PORT`
5. Variables de entorno:
   - `GROQ_API_KEY` → tu API key de Groq
   - `SECRET_KEY` → clave secreta para JWT

### CI/CD con GitHub Actions
Configurar los siguientes Secrets en el repositorio:

| Secret | Descripción |
|---|---|
| `VERCEL_TOKEN` | Token de Vercel |
| `VERCEL_ORG_ID` | ID de organización Vercel |
| `VERCEL_PROJECT_ID` | ID del proyecto Vercel |
| `RENDER_DEPLOY_HOOK_URL` | Deploy hook de Render |
| `VITE_API_URL` | URL del backend en producción |

---

## 🔗 Links

- 🌐 **Demo en vivo**: [tp-integrador-desarrollo-gil-asisti.vercel.app](https://tp-integrador-desarrollo-gil-asisti.vercel.app)
- 📡 **API / Swagger**: [tp-integrador-desarrollo-gil-asistido.onrender.com/docs](https://tp-integrador-desarrollo-gil-asistido.onrender.com/docs)
- 📂 **Repositorio**: [github.com/Agustin1001/TP_Integrador_Desarrollo_-gil_Asistido_por_IA](https://github.com/Agustin1001/TP_Integrador_Desarrollo_-gil_Asistido_por_IA)

---

## 🤝 IA utilizada en el desarrollo

Este proyecto fue desarrollado con asistencia de **IA conversacional** para:
- Arquitectura del sistema de autenticación JWT
- Diseño de los endpoints de IA (`/ai/analisis`, `/ai/sugerir-nivel`)
- Generación del pipeline de GitHub Actions
- Refactorización de componentes React
- Depuración de errores de despliegue
- Redacción de documentación técnica

El servicio de IA en producción usa **Groq con el modelo Llama 3.3 70B**, elegido por su tier gratuito y su altísima velocidad de inferencia.

---

Desarrollado por **Grupo Bits&Bytes** 👨‍💻👩‍💻
TP Integrador 2026
