import { createContext, useReducer, useEffect, type ReactNode } from 'react';
import { Participante } from '../models/Participante';
import { participantesReducer } from '../reducers/participantesReducer';
import type { ParticipantesState } from '../reducers/participantesReducer';

// 1. IMPORTANTE: Traemos el hook de autenticación para obtener el Token
import { useAuth } from './AuthContext';

export interface ContextType {
    participantes: Participante[];
    participanteActivo: Participante | null;
    agregar: (p: Participante) => Promise<void>;
    eliminar: (id: number) => Promise<void>;
    editar: (p: Participante) => Promise<void>;
    seleccionarParaEditar: (p: Participante | null) => void;
    resetear: () => void;
}

export const ParticipantesContext = createContext<ContextType | undefined>(undefined);

const API_URL = `${import.meta.env.VITE_API_URL || 'http://localhost:8000'}/participantes`;

const initialState: ParticipantesState = {
    participantes: [],
    participanteActivo: null
};

export const ParticipantesProvider = ({ children }: { children: ReactNode }) => {
    const [state, dispatch] = useReducer(participantesReducer, initialState);
    
    // 2. Extraemos el token del usuario logueado
    const { token } = useAuth();

    // GET: Obtener participantes
    useEffect(() => {
        // Si no hay token (usuario no logueado), no intentamos traer datos
        if (!token) return;

        fetch(API_URL, {
            // 3. Agregamos el header de Autorización al GET
            headers: { 'Authorization': `Bearer ${token}` }
        })
            .then(response => {
                if (!response.ok) throw new Error('Error al obtener datos');
                return response.json();
            })
            .then(data => {
                dispatch({ type: "GET_PARTICIPANTES", payload: data });
            })
            .catch(error => console.error("Error fetching:", error));
    }, [token]); // El efecto se vuelve a ejecutar si el token cambia (ej: cuando se loguea)

    // POST: Agregar participante
    const agregar = async (nuevo: Participante) => {
        try {
            const response = await fetch(API_URL, {
                method: 'POST',
                headers: { 
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}` // Inyectamos el Token
                },
                body: JSON.stringify(nuevo)
            });
            const data = await response.json();
            dispatch({ type: "AGREGAR", payload: data });
        } catch (error) {
            console.error("Error al agregar:", error);
        }
    };

    // DELETE: Eliminar participante
    const eliminar = async (id: number) => {
        try {
            const response = await fetch(`${API_URL}/${id}`, {
                method: 'DELETE',
                headers: { 
                    'Authorization': `Bearer ${token}` // Inyectamos el Token
                }
            });
            if (response.ok) {
                dispatch({ type: "ELIMINAR", payload: id }); 
            }
        } catch (error) {
            console.error("Error al eliminar:", error);
        }
    };

    // PUT: Editar participante
    const editar = async (participanteModificado: Participante) => {
        try {
            const response = await fetch(`${API_URL}/${participanteModificado.id}`, {
                method: 'PUT',
                headers: { 
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}` // Inyectamos el Token
                },
                body: JSON.stringify(participanteModificado)
            });
            if (response.ok) {
                const data = await response.json();
                dispatch({ type: "EDITAR", payload: data }); 
            }
        } catch (error) {
            console.error("Error al editar:", error);
        }
    };

    const seleccionarParaEditar = (participante: Participante | null) => {
        dispatch({ type: "SET_PARTICIPANTE_ACTIVO", payload: participante });
    };

    const resetear = () => {
        dispatch({ type: "RESET", payload: [] }); 
    };

    return (
        <ParticipantesContext.Provider value={{ 
            participantes: state.participantes, 
            participanteActivo: state.participanteActivo,
            agregar, 
            eliminar, 
            editar,
            seleccionarParaEditar,
            resetear 
        }}>
            {children}
        </ParticipantesContext.Provider>
    );
};