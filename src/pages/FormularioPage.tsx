import { useNavigate } from "react-router-dom";
import { useContext, useEffect } from "react";
import { ParticipantesContext } from "../context/ParticipantesContext";
import Formulario from "../components/Formulario";

export default function FormularioPage() {
  const navigate = useNavigate();
  const context = useContext(ParticipantesContext);

  useEffect(() => {
    // Limpiamos el participante seleccionado al entrar a crear uno nuevo
    if (context && context.seleccionarParaEditar) {
      context.seleccionarParaEditar(null as any); 
    }
    
  }, []); // Arreglo vacío para que se ejecute una sola vez al cargar la página

  return (
    <div>
      <h1 className="text-2xl font-extrabold mb-4 text-black">
        Añadir Nuevo Participante
      </h1>
      {/* El formulario se encargará de redirigir a la lista al completar el proceso */}
      <Formulario onSuccess={() => navigate("/lista")} />
    </div>
  );
}