import { useState } from 'react';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const useForm = <T extends Record<string, any>>(initialState: T) => {
  const [formData, setFormData] = useState<T>(initialState);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;

    if (type === 'checkbox') {
      const target = e.target as HTMLInputElement;
      setFormData((prev) => ({ ...prev, [name]: target.checked }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleArrayChange = (arrayName: keyof T, item: string) => {
    setFormData((prev) => {
      const currentArray = (prev[arrayName] as string[]) || [];
      const updatedArray = currentArray.includes(item)
        ? currentArray.filter((t) => t !== item)
        : [...currentArray, item];
      return { ...prev, [arrayName]: updatedArray };
    });
  };

  const resetForm = (newState: T = initialState) => {
    setFormData(newState);
  };

  return { formData, setFormData, handleChange, handleArrayChange, resetForm };
};
