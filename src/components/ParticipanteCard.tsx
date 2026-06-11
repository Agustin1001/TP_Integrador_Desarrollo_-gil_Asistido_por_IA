import { useContext } from 'react';
import { Participante } from '../models/Participante';
import { ParticipantesContext } from '../context/ParticipantesContext';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext'; // 1. Importamos el contexto de Auth

interface ParticipanteCardProps {
  participante: Participante;
}

const ParticipanteCard = ({ participante }: ParticipanteCardProps) => {
  const context = useContext(ParticipantesContext);
  const { user } = useAuth(); // 2. Traemos el usuario actual
  const navigate = useNavigate();
  
  if (!context) return null;
  const { eliminar } = context;

  const getEstilosNivel = (nivel: string) => {
    switch (nivel) {
      case 'Principiante': return 'bg-green-200 border-green-600';
      case 'Intermedio': return 'bg-yellow-200 border-yellow-600';
      case 'Avanzado': return 'bg-red-200 border-red-600';
      default: return 'bg-white border-teal-500'; 
    }
  };

  const getColorTextoNivel = (nivel: string) => {
    switch (nivel) {
      case 'Principiante': return 'text-green-700 font-bold';
      case 'Intermedio': return 'text-yellow-700 font-bold';
      case 'Avanzado': return 'text-red-700 font-bold';
      default: return 'text-gray-800';
    }
  };

  return (
    <div className={`shadow-md rounded p-4 hover:shadow-lg transition border-2 flex flex-col h-full ${getEstilosNivel(participante.nivel)}`}>
      <div className="flex-grow">
        <h3 className="font-extrabold text-lg border-b pb-1 mb-2 text-black border-black/10">
          {participante.nombre}
        </h3>
        <p className="text-sm text-black mb-2 font-medium">🌎 {participante.pais}</p>
        <p className="text-sm text-black">
          <strong>Modalidad:</strong> {participante.modalidad}
        </p>
        <p className="text-sm text-black">
          <strong>Nivel:</strong> <span className={getColorTextoNivel(participante.nivel)}>{participante.nivel}</span>
        </p>
        <div className="mt-2 text-sm text-black">
          <strong>Tecnologías:</strong>
          <p className="text-blue-700 font-semibold mt-1">
            {participante.tecnologias.join(' - ') || 'Ninguna'}
          </p>
        </div>
      </div>
      
      {/* 3. Validación de ROL ADMIN para mostrar los botones */}
      {user?.rol === "ADMIN" && (
        <div className="mt-4 flex gap-2">
          <button 
            onClick={() => navigate(`/editar/${participante.id}`)}
            className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-1.5 px-4 rounded text-sm transition-colors w-full"
          >
            Editar
          </button>
          <button 
            onClick={() => eliminar(participante.id)}
            className="bg-red-500 hover:bg-red-600 text-white font-bold py-1.5 px-4 rounded text-sm transition-colors w-full"
          >
            Eliminar
          </button>
        </div>
      )}
    </div>
  );
};

export default ParticipanteCard;