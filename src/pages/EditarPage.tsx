import { useNavigate, useParams } from "react-router-dom";
import { useContext, useEffect } from "react";
import { ParticipantesContext } from "../context/ParticipantesContext";
import Formulario from "../components/Formulario";

export default function EditarPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const context = useContext(ParticipantesContext);

  // Buscamos el participante por ID si no está seleccionado
  useEffect(() => {
    if (context && id) {
      const p = context.participantes.find(part => part.id === Number(id));
      if (p) {
        context.seleccionarParaEditar(p);
      }
    }
  }, [id, context?.participantes]);

  return (
    <div>
      <h1 className="text-2xl font-extrabold mb-4 text-black">
        Editar Participante
      </h1>
      {/* CAMBIO CLAVE: Redirigir a /lista en lugar de / */}
      <Formulario onSuccess={() => navigate("/lista")} />
    </div>
  );
}