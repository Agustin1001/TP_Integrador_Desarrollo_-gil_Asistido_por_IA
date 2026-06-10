//Este componente envuelve a las páginas que queremos proteger.
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { type ReactNode } from 'react';

interface PrivateRouteProps {
  children: ReactNode;
  rol?: string;
}

export default function PrivateRoute({ children, rol }: PrivateRouteProps) {
  const { user } = useAuth();

  // Si no hay usuario logueado, lo mandamos al login
  if (!user) {
    return <Navigate to="/login" />;
  }

  // Si la ruta requiere un rol específico y el usuario no lo tiene, lo mandamos al inicio
  if (rol && user.rol !== rol) {
    return <Navigate to="/lista" />; // O a "/" dependiendo de cómo organices el menú
  }

  // Si pasa las validaciones, renderiza la página
  return children;
}