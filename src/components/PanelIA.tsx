/**
 * PanelIA.tsx — Panel de Análisis Inteligente con IA
 * 
 * Componente que consume el endpoint /ai/analisis del backend
 * y muestra el informe generado por IA sobre los participantes.
 */

import { useState } from 'react';
import { useAuth } from '../context/AuthContext';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

interface DatosBase {
  total:                number;
  paises:               string[];
  niveles:              Record<string, number>;
  modalidades:          Record<string, number>;
  tecnologias_populares: string[];
}

interface AnalisisResponse {
  analisis:    string;
  datos_base?: DatosBase;
}

export default function PanelIA() {
  const { token } = useAuth();
  const [analisis,  setAnalisis]  = useState<AnalisisResponse | null>(null);
  const [cargando,  setCargando]  = useState(false);
  const [error,     setError]     = useState<string | null>(null);

  const obtenerAnalisis = async () => {
    setCargando(true);
    setError(null);
    setAnalisis(null);

    try {
      const res = await fetch(`${API_URL}/ai/analisis`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error(`Error ${res.status}`);
      const data: AnalisisResponse = await res.json();
      setAnalisis(data);
    } catch (err) {
      setError('No se pudo obtener el análisis. Verificá la conexión con la API.');
      console.error(err);
    } finally {
      setCargando(false);
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-md border-2 border-indigo-400 overflow-hidden mb-8">
      {/* Header */}
      <div className="bg-gradient-to-r from-indigo-600 to-teal-600 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <span className="text-2xl">🤖</span>
          <div>
            <h2 className="text-white font-extrabold text-lg leading-tight">
              Análisis Inteligente
            </h2>
            <p className="text-indigo-200 text-xs">Powered by Groq · Llama 3.3</p>
          </div>
        </div>
        <button
          onClick={obtenerAnalisis}
          disabled={cargando}
          className="bg-white text-indigo-700 font-bold px-4 py-2 rounded-lg text-sm
                     hover:bg-indigo-50 transition shadow-sm disabled:opacity-60
                     disabled:cursor-not-allowed flex items-center gap-2"
        >
          {cargando ? (
            <>
              <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
                <circle className="opacity-25" cx="12" cy="12" r="10"
                        stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor"
                      d="M4 12a8 8 0 018-8v8H4z" />
              </svg>
              Analizando...
            </>
          ) : (
            <>✨ Generar análisis</>
          )}
        </button>
      </div>

      {/* Cuerpo */}
      <div className="p-6">
        {/* Estado inicial */}
        {!analisis && !cargando && !error && (
          <p className="text-gray-500 text-center py-6 text-sm">
            Hacé clic en <strong>"Generar análisis"</strong> para que la IA analice los datos
            de los participantes y te brinde insights y recomendaciones.
          </p>
        )}

        {/* Error */}
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 rounded-lg p-4 text-sm">
            ⚠️ {error}
          </div>
        )}

        {/* Resultado */}
        {analisis && (
          <div className="space-y-4">
            {/* Estadísticas rápidas */}
            {analisis.datos_base && (
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4">
                <StatCard
                  label="Participantes"
                  value={analisis.datos_base.total}
                  icon="👥"
                  color="bg-blue-50 border-blue-200 text-blue-800"
                />
                <StatCard
                  label="Países"
                  value={analisis.datos_base.paises.length}
                  icon="🌎"
                  color="bg-green-50 border-green-200 text-green-800"
                />
                <StatCard
                  label="Tecnologías"
                  value={analisis.datos_base.tecnologias_populares.length}
                  icon="💻"
                  color="bg-indigo-50 border-indigo-200 text-indigo-800"
                />
                <StatCard
                  label="Avanzados"
                  value={analisis.datos_base.niveles['Avanzado'] ?? 0}
                  icon="🚀"
                  color="bg-teal-50 border-teal-200 text-teal-800"
                />
              </div>
            )}

            {/* Análisis de IA */}
            <div className="bg-gradient-to-br from-indigo-50 to-teal-50
                            border border-indigo-200 rounded-lg p-5">
              <div className="flex items-center gap-2 mb-3">
                <span className="text-lg">🧠</span>
                <span className="font-bold text-indigo-800 text-sm uppercase tracking-wide">
                  Análisis de IA
                </span>
              </div>
              <div className="text-gray-700 text-sm leading-relaxed whitespace-pre-line">
                {analisis.analisis}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// ── Sub-componente tarjeta de estadística ─────────────────────────────────────
function StatCard({
  label,
  value,
  icon,
  color,
}: {
  label: string;
  value: number;
  icon:  string;
  color: string;
}) {
  return (
    <div className={`rounded-lg border p-3 text-center ${color}`}>
      <div className="text-2xl mb-1">{icon}</div>
      <div className="text-2xl font-extrabold">{value}</div>
      <div className="text-xs font-medium mt-0.5">{label}</div>
    </div>
  );
}
