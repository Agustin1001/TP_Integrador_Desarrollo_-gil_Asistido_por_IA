//El formulario de inicio de sesión

import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function LoginPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  
  try {
    const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';
    const response = await fetch(`${BASE_URL}/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password })
    });

    if (response.ok) {
      const data = await response.json();
      login(data.token, data.user);
      navigate("/lista");
    } else {
      alert("Usuario o contraseña incorrectos");
    }
  } catch (error) {
    console.error("Error al iniciar sesión:", error);
  }
};

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-md w-96">
        <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">Iniciar Sesión</h2>
        <p className="text-center text-gray-600 mb-6">Registro de Participantes</p>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Usuario</label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              required
            />
          </div>
          <button
            type="submit"
            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            Login
          </button>
        </form>

        <div className="mt-6 pt-5 border-t border-gray-200">
          <p className="text-xs text-gray-500 text-center mb-3">Usuarios de prueba — clic para autocompletar</p>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => { setUsername('admin'); setPassword('1234'); }}
              className="flex-1 text-left p-3 rounded-lg border-2 border-teal-200 hover:border-teal-500 hover:bg-teal-50 transition group"
            >
              <span className="block text-xs font-bold text-teal-700 group-hover:text-teal-900">admin</span>
              <span className="block text-xs text-gray-500">ADMIN · CRUD completo + IA</span>
            </button>
            <button
              type="button"
              onClick={() => { setUsername('invitado'); setPassword('1234'); }}
              className="flex-1 text-left p-3 rounded-lg border-2 border-indigo-200 hover:border-indigo-500 hover:bg-indigo-50 transition group"
            >
              <span className="block text-xs font-bold text-indigo-700 group-hover:text-indigo-900">invitado</span>
              <span className="block text-xs text-gray-500">CONSULTA · Solo lectura + IA</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}