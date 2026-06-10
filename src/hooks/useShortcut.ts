import { useEffect } from 'react';

interface UseShortcutProps {
  key: string;
  requireCtrl?: boolean;
  callback: () => void;
}

export const useShortcut = ({ key, requireCtrl = true, callback }: UseShortcutProps) => {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const targetKey = key.toLowerCase();
      const pressedKey = e.key.toLowerCase();

      // Verifica si coincide la tecla y, si se requiere Ctrl, que esté presionado
      const isCtrlPressed = requireCtrl ? (e.ctrlKey || e.metaKey) : true;

      if (isCtrlPressed && pressedKey === targetKey) {
        e.preventDefault(); // Previene el comportamiento por defecto del navegador
        callback();
      }
    };

    window.addEventListener('keydown', handleKeyDown);

    // Limpieza al desmontar el componente
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [key, requireCtrl, callback]);
};