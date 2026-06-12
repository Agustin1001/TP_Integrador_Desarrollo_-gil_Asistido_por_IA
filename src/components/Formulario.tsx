import { useContext, useEffect, useRef, useId } from 'react';
import { Participante } from '../models/Participante';
import { ParticipantesContext } from '../context/ParticipantesContext';
import { useForm } from '../hooks/useForm';
import { useSugerirNivel } from '../hooks/useSugerirNivel';

interface FormularioProps {
  onSuccess?: () => void;
}

const Formulario = ({ onSuccess }: FormularioProps) => {
  const context = useContext(ParticipantesContext);

  // ✅ CORRECCIÓN: todos los hooks se declaran ANTES del return condicional
  const nombreInputRef = useRef<HTMLInputElement>(null);

  const nombreId        = useId();
  const emailId         = useId();
  const edadId          = useId();
  const paisId          = useId();
  const nivelId         = useId();
  const terminosId      = useId();
  const modalidadBaseId = useId();
  const tecnologiasBaseId = useId();

  const { formData, setFormData, handleChange, handleArrayChange, resetForm } = useForm({
    nombre:        '',
    email:         '',
    edad:          '' as number | '',
    pais:          'Argentina',
    modalidad:     'Presencial',
    tecnologias:   [] as string[],
    nivel:         'Principiante',
    aceptaTerminos: false,
  });

  const { sugerencia, cargando: cargandoIA, error: errorIA, sugerir, limpiar } = useSugerirNivel();

  // Extraemos participanteActivo de context (puede ser null si context no existe)
  const participanteActivo = context?.participanteActivo ?? null;

  const paises             = ['Argentina', 'Chile', 'Uruguay', 'México', 'España'];
  const opcionesTecnologias = ['React', 'Angular', 'Vue', 'Node', 'Python', 'Java'];

  useEffect(() => {
    nombreInputRef.current?.focus();
  }, []);

  useEffect(() => {
    if (participanteActivo) {
      resetForm({ ...participanteActivo, edad: participanteActivo.edad });
    } else {
      resetForm({
        nombre: '', email: '', edad: '', pais: 'Argentina',
        modalidad: 'Presencial', tecnologias: [], nivel: 'Principiante',
        aceptaTerminos: false,
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [participanteActivo]);

  // ✅ El return condicional va DESPUÉS de todos los hooks
  if (!context) return null;
  const { agregar, editar } = context;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.aceptaTerminos) return alert('Debes aceptar los términos.');

    const p = new Participante(
      participanteActivo?.id || 0,
      formData.nombre, formData.email, Number(formData.edad),
      formData.pais, formData.modalidad, formData.tecnologias,
      formData.nivel, formData.aceptaTerminos,
    );

    if (participanteActivo) {
      await editar(p);
    } else {
      await agregar(p);
    }

    if (onSuccess) onSuccess();
  };

  return (
    <div className="bg-white p-4 sm:p-6 shadow-md rounded-lg mb-8 border-2 border-teal-500 overflow-hidden">
      <div className="bg-slate-700 -m-4 sm:-m-6 mb-4 p-3 sm:mb-6">
        <h2 className="text-lg sm:text-xl font-bold text-white">
          {participanteActivo ? 'Editar Participante' : 'Registro de Participantes'}
        </h2>
      </div>

      <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">

        <div className="flex flex-col">
          <label htmlFor={nombreId} className="font-bold text-sm mb-1 text-black">Nombre</label>
          <input
            ref={nombreInputRef}
            id={nombreId}
            required
            type="text"
            name="nombre"
            value={formData.nombre}
            onChange={handleChange}
            className="border-2 border-teal-400 p-2 rounded focus:outline-none focus:border-teal-600 w-full"
          />
        </div>

        <div className="flex flex-col">
          <label htmlFor={emailId} className="font-bold text-sm mb-1 text-black">Email</label>
          <input
            id={emailId}
            required
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            className="border-2 border-teal-400 p-2 rounded focus:outline-none focus:border-teal-600 w-full"
          />
        </div>

        <div className="flex flex-col">
          <label htmlFor={edadId} className="font-bold text-sm mb-1 text-black">Edad</label>
          <input
            id={edadId}
            required
            type="number"
            name="edad"
            value={formData.edad}
            onChange={handleChange}
            className="border-2 border-teal-400 p-2 rounded focus:outline-none focus:border-teal-600 w-full"
          />
        </div>

        <div className="flex flex-col">
          <label htmlFor={paisId} className="font-bold text-sm mb-1 text-black">País</label>
          <select
            id={paisId}
            name="pais"
            value={formData.pais}
            onChange={handleChange}
            className="border-2 border-teal-400 p-2 rounded focus:outline-none focus:border-teal-600 bg-white w-full"
          >
            {paises.map(pais => <option key={pais} value={pais}>{pais}</option>)}
          </select>
        </div>

        <div className="flex flex-col md:col-span-2">
          <label className="font-bold text-sm mb-1 text-black">Modalidad</label>
          <div className="flex flex-wrap gap-4">
            {['Presencial', 'Virtual', 'Híbrido'].map(mod => {
              const currentId = `${modalidadBaseId}-${mod}`;
              return (
                <label key={mod} htmlFor={currentId} className="flex items-center gap-1 font-medium cursor-pointer">
                  <input
                    id={currentId}
                    type="radio"
                    name="modalidad"
                    value={mod}
                    checked={formData.modalidad === mod}
                    onChange={handleChange}
                    className="accent-teal-600"
                  />
                  {mod}
                </label>
              );
            })}
          </div>
        </div>

        <div className="flex flex-col md:col-span-2">
          <label className="font-bold text-sm mb-2 text-black">Tecnologías conocidas</label>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2">
            {opcionesTecnologias.map(tech => {
              const currentId = `${tecnologiasBaseId}-${tech}`;
              return (
                <label key={tech} htmlFor={currentId} className="flex items-center gap-2 font-medium cursor-pointer">
                  <input
                    id={currentId}
                    type="checkbox"
                    checked={formData.tecnologias.includes(tech)}
                    onChange={() => handleArrayChange('tecnologias', tech)}
                    className="accent-teal-600 shrink-0"
                  />
                  <span className="truncate">{tech}</span>
                </label>
              );
            })}
          </div>
        </div>

        <div className="flex flex-col md:col-span-2">
          <label htmlFor={nivelId} className="font-bold text-sm mb-1 text-black">Nivel de experiencia</label>
          <div className="flex flex-wrap items-center gap-2">
            <select
              id={nivelId}
              name="nivel"
              value={formData.nivel}
              onChange={handleChange}
              className="border-2 border-teal-400 p-2 rounded focus:outline-none focus:border-teal-600 bg-white"
            >
              <option value="Principiante">Principiante</option>
              <option value="Intermedio">Intermedio</option>
              <option value="Avanzado">Avanzado</option>
            </select>
            <button
              type="button"
              onClick={() => sugerir(formData.tecnologias)}
              disabled={cargandoIA || formData.tecnologias.length === 0}
              title={formData.tecnologias.length === 0 ? 'Seleccioná al menos una tecnología' : 'Sugerir nivel con IA'}
              className="flex items-center gap-1 text-sm bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-300 disabled:cursor-not-allowed text-white font-medium px-3 py-2 rounded transition"
            >
              {cargandoIA ? '⏳ Consultando...' : '✨ Sugerir con IA'}
            </button>
          </div>

          {errorIA && (
            <p className="text-red-600 text-xs mt-1">{errorIA}</p>
          )}

          {sugerencia && (
            <div className="mt-2 p-3 bg-indigo-50 border border-indigo-200 rounded text-sm max-w-md">
              <p className="font-semibold text-indigo-800">
                Sugerencia IA: <span className="text-indigo-600">{sugerencia.nivel}</span>
              </p>
              <p className="text-gray-600 mt-1 text-xs leading-relaxed">{sugerencia.justificacion}</p>
              <div className="mt-2 flex gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setFormData(prev => ({ ...prev, nivel: sugerencia.nivel }));
                    limpiar();
                  }}
                  className="text-xs bg-indigo-600 hover:bg-indigo-700 text-white px-3 py-1 rounded transition"
                >
                  Aplicar
                </button>
                <button
                  type="button"
                  onClick={limpiar}
                  className="text-xs bg-gray-200 hover:bg-gray-300 text-gray-700 px-3 py-1 rounded transition"
                >
                  Descartar
                </button>
              </div>
            </div>
          )}
        </div>

        <div className="flex flex-col md:col-span-2 my-2">
          <label htmlFor={terminosId} className="flex items-start gap-2 font-bold cursor-pointer text-black">
            <input
              id={terminosId}
              required
              type="checkbox"
              name="aceptaTerminos"
              checked={formData.aceptaTerminos}
              onChange={handleChange}
              className="accent-teal-600 mt-1 shrink-0"
            />
            <span className="text-sm leading-tight">Acepto los términos y condiciones del evento</span>
          </label>
        </div>

        <div className="md:col-span-2 flex justify-center md:justify-start">
          <button
            type="submit"
            className={`${
              participanteActivo ? 'bg-blue-600 hover:bg-blue-700' : 'bg-teal-600 hover:bg-teal-700'
            } text-white font-bold px-6 py-2 rounded transition shadow-md w-full sm:w-auto`}
          >
            {participanteActivo ? 'Actualizar' : 'Registrar Participante'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default Formulario;
