/**
 * useSugerirNivel.ts — Custom Hook para sugerencia de nivel con IA
 *
 * Llama al endpoint /ai/sugerir-nivel y devuelve el nivel sugerido
 * por la IA según las tecnologías seleccionadas en el formulario.
 */

import { useState } from 'react';
import { useAuth } from '../context/AuthContext';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

interface SugerenciaIA {
  nivel:          string;
  justificacion:  string;
}

export function useSugerirNivel() {
  const { token } = useAuth();
  const [sugerencia, setSugerencia] = useState<SugerenciaIA | null>(null);
  const [cargando,   setCargando]   = useState(false);
  const [error,      setError]      = useState<string | null>(null);

  const sugerir = async (tecnologias: string[], descripcion = '') => {
    if (!tecnologias.length) return;

    setCargando(true);
    setError(null);
    setSugerencia(null);

    try {
      const res = await fetch(`${API_URL}/ai/sugerir-nivel`, {
        method:  'POST',
        headers: {
          'Content-Type':  'application/json',
          Authorization:   `Bearer ${token}`,
        },
        body: JSON.stringify({ tecnologias, descripcion }),
      });

      if (!res.ok) throw new Error(`Error ${res.status}`);
      const data: SugerenciaIA = await res.json();
      setSugerencia(data);
    } catch (err) {
      setError('No se pudo obtener la sugerencia de IA.');
      console.error(err);
    } finally {
      setCargando(false);
    }
  };

  const limpiar = () => {
    setSugerencia(null);
    setError(null);
  };

  return { sugerencia, cargando, error, sugerir, limpiar };
}
