import { useState } from 'react';

export const useForm = <T extends Record<string, any>>(initialState: T) => {
  const [formData, setFormData] = useState<T>(initialState);

  // Manejador genérico para inputs de texto, números, selects y checkboxes booleanos
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    
    if (type === 'checkbox') {
      const target = e.target as HTMLInputElement;
      setFormData((prev) => ({
        ...prev,
        [name]: target.checked,
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  // Manejador específico para arrays de checkboxes (como las tecnologías conocidas)
  const handleArrayChange = (arrayName: keyof T, item: string) => {
    setFormData((prev) => {
      const currentArray = (prev[arrayName] as string[]) || [];
      const updatedArray = currentArray.includes(item)
        ? currentArray.filter((t) => t !== item)
        : [...currentArray, item];

      return {
        ...prev,
        [arrayName]: updatedArray,
      };
    });
  };

  // Función para resetear o forzar un nuevo estado (útil al editar)
  const resetForm = (newState: T = initialState) => {
    setFormData(newState);
  };

  return {
    formData,
    setFormData,
    handleChange,
    handleArrayChange,
    resetForm,
  };
};