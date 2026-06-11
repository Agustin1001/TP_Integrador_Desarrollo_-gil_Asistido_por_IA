import { useNavigate } from 'react-router-dom';
import { useContext, useEffect } from 'react';
import { ParticipantesContext } from '../context/ParticipantesContext';
import Formulario from '../components/Formulario';

export default function FormularioPage() {
  const navigate = useNavigate();
  const context  = useContext(ParticipantesContext);

  useEffect(() => {
    // ✅ CORRECCIÓN: null en lugar de null as any
    if (context?.seleccionarParaEditar) {
      context.seleccionarParaEditar(null);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div>
      <h1 className="text-2xl font-extrabold mb-4 text-black">
        Añadir Nuevo Participante
      </h1>
      <Formulario onSuccess={() => navigate('/lista')} />
    </div>
  );
}
