import React from 'react'
import ReactDOM from 'react-dom/client'
import Home from './Home.tsx'
import './index.css'
import { ParticipantesProvider } from './context/ParticipantesContext'
import { BrowserRouter } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext' // 1. Importamos el AuthProvider

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <BrowserRouter>
      {/* 2. El AuthProvider debe ser padre del ParticipantesProvider */}
      <AuthProvider>
        <ParticipantesProvider>
          <Home />
        </ParticipantesProvider>
      </AuthProvider>
    </BrowserRouter>
  </React.StrictMode>,
)