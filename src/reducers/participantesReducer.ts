import { Participante } from "../models/Participante";

// Definimos la forma del estado global
export interface ParticipantesState {
  participantes: Participante[];          // Lista de participantes
  participanteActivo: Participante | null; // Participante seleccionado (por ejemplo, para editar)
}

// Definimos todos los tipos de acciones posibles que pueden modificar el estado
export type Action =
  | { type: "GET_PARTICIPANTES"; payload: Participante[] } // Cargar lista completa
  | { type: "AGREGAR"; payload: Participante }             // Agregar un participante
  | { type: "ELIMINAR"; payload: number }                  // Eliminar por id
  | { type: "RESET"; payload: Participante[] }             // Resetear lista
  | { type: "EDITAR"; payload: Participante }              // Editar participante existente
  | { type: "SET_PARTICIPANTE_ACTIVO"; payload: Participante | null } // Seleccionar participante
  | { type: "SET"; payload: Participante[] };              // Setear lista directamente

// Reducer: función que recibe el estado actual y una acción,
// y devuelve el nuevo estado
export const participantesReducer = (
  state: ParticipantesState,
  action: Action
): ParticipantesState => {

  switch (action.type) {

    // Estos tres casos hacen lo mismo:
    // reemplazan toda la lista de participantes
    case "GET_PARTICIPANTES":
    case "SET":
    case "RESET":
      return {
        ...state, // mantenemos el resto del estado
        participantes: action.payload // reemplazamos la lista
      };

    // Agrega un nuevo participante al array
    case "AGREGAR":
      return {
        ...state,
        participantes: [
          ...state.participantes, // copiamos los existentes
          action.payload          // agregamos el nuevo
        ]
      };

    // Elimina un participante por id
    case "ELIMINAR":
      return {
        ...state,
        participantes: state.participantes.filter(
          (p) => p.id !== action.payload // filtramos el que no coincida con el id
        )
      };

    // Edita un participante existente
    case "EDITAR":
      return {
        ...state,
        participantes: state.participantes.map((p) =>
          p.id === action.payload.id
            ? action.payload // si coincide el id, lo reemplaza
            : p              // si no, lo deja igual
        ),
        participanteActivo: null // resetea el activo después de editar
      };

    // Setea el participante activo (por ejemplo, para formulario)
    case "SET_PARTICIPANTE_ACTIVO":
      return {
        ...state,
        participanteActivo: action.payload
      };

    // Si la acción no coincide con ningún caso,
    // devuelve el estado sin cambios
    default:
      return state;
  }
};