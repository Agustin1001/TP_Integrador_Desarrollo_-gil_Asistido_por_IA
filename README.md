# Sistema de Registro de Eventos Tecnológicos con Seguridad JWT y Hooks Avanzados 🔒🚀

Una aplicación Full-Stack profesional para la gestión y registro de participantes. Esta versión evoluciona el proyecto integrando **seguridad robusta**, autenticación basada en **JSON Web Tokens (JWT)**, control de acceso por **roles de usuario** y una arquitectura optimizada mediante el uso de **hooks avanzados de React** para mejorar la accesibilidad, experiencia de usuario y reutilización de lógica.

## 📌 Características Principales

*   **Autenticación JWT:** Sistema de Login seguro con persistencia de sesión mediante tokens almacenados en `localStorage`.
*   **Control de Acceso por Roles (RBAC):**
    *   **ADMIN:** Acceso total al CRUD (Crear, Editar, Eliminar y Ver).
    *   **CONSULTA (Invitado):** Acceso restringido de solo lectura al listado y filtros.
*   **Rutas Protegidas:** Implementación de un componente `PrivateRoute` que bloquea accesos no autorizados a nivel de enrutamiento.
*   **Persistencia en MySQL:** Gestión de datos relacionales utilizando **MySQL** vía XAMPP.
*   **Frontend Seguro:** Inyección dinámica de headers `Authorization: Bearer <token>` en todas las peticiones a la API.
* **Optimización de Experiencia de Usuario (UX) & Accesibilidad (A11y):**
    * **Foco Automático:** El formulario activa inteligentemente el cursor en el input principal al montarse la pantalla mediante `useRef`.
    * **Atajos de Teclado:** Traslado rápido de foco a la barra de búsqueda de filtros usando la combinación `Ctrl + B`.
    * **IDs Accesibles:** Vinculación semántica perfecta entre componentes de formulario (`labels`, `inputs`, `checkboxes` y `radio buttons`) implementando `useId` de forma dinámica.
    * **Custom Hooks:** Desacoplamiento total de la lógica de negocio del renderizado visual para un código más limpio y escalable.

## 🛠️ Tecnologías Utilizadas

**Frontend:**
*   **React 18** + **TypeScript**.
* **React Hooks Avanzados:** `useRef`, `useId`, `useContext` y creación de **Custom Hooks** propios.
*   **React Context API:** Doble contexto para gestión de `AuthContext` (Seguridad) y `ParticipantesContext` (Datos).
*   **Tailwind CSS:** Diseño UI/UX moderno, responsive y estilizado.

**Backend:**
*   **FastAPI** (Python Framework).
*   **PyJWT:** Generación y validación de tokens de seguridad.
*   **SQLModel / PyMySQL:** Integración con MySQL.

---

## 📁 Estructura del Proyecto

```plaintext
src/
├── components/         # Filtros, ParticipanteCard, Formulario, NavBar
├── context/            # AuthContext (Seguridad) y ParticipantesContext (Datos)
├── hooks/              # Custom Hooks reutilizables (useForm, useShortcut)
├── models/             # Interfaces de TypeScript (Participante, User)
├── pages/              # LoginPage, ListaPage, FormularioPage, EditarPage
├── reducers/           # Gestión de estado complejo con useReducer
├── routes/             # Lógica de seguridad: PrivateRoute.tsx
└── App.tsx / Home.tsx  # Enrutador con validación de roles y estructura base

⚙️ Instalación y Ejecución Local1. Configuración de la Base de DatosInicia Apache y MySQL desde el Panel de Control de XAMPP.Crea una base de datos llamada eventos_tech.Verifica la cadena de conexión en el backend: mysql+pymysql://root@localhost/eventos_tech.2. Levantar el Backend (API)Bashcd backend

# Crear y activar entorno virtual
python -m venv venv
# En Windows:
venv\Scripts\activate

# Instalar dependencias
pip install -r requirements.txt

# Ejecutar servidor
uvicorn main:app --reload

3. Levantar el Frontend (React)
Bashcd frontend

# Instalar dependencias
pnpm install

# Iniciar servidor de desarrollo
pnpm dev

👥 Usuarios de Prueba
Usuario | Contraseña | Rol      | Permisos
admin   |  1234      | ADMIN    | CRUD Completo 
invitado|  1234      | CONSULTA | Solo lectura / Filtros

Desarrollado por Sofia Raia 👩‍💻 
Estudiante de Programación - Último Semestre.