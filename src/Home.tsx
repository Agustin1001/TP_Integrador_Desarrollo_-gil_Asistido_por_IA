import { useState } from 'react';
import { Routes, Route, Link, useNavigate } from 'react-router-dom';
import ListaPage from './pages/ListaPage';
import FormularioPage from './pages/FormularioPage';
import EditarPage from './pages/EditarPage';
import LoginPage from './pages/LoginPage';
import PublicaPage from './pages/PublicaPage';
import PrivateRoute from './routes/PrivateRoute';
import { useAuth } from './context/AuthContext';

function Home() {
  const [menuAbierto, setMenuAbierto] = useState(false);
  const { user, logout } = useAuth(); // Obtenemos el usuario y la función de logout
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-fuchsia-50 font-sans">
      
      {/* El NavBar solo se muestra si el usuario está logueado */}
      {user && (
        <nav className="bg-fuchsia-700 text-white shadow-md">
          <div className="max-w-6xl mx-auto px-4">
            <div className="flex justify-between items-center py-4">
              <Link to="/lista" className="text-2xl font-extrabold tracking-tight">
                Eventos Tech
              </Link>
              
              <div className="md:hidden">
                <button onClick={() => setMenuAbierto(!menuAbierto)} className="focus:outline-none">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    {menuAbierto ? (
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                    ) : (
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
                    )}
                  </svg>
                </button>
              </div>

              <div className="hidden md:flex space-x-4 font-bold items-center">
                <Link to="/lista" className="hover:text-fuchsia-200 transition">Listado</Link>
                {/* Ocultamos Nuevo Registro si no es ADMIN */}
                {user.rol === "ADMIN" && (
                  <Link to="/nuevo" className="hover:text-fuchsia-200 transition">Nuevo Registro</Link>
                )}
                <button onClick={handleLogout} className="bg-fuchsia-800 px-3 py-1 rounded hover:bg-fuchsia-900 transition">
                  Cerrar Sesión
                </button>
              </div>
            </div>
            
            {menuAbierto && (
              <div className="md:hidden pb-4 flex flex-col space-y-2 font-bold">
                <Link to="/lista" onClick={() => setMenuAbierto(false)} className="block hover:bg-fuchsia-600 px-2 py-1 rounded">Listado</Link>
                {user.rol === "ADMIN" && (
                  <Link to="/nuevo" onClick={() => setMenuAbierto(false)} className="block hover:bg-fuchsia-600 px-2 py-1 rounded">Nuevo Registro</Link>
                )}
                <button onClick={() => { handleLogout(); setMenuAbierto(false); }} className="text-left block hover:bg-fuchsia-600 px-2 py-1 rounded w-full">
                  Cerrar Sesión
                </button>
              </div>
            )}
          </div>
        </nav>
      )}

      {/* DEFINICIÓN DE RUTAS PROTEGIDAS */}
      <div className="max-w-6xl mx-auto p-6">
        <Routes>
          {/* Rutas Públicas */}
          <Route path="/" element={<LoginPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/publica" element={<PublicaPage />} />

          {/* Rutas Privadas */}
          <Route path="/lista" element={
            <PrivateRoute>
              <ListaPage />
            </PrivateRoute>
          } />
          
          <Route path="/nuevo" element={
            <PrivateRoute rol="ADMIN">
              <FormularioPage />
            </PrivateRoute>
          } />
          
          <Route path="/editar/:id" element={
            <PrivateRoute rol="ADMIN">
              <EditarPage />
            </PrivateRoute>
          } />
        </Routes>
      </div>
    </div>
  );
}

export default Home;