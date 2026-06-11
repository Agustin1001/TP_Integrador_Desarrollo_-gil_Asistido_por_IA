import { useNavigate, useParams } from 'react-router-dom';
import { useContext, useEffect } from 'react';
import { ParticipantesContext } from '../context/ParticipantesContext';
import Formulario from '../components/Formulario';

export default function EditarPage() {
  const { id }     = useParams();
  const navigate   = useNavigate();
  const context    = useContext(ParticipantesContext);

  useEffect(() => {
    if (context && id) {
      const p = context.participantes.find(part => part.id === Number(id));
      if (p) context.seleccionarParaEditar(p);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id, context?.participantes]);

  return (
    <div>
      <h1 className="text-2xl font-extrabold mb-4 text-black">
        Editar Participante
      </h1>
      <Formulario onSuccess={() => navigate('/lista')} />
    </div>
  );
}
