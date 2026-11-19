import { BrowserRouter as Router, Navigate, Route, Routes } from 'react-router-dom'
import type { ReactNode } from 'react'
import 'leaflet/dist/leaflet.css';
import Faq from './pages/institucional/Faq'
import Home from './pages/institucional/Home'
import Integrantes from './pages/institucional/Integrantes'
import IntegranteDetalhe from './pages/institucional/IntegranteDetalhe'
import Sobre from './pages/institucional/Sobre'
import Contato from './pages/institucional/Contato'
import FeedPage from './pages/app/FeedPage'
import MyReports from './pages/app/MyReports'
import AdminDashboardPage from './pages/app/AdminDashboardPage'
import ErrorPage from './pages/error/ErrorPage'

interface ProtectedRouteProps {
  children: ReactNode
  allowedRole?: 'ROLE_USER' | 'ROLE_ADMIN'
}

function getLoggedUser() {
  return JSON.parse(localStorage.getItem('logged-user') || 'null') as { id?: number; perfil?: 'ROLE_USER' | 'ROLE_ADMIN' } | null
}

function ProtectedRoute({ children, allowedRole }: ProtectedRouteProps) {
  const loggedUser = getLoggedUser()

  if (!loggedUser?.id) return <Navigate to="/" replace />
  if (allowedRole && loggedUser.perfil !== allowedRole) {
    return <Navigate to="/plataforma/feed" replace />
  }

  return <>{children}</>
}

function App() {
  const loggedUser = getLoggedUser()

  return (
    <Router>
      <Routes>
        <Route path="/" element={loggedUser?.id ? <Navigate to="/plataforma/feed" replace /> : <Home />} />
        <Route path="/sobre" element={<Sobre />} />
        <Route path="/integrantes" element={<Integrantes />} />
        <Route path="/integrantes/:slug" element={<IntegranteDetalhe />} />
        <Route path="/faq" element={<Faq />} />
        <Route path="/contato" element={<Contato />} />
        <Route path="/plataforma/feed" element={<ProtectedRoute><FeedPage /></ProtectedRoute>} />
        <Route path="/plataforma/meus-reports" element={<ProtectedRoute allowedRole="ROLE_USER"><MyReports /></ProtectedRoute>} />
        <Route path="/admin" element={<ProtectedRoute allowedRole="ROLE_ADMIN"><AdminDashboardPage /></ProtectedRoute>} />
        <Route path="*" element={<ErrorPage />} />
      </Routes>
    </Router>
  )
}

export default App
