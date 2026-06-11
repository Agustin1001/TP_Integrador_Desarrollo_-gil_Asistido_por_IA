"""
Sistema de Registro de Eventos Tecnológicos — Backend
FastAPI + SQLite + IA (Groq / Llama 3.3)
Autor: Grupo Bits&Bytes | TP Integrador - Desarrollo Ágil Asistido por IA
"""

from fastapi import FastAPI, HTTPException, Depends
from fastapi.middleware.cors import CORSMiddleware
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from pydantic import BaseModel
import sqlite3
import json
import jwt
import httpx
import os
from datetime import datetime, timedelta, timezone

# ── Configuración ─────────────────────────────────────────────────────────────
app = FastAPI(title="Eventos Tech API", version="2.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

SECRET_KEY  = os.getenv("SECRET_KEY", "mi_clave_secreta_super_segura_cambiar_en_prod")
ALGORITHM   = "HS256"
GROQ_KEY    = os.getenv("GROQ_API_KEY", "")         # Variable de entorno en Render
DB_PATH     = os.getenv("DB_PATH", "eventos_tech.db")


# ── Base de Datos SQLite ───────────────────────────────────────────────────────
def get_db():
    """Devuelve una conexión a SQLite con Row Factory para dict."""
    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = sqlite3.Row
    return conn


def init_db():
    """Crea las tablas e inserta datos de prueba si no existen."""
    conn = get_db()
    c = conn.cursor()

    c.execute("""
        CREATE TABLE IF NOT EXISTS usuarios_db (
            id       INTEGER PRIMARY KEY AUTOINCREMENT,
            username TEXT UNIQUE NOT NULL,
            password TEXT NOT NULL,
            rol      TEXT NOT NULL DEFAULT 'CONSULTA'
        )
    """)

    c.execute("""
        CREATE TABLE IF NOT EXISTS participantes (
            id             INTEGER PRIMARY KEY AUTOINCREMENT,
            nombre         TEXT NOT NULL,
            email          TEXT NOT NULL,
            edad           INTEGER,
            pais           TEXT,
            modalidad      TEXT,
            tecnologias    TEXT,   -- JSON list
            nivel          TEXT,
            aceptaTerminos INTEGER DEFAULT 1
        )
    """)

    # Usuarios semilla
    c.execute("SELECT COUNT(*) FROM usuarios_db")
    if c.fetchone()[0] == 0:
        c.executemany(
            "INSERT INTO usuarios_db (username, password, rol) VALUES (?, ?, ?)",
            [
                ("admin",    "1234", "ADMIN"),
                ("invitado", "1234", "CONSULTA"),
            ],
        )

    # Participantes de ejemplo
    c.execute("SELECT COUNT(*) FROM participantes")
    if c.fetchone()[0] == 0:
        ejemplos = [
            ("Ana García",    "ana@mail.com",    28, "Argentina", "Presencial", json.dumps(["React","Python"]),    "Intermedio",  1),
            ("Carlos López",  "carlos@mail.com", 32, "México",    "Virtual",    json.dumps(["Node","Java"]),       "Avanzado",    1),
            ("Laura Martínez","laura@mail.com",  22, "España",    "Híbrido",    json.dumps(["Vue","Angular"]),     "Principiante",1),
            ("Diego Fernández","diego@mail.com", 27, "Chile",     "Presencial", json.dumps(["Python","React"]),    "Intermedio",  1),
            ("María Silva",   "maria@mail.com",  35, "Uruguay",   "Virtual",    json.dumps(["Java","Node","Vue"]), "Avanzado",    1),
        ]
        c.executemany(
            """INSERT INTO participantes
               (nombre, email, edad, pais, modalidad, tecnologias, nivel, aceptaTerminos)
               VALUES (?,?,?,?,?,?,?,?)""",
            ejemplos,
        )

    conn.commit()
    conn.close()


# Inicializar al arrancar
init_db()


# ── Modelos Pydantic ───────────────────────────────────────────────────────────
class ParticipanteCreate(BaseModel):
    nombre:        str
    email:         str
    edad:          int
    pais:          str
    modalidad:     str
    tecnologias:   list[str]
    nivel:         str
    aceptaTerminos: bool


class LoginData(BaseModel):
    username: str
    password: str


class SugerirNivelRequest(BaseModel):
    tecnologias: list[str]
    descripcion: str = ""


# ── Autenticación JWT ──────────────────────────────────────────────────────────
@app.post("/login")
def login(datos: LoginData):
    conn = get_db()
    try:
        row = conn.execute(
            "SELECT id, username, rol FROM usuarios_db WHERE username=? AND password=?",
            (datos.username, datos.password),
        ).fetchone()

        if not row:
            raise HTTPException(status_code=401, detail="Credenciales incorrectas")

        user = dict(row)
        exp  = datetime.now(timezone.utc) + timedelta(hours=2)
        token = jwt.encode(
            {"sub": user["username"], "rol": user["rol"], "exp": exp},
            SECRET_KEY,
            algorithm=ALGORITHM,
        )
        return {"token": token, "user": user}
    finally:
        conn.close()


http_bearer = HTTPBearer(auto_error=False)

def verificar_token(credentials: HTTPAuthorizationCredentials = Depends(http_bearer)):
    if not credentials:
        raise HTTPException(status_code=401, detail="Token ausente o inválido")
    try:
        return jwt.decode(credentials.credentials, SECRET_KEY, algorithms=[ALGORITHM])
    except jwt.ExpiredSignatureError:
        raise HTTPException(status_code=401, detail="El token ha expirado")
    except jwt.InvalidTokenError:
        raise HTTPException(status_code=401, detail="Token inválido")


# ── CRUD Participantes ─────────────────────────────────────────────────────────
def row_to_dict(row):
    d = dict(row)
    if isinstance(d.get("tecnologias"), str):
        d["tecnologias"] = json.loads(d["tecnologias"])
    d["aceptaTerminos"] = bool(d.get("aceptaTerminos", 1))
    return d


@app.get("/participantes")
def obtener_participantes(td=Depends(verificar_token)):
    conn = get_db()
    try:
        rows = conn.execute("SELECT * FROM participantes").fetchall()
        return [row_to_dict(r) for r in rows]
    finally:
        conn.close()


@app.post("/participantes", status_code=201)
def crear_participante(p: ParticipanteCreate, td=Depends(verificar_token)):
    if td.get("rol") != "ADMIN":
        raise HTTPException(status_code=403, detail="Sin permisos")
    conn = get_db()
    try:
        cur = conn.execute(
            """INSERT INTO participantes
               (nombre,email,edad,pais,modalidad,tecnologias,nivel,aceptaTerminos)
               VALUES (?,?,?,?,?,?,?,?)""",
            (p.nombre, p.email, p.edad, p.pais, p.modalidad,
             json.dumps(p.tecnologias), p.nivel, int(p.aceptaTerminos)),
        )
        conn.commit()
        return {"id": cur.lastrowid, **p.model_dump()}
    finally:
        conn.close()


@app.put("/participantes/{id}")
def actualizar_participante(id: int, p: ParticipanteCreate, td=Depends(verificar_token)):
    if td.get("rol") != "ADMIN":
        raise HTTPException(status_code=403, detail="Sin permisos")
    conn = get_db()
    try:
        conn.execute(
            """UPDATE participantes
               SET nombre=?,email=?,edad=?,pais=?,modalidad=?,tecnologias=?,nivel=?,aceptaTerminos=?
               WHERE id=?""",
            (p.nombre, p.email, p.edad, p.pais, p.modalidad,
             json.dumps(p.tecnologias), p.nivel, int(p.aceptaTerminos), id),
        )
        conn.commit()
        return {"id": id, **p.model_dump()}
    finally:
        conn.close()


@app.delete("/participantes/{id}")
def eliminar_participante(id: int, td=Depends(verificar_token)):
    if td.get("rol") != "ADMIN":
        raise HTTPException(status_code=403, detail="Sin permisos")
    conn = get_db()
    try:
        conn.execute("DELETE FROM participantes WHERE id=?", (id,))
        conn.commit()
        return {"mensaje": "Participante eliminado"}
    finally:
        conn.close()


# ── IA con Groq (Llama 3.3) ────────────────────────────────────────────────────
async def llamar_ia(prompt: str, max_tokens: int = 800) -> str:
    """Llama a Groq (Llama3) y devuelve el texto generado. Tier gratuito."""
    if not GROQ_KEY:
        return "⚠️ GROQ_API_KEY no configurada en el servidor."

    async with httpx.AsyncClient(timeout=30) as client:
        resp = await client.post(
            "https://api.groq.com/openai/v1/chat/completions",
            headers={
                "Authorization": f"Bearer {GROQ_KEY}",
                "Content-Type":  "application/json",
            },
            json={
                "model":      "llama-3.3-70b-versatile",
                "max_tokens": max_tokens,
                "messages":   [{"role": "user", "content": prompt}],
            },
        )
        resp.raise_for_status()
        data = resp.json()
        return data["choices"][0]["message"]["content"]


@app.get("/ai/analisis")
async def analizar_participantes(td=Depends(verificar_token)):
    """
    La IA analiza los participantes registrados y genera un informe inteligente
    con estadísticas, insights y recomendaciones para el organizador del evento.
    """
    conn = get_db()
    try:
        rows = conn.execute("SELECT * FROM participantes").fetchall()
        participantes = [row_to_dict(r) for r in rows]
    finally:
        conn.close()

    if not participantes:
        return {"analisis": "No hay participantes registrados aún."}

    # Construimos el resumen de datos para el prompt
    resumen = {
        "total": len(participantes),
        "paises":    list({p["pais"] for p in participantes}),
        "niveles":   {n: sum(1 for p in participantes if p["nivel"] == n)
                      for n in ["Principiante", "Intermedio", "Avanzado"]},
        "modalidades": {m: sum(1 for p in participantes if p["modalidad"] == m)
                        for m in ["Presencial", "Virtual", "Híbrido"]},
        "tecnologias_populares": sorted(
            {t for p in participantes for t in p["tecnologias"]},
        ),
    }

    prompt = f"""Eres un analista experto en eventos tecnológicos. 
Analiza los siguientes datos de participantes de un evento tech y genera un informe ejecutivo conciso:

DATOS:
- Total participantes: {resumen['total']}
- Países representados: {', '.join(resumen['paises'])}
- Distribución por nivel: {json.dumps(resumen['niveles'], ensure_ascii=False)}
- Distribución por modalidad: {json.dumps(resumen['modalidades'], ensure_ascii=False)}
- Tecnologías presentes: {', '.join(resumen['tecnologias_populares'])}

Genera un informe con:
1. 📊 Resumen ejecutivo (2-3 oraciones)
2. 🌟 Hallazgos clave (3 puntos concisos)
3. 💡 Recomendaciones para el organizador (2-3 acciones concretas)

Responde en español, de forma clara y profesional. Máximo 250 palabras."""

    try:
        analisis = await llamar_ia(prompt)
        return {"analisis": analisis, "datos_base": resumen}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error al consultar IA: {str(e)}")


@app.post("/ai/sugerir-nivel")
async def sugerir_nivel(req: SugerirNivelRequest, td=Depends(verificar_token)):
    """
    La IA sugiere el nivel de experiencia apropiado basándose en las
    tecnologías seleccionadas y descripción opcional del participante.
    """
    if not req.tecnologias:
        return {"nivel": "Principiante", "justificacion": "Sin tecnologías seleccionadas."}

    prompt = f"""Eres un evaluador técnico de un evento de programación.
Basándote en las tecnologías que conoce un participante, sugiere su nivel de experiencia.

Tecnologías que conoce: {', '.join(req.tecnologias)}
Descripción adicional: {req.descripcion or 'No proporcionada'}

Niveles posibles: Principiante, Intermedio, Avanzado

Responde ÚNICAMENTE con un JSON válido con este formato exacto:
{{"nivel": "Intermedio", "justificacion": "Explicación breve de 1-2 oraciones"}}

No incluyas texto adicional fuera del JSON."""

    try:
        respuesta = await llamar_ia(prompt, max_tokens=200)
        # Intentamos parsear el JSON de la IA
        import re
        json_match = re.search(r'\{.*\}', respuesta, re.DOTALL)
        if json_match:
            resultado = json.loads(json_match.group())
            return resultado
        return {"nivel": "Intermedio", "justificacion": respuesta}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error al consultar IA: {str(e)}")



@app.get("/ai/diagnostico")
async def diagnostico_ia():
    """Endpoint público de diagnóstico — muestra el error real de la IA."""
    key_presente = bool(GROQ_KEY)
    key_preview  = f"{GROQ_KEY[:12]}..." if len(GROQ_KEY) > 12 else "(vacía)"

    if not key_presente:
        return {"estado": "ERROR", "problema": "GROQ_API_KEY no configurada", "key_preview": key_preview}

    try:
        async with httpx.AsyncClient(timeout=30) as client:
            resp = await client.post(
                "https://api.groq.com/openai/v1/chat/completions",
                headers={"Authorization": f"Bearer {GROQ_KEY}", "Content-Type": "application/json"},
                json={"model": "llama-3.3-70b-versatile", "max_tokens": 50, "messages": [{"role": "user", "content": "Di solo: OK"}]},
            )
            if resp.status_code == 200:
                return {"estado": "OK", "respuesta": resp.json()["choices"][0]["message"]["content"], "key_preview": key_preview}
            else:
                return {"estado": "ERROR_API", "http_status": resp.status_code, "detalle": resp.text, "key_preview": key_preview}
    except Exception as e:
        return {"estado": "EXCEPCION", "error": str(e), "tipo": type(e).__name__, "key_preview": key_preview}


@app.get("/")
def root():
    return {
        "app":     "Eventos Tech API",
        "version": "2.0.0",
        "docs":    "/docs",
        "ai":      "Powered by Groq (Llama 3.3)",
    }
