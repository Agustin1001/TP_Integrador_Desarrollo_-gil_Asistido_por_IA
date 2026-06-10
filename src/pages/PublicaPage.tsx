//Una página de prueba pública (requisito del tp)
import { Link } from 'react-router-dom';

export default function PublicaPage() {
  return (
    <div className="p-8 text-center">
      <h1 className="text-3xl font-bold mb-4">Página Pública</h1>
      <p className="mb-4">Esta página no tiene validación de ningún tipo. Cualquiera puede verla.</p>
      <Link to="/login" className="text-blue-600 hover:underline">Ir a Iniciar Sesión</Link>
    </div>
  );
}