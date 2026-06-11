import React, { useRef } from 'react';
import { useShortcut } from '../hooks/useShortcut';

//Cambiamos la lógica nativa del useEffect por nuestro nuevo hook useShortcut
interface FiltrosProps {
  filtros: {
    nombre: string;
    modalidad: string;
    nivel: string;
  };
  setFiltros: React.Dispatch<React.SetStateAction<{
    nombre: string;
    modalidad: string;
    nivel: string;
  }>>;
  onLimpiar: () => void;
}

const Filtros = ({ filtros, setFiltros, onLimpiar }: FiltrosProps) => {
  
  const buscarInputRef = useRef<HTMLInputElement>(null);

  // PARTE 3: Usamos nuestro Custom Hook genérico para el atajo Ctrl + B
  useShortcut({
    key: 'b',
    requireCtrl: true,
    callback: () => buscarInputRef.current?.focus()
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFiltros(prev => ({ ...prev, [name]: value }));
  };

  return (
    <div className="bg-white p-6 shadow-md rounded-lg mb-8 flex flex-wrap gap-4 items-end border-2 border-teal-500">
      
      <div className="flex flex-col">
        <label className="text-sm font-bold text-black mb-1">Buscar por nombre</label>
        <input 
          ref={buscarInputRef}
          type="text" 
          name="nombre"
          placeholder="Buscar con Ctrl + B..." 
          value={filtros.nombre} 
          onChange={handleChange} 
          className="border-2 border-teal-400 p-2 rounded focus:outline-none focus:border-teal-600" 
        />
      </div>
      
      <div className="flex flex-col">
        <label className="text-sm font-bold text-black mb-1">Filtrar por modalidad</label>
        <select 
          name="modalidad"
          value={filtros.modalidad} 
          onChange={handleChange} 
          className="border-2 border-teal-400 p-2 rounded focus:outline-none focus:border-teal-600 bg-white"
        >
          <option value="Todas">Todas</option>
          <option value="Presencial">Presencial</option>
          <option value="Virtual">Virtual</option>
          <option value="Híbrido">Híbrido</option>
        </select>
      </div>
      
      <div className="flex flex-col">
        <label className="text-sm font-bold text-black mb-1">Filtrar por nivel</label>
        <select 
          name="nivel"
          value={filtros.nivel} 
          onChange={handleChange} 
          className="border-2 border-teal-400 p-2 rounded focus:outline-none focus:border-teal-600 bg-white"
        >
          <option value="Todos">Todos</option>
          <option value="Principiante">Principiante</option>
          <option value="Intermedio">Intermedio</option>
          <option value="Avanzado">Avanzado</option>
        </select>
      </div>

      <div className="flex-grow flex justify-end items-end">
        <button 
          onClick={onLimpiar}
          className="bg-red-500 text-white font-bold px-4 py-2 rounded hover:bg-red-600 transition shadow-sm"
        >
          Limpiar filtros
        </button>
      </div>

    </div>
  );
};

export default Filtros;