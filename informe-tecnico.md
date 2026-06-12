# 📋 Informe Técnico — TP Integrador
## Desarrollo Ágil Asistido por Inteligencia Artificial

**Proyecto:** Sistema de Registro de Eventos Tecnológicos con IA
**Equipo:** Grupo Bits&Bytes
**Fecha:** Junio 2026
**Materia:** Desarrollo de Software / Programación

---

## 1. Descripción del Proyecto

El trabajo integrador consistió en evolucionar un sistema de registro de participantes para eventos tecnológicos, transformándolo en una aplicación deployable en la nube con valor agregado real mediante inteligencia artificial.

El proyecto base era funcional pero estaba atado a un entorno local (MySQL sobre XAMPP) y no tenía ninguna característica de IA. El objetivo fue:

- **Migrar la base de datos** de MySQL/XAMPP a SQLite para habilitar el despliegue gratuito en la nube.
- **Integrar IA real** mediante dos endpoints que analizan datos y asisten al organizador.
- **Configurar un pipeline CI/CD** con GitHub Actions.
- **Desplegar el sistema completo online** usando servicios gratuitos (Vercel + Render).
- **Rediseñar la interfaz** con una paleta visual propia (teal/indigo).

---

## 2. Arsenal de Herramientas de IA Utilizadas

### 2.1 IA conversacional para el desarrollo

Durante todo el desarrollo se utilizó un asistente de IA conversacional como par de programación. Se lo usó para:

| Tarea | Cómo ayudó la IA |
|---|---|
| Diseño de la migración MySQL → SQLite | Generó el módulo `init_db()` completo con datos de prueba |
| Arquitectura de endpoints IA | Co-diseñó los prompts y la estructura de respuesta JSON |
| Pipeline de GitHub Actions | Generó el YAML de CI/CD con los tres jobs |
| Componente `PanelIA.tsx` | Construyó el componente con TypeScript, manejo de estados y UI |
| Hook `useSugerirNivel.ts` | Generó el custom hook con manejo de errores y estados de carga |
| Depuración del despliegue | Identificó y corrigió múltiples errores en producción (ver sección 4) |
| Documentación | Redactó partes del README y este informe técnico |

### 2.2 IA en producción dentro de la aplicación

La aplicación integra un modelo de lenguaje **en vivo** a través de dos funciones:

- **`GET /ai/analisis`**: La IA recibe un resumen estadístico de los participantes y genera un informe ejecutivo con hallazgos y recomendaciones.
- **`POST /ai/sugerir-nivel`**: La IA analiza las tecnologías seleccionadas y sugiere un nivel de experiencia con justificación.

**Proveedor de IA final:** Groq con el modelo **Llama 3.3 70B**. La elección de este proveedor fue, en sí misma, un aprendizaje (ver sección 4.4).

---

## 3. Sinergia con la IA: Cómo ayudó en cada etapa

### 3.1 Fase de Análisis y Diseño

El primer reto fue hacer deployable el proyecto. El backend usaba MySQL mediante XAMPP, lo cual imposibilita el despliegue gratuito en Render sin una base de datos externa de pago.

**Prompt que funcionó:**
```
El backend usa PyMySQL con MySQL/XAMPP. Quiero deployar en Render
(gratis). ¿Cuál es la forma más simple de migrar a una DB que no
requiera configuración externa? Muéstrame init_db() con datos de prueba.
```

La IA propuso SQLite (incluida en Python, sin instalación), generó el esquema completo con seed data y explicó por qué era la opción ideal para el tier gratuito.

### 3.2 Fase de Integración de IA

El mayor valor agregado fue incorporar un modelo de lenguaje dentro de la propia aplicación. El aprendizaje clave fue que **los prompts vagos producen respuestas genéricas**:

❌ **Prompt que NO funcionó bien:**
```
Analiza estos participantes y dame un resumen.
```
*Problema: respuestas mecánicas, sin insights reales.*

✅ **Prompt que SÍ funcionó:**
```
Eres un analista experto en eventos tecnológicos.
Analiza los siguientes datos [...]
Genera un informe con:
1. 📊 Resumen ejecutivo (2-3 oraciones)
2. 🌟 Hallazgos clave (3 puntos)
3. 💡 Recomendaciones (2-3 acciones concretas)
Responde en español, profesional. Máximo 250 palabras.
```
*Por qué funcionó: rol definido, estructura explícita, límite de extensión, idioma especificado.*

Para la sugerencia de nivel, el reto fue obtener JSON parseable de forma confiable. La técnica que funcionó fue instruir el formato exacto y prohibir texto adicional:
```
Responde ÚNICAMENTE con un JSON válido con este formato exacto:
{"nivel": "Intermedio", "justificacion": "..."}
No incluyas texto adicional fuera del JSON.
```

### 3.3 Fase de DevOps — CI/CD

El pipeline de GitHub Actions fue generado casi en su totalidad con la IA, incluyendo el manejo de secrets, el orden de jobs con `needs:` y el condicional de rama para desplegar solo en push a `main`.

---

## 4. Lecciones Aprendidas y Desafíos Reales (La Bitácora)

Esta sección documenta los problemas **reales** que enfrentamos durante el desarrollo y despliegue, y cómo los resolvimos. Fue, con diferencia, la parte más instructiva del trabajo.

### 4.1 Desafío: Backticks escapados en el código generado

Al integrar la variable de entorno `VITE_API_URL` en `LoginPage.tsx`, el código generado quedó con las comillas invertidas (backticks) escapadas incorrectamente: `\`` en lugar de `` ` ``. Esto rompía la compilación de Vite con un error `Invalid Unicode escape sequence`.

**Aprendizaje:** El código generado por IA puede tener errores de escape de caracteres que solo aparecen al compilar. Hay que revisar siempre la salida, especialmente en strings con template literals de JavaScript.

### 4.2 Desafío: Herramientas no reconocidas en Windows (PATH)

Al intentar usar `pnpm` y luego `vercel` desde la terminal de Windows, ambos comandos daban "no se reconoce como comando interno o externo", a pesar de estar instalados con `npm install -g`.

**Causa:** Windows no agregaba automáticamente la carpeta de paquetes globales de npm al PATH del sistema.

**Solución:** Usar `npm` directamente en lugar de `pnpm` (son intercambiables), y `npx vercel` en lugar de `vercel`. Alternativamente, obtener los IDs de Vercel directamente desde el dashboard web sin usar la CLI.

**Aprendizaje:** No todo problema es de código. La configuración del entorno de desarrollo (especialmente el PATH en Windows) puede generar bloqueos que parecen errores del proyecto pero no lo son.

### 4.3 Desafío: Incompatibilidad de versiones en CI/CD

El primer push activó el pipeline de GitHub Actions, que falló con: `This version of pnpm requires at least Node.js v22.13`. El workflow usaba Node.js 20, pero la última versión de pnpm requería Node 22.

**Solución:** Actualizar `NODE_VERSION` de `"20"` a `"22"` en el archivo `ci-cd.yml`.

**Aprendizaje:** Las herramientas se actualizan constantemente y sus requisitos de versión cambian. Un pipeline que funcionaba ayer puede fallar hoy por una dependencia transitiva.

### 4.4 Desafío: Errores en cascada con la API de IA (el más instructivo)

Este fue el problema más largo de resolver y nos enseñó la importancia del debugging metódico. El panel de IA fallaba con un error 500 genérico, sin información útil. Lo resolvimos en capas:

**Capa 1 — Autenticación rota en Swagger (401):**
El endpoint protegido usaba `authorization: str = Header(None)` para leer el token, pero Swagger no lo enviaba correctamente. **Solución:** reemplazar por la clase estándar `HTTPBearer` de FastAPI, que además agregó el botón "Authorize" automáticamente.

**Capa 2 — Logs inaccesibles:**
No podíamos ver el traceback real del error 500 en Render. **Solución creativa:** creamos un endpoint público `/ai/diagnostico` que llamaba a la IA y devolvía el error exacto en formato JSON directamente en el navegador, sin necesidad de logs ni autenticación. Esta fue la decisión que destrabó todo.

**Capa 3 — Nombre de modelo inexistente (400):**
El diagnóstico reveló que el modelo `claude-sonnet-4-20250514` no existía. **Aprendizaje crítico:** la IA puede "alucinar" nombres de modelos, versiones de librerías o APIs que no existen. Siempre hay que verificar contra la documentación oficial.

**Capa 4 — Cuenta sin créditos (400):**
Al corregir el modelo, el diagnóstico mostró: *"Your credit balance is too low to access the Anthropic API"*. La cuenta gratuita no tenía créditos suficientes.

**Capa 5 — Migración de proveedor de IA:**
Decidimos migrar de Anthropic a **Groq**, que ofrece un tier gratuito generoso. Esto implicó reescribir la función de llamada a la IA (distinto formato de request, headers y parsing de respuesta).

**Capa 6 — Modelo dado de baja (400):**
La primera versión con Groq usaba `llama3-70b-8192`, que había sido discontinuado. **Solución final:** cambiar a `llama-3.3-70b-versatile`, el modelo vigente.

**Aprendizaje global de esta sección:** El debugging en producción es radicalmente distinto al local. Cuando los logs no están disponibles, hay que ser creativo para exponer el error (como nuestro endpoint de diagnóstico). Y cada solución puede revelar el siguiente problema oculto — la paciencia y el método importan más que la velocidad.

### 4.5 Desafío: Reglas de los Hooks de React en el linter

El pipeline de CI/CD falló en el job de lint con 17 errores del tipo *"React Hook is called conditionally"*. Varios componentes declaraban hooks (`useState`, `useRef`, `useId`) después de un `return null` condicional, lo cual viola las Rules of Hooks de React.

**Solución:** mover todas las declaraciones de hooks antes de cualquier `return` condicional. También se agregaron comentarios `eslint-disable` puntuales para casos legítimos (como contextos que exportan hooks junto a componentes).

**Aprendizaje:** El linter no es un obstáculo, es una red de seguridad. Estos errores habrían causado bugs sutiles en runtime que son muy difíciles de rastrear.

### 4.6 Desafío: Hook implementado pero no conectado al formulario

La IA generó el hook `useSugerirNivel.ts` de forma correcta e independiente: manejo de estados de carga, llamada al endpoint `POST /ai/sugerir-nivel`, parseo de la respuesta y función de limpieza. Sin embargo, **nunca lo integró en el formulario** (`Formulario.tsx`). El hook existía en el repositorio como código muerto: declarado, nunca importado, nunca usado.

El error pasó desapercibido durante el desarrollo porque:
- La IA trató la creación del hook y la integración en el formulario como tareas separadas, y omitió la segunda.
- El compilador de TypeScript no emite ninguna advertencia por un archivo exportado que nadie importa.
- El linter tampoco detecta código muerto a nivel de módulo en este contexto.

La funcionalidad solo se descubrió ausente al revisar manualmente el formulario y contrastar el código con el informe técnico, donde se afirmaba que la sugerencia de nivel estaba disponible "desde el formulario de registro".

**Solución:** integrar el hook manualmente en `Formulario.tsx`:
1. Importar `useSugerirNivel`.
2. Exponer `setFormData` desde `useForm` (ya estaba disponible pero no se desestructuraba).
3. Añadir el botón *"✨ Sugerir con IA"* junto al select de nivel, deshabilitado cuando no hay tecnologías seleccionadas.
4. Renderizar el panel de respuesta con nivel, justificación y los botones *Aplicar* / *Descartar*.

**Aprendizaje:** La IA puede generar piezas de código correctas de forma aislada y aun así no completar la integración entre ellas. Declarar un módulo no equivale a usarlo. La revisión humana del flujo completo —recorrer cada feature de punta a punta en la interfaz— es indispensable para detectar este tipo de omisiones que no generan ningún error visible.

---

## 5. Cambios Realizados al Proyecto Base

| Área | Cambio | Motivación |
|---|---|---|
| **Backend DB** | MySQL → SQLite | Habilitar deploy gratuito sin DB externa |
| **Backend deps** | `pymysql` → `httpx` | Cliente HTTP async para llamar a la IA |
| **Autenticación** | `Header` → `HTTPBearer` | Compatibilidad con Swagger y estándar FastAPI |
| **Proveedor IA** | Anthropic → Groq (Llama 3.3) | Tier gratuito sin necesidad de créditos |
| **Nuevo endpoint** | `GET /ai/analisis` | Feature IA principal del TP |
| **Nuevo endpoint** | `POST /ai/sugerir-nivel` | Feature IA secundaria |
| **Nuevo endpoint** | `GET /ai/diagnostico` | Herramienta de debugging en producción |
| **Nuevo componente** | `PanelIA.tsx` | UI para mostrar el análisis de IA |
| **Nuevo hook** | `useSugerirNivel.ts` | Encapsular la lógica de llamada a IA |
| **CI/CD** | `.github/workflows/ci-cd.yml` | Bonus: automatización del despliegue |
| **Diseño visual** | Paleta rosa → teal/indigo | Identidad visual propia del equipo |
| **URLs dinámicas** | Hardcoded → `VITE_API_URL` | Separar entornos dev/producción |

---

## 6. Conclusiones

El desarrollo ágil asistido por IA demostró ser una combinación poderosa, pero el aprendizaje más importante fue que **la IA acelera la implementación, no reemplaza el criterio**. La IA escribió la mayor parte del código boilerplate y propuso arquitecturas sólidas, pero cometió errores reales: inventó un nombre de modelo, escapó mal unos caracteres, y no podía anticipar problemas de configuración del entorno o de créditos de una cuenta externa.

El verdadero trabajo del equipo fue **dirigir, verificar y depurar**. La fase de despliegue —que enfrentó seis capas de errores encadenados— fue la más instructiva: nos enseñó debugging metódico, la importancia de exponer errores cuando los logs fallan, y la necesidad de verificar siempre contra la documentación oficial en lugar de confiar ciegamente en lo que la IA genera.

El resultado final es una aplicación que cumple y supera los requisitos del TP: está deployada en la nube, tiene CI/CD automatizado, integra IA de forma funcional y real, cuenta con una identidad visual propia, y —sobre todo— viene acompañada de una bitácora honesta de los problemas reales que enfrentamos y resolvimos.

---

*Informe elaborado por el Grupo Bits&Bytes con asistencia de IA · Junio 2026*
