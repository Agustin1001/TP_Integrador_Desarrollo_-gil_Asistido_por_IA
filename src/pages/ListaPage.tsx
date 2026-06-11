import { useState, useContext } from 'react';
import { Link } from 'react-router-dom';
import { ParticipantesContext } from '../context/ParticipantesContext';
import { useAuth } from '../context/AuthContext';
import Filtros from '../components/Filtros';
import ParticipanteCard from '../components/ParticipanteCard';
import PanelIA from '../components/PanelIA';

export default function ListaPage() {
  // ✅ CORRECCIÓN: useState declarado ANTES del return condicional
  const [filtros, setFiltros] = useState({
    nombre:    '',
    modalidad: 'Todas',
    nivel:     'Todos',
  });

  const context = useContext(ParticipantesContext);
  const { user } = useAuth();

  if (!context) return null;
  const { participantes, resetear } = context;

  const resetearDatos = () => {
    if (window.confirm('¿Estás seguro de eliminar todos los registros?')) {
      resetear();
    }
  };

  const limpiarFiltros = () => {
    setFiltros({ nombre: '', modalidad: 'Todas', nivel: 'Todos' });
  };

  const participantesFiltrados = participantes.filter((p) => {
    const matchNombre    = p.nombre.toLowerCase().includes(filtros.nombre.toLowerCase());
    const matchModalidad = filtros.modalidad === 'Todas' || p.modalidad === filtros.modalidad;
    const matchNivel     = filtros.nivel === 'Todos' || p.nivel === filtros.nivel;
    return matchNombre && matchModalidad && matchNivel;
  });

  return (
    <div className="text-black">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-extrabold text-black">Sistema de Registro</h1>

        {user?.rol === 'ADMIN' && (
          <Link
            to="/nuevo"
            className="bg-fuchsia-600 hover:bg-fuchsia-700 text-white font-bold py-2 px-4 rounded shadow transition-colors"
          >
            + Nuevo Participante
          </Link>
        )}
      </div>

      <PanelIA />

      <Filtros filtros={filtros} setFiltros={setFiltros} onLimpiar={limpiarFiltros} />

      <div className="flex justify-between items-center mb-6 p-3 bg-blue-100 rounded text-blue-900 font-bold border-2 border-fuchsia-500 shadow-sm">
        <span>
          Mostrando {participantesFiltrados.length} de {participantes.length} participantes
        </span>

        {user?.rol === 'ADMIN' && (
          <button
            onClick={resetearDatos}
            className="bg-red-500 text-white px-4 py-1 rounded hover:bg-red-600 transition text-sm"
          >
            Resetear datos
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {participantesFiltrados.length === 0 ? (
          <p className="text-black font-bold col-span-full text-center text-lg mt-4">
            No hay participantes
          </p>
        ) : (
          participantesFiltrados.map((p) => (
            <ParticipanteCard key={p.id} participante={p} />
          ))
        )}
      </div>
    </div>
  );
}
