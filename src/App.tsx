import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'
import Faq from './pages/institucional/Faq'
import Home from './pages/institucional/Home'
import Integrantes from './pages/institucional/Integrantes'
import Sobre from './pages/institucional/Sobre'
import Contato from './pages/institucional/Contato'
import FeedPage from './pages/app/FeedPage'
import MyReports from './pages/app/MyReports'

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/sobre" element={<Sobre />} />
        <Route path="/integrantes" element={<Integrantes />} />
        <Route path="/faq" element={<Faq />} />
        <Route path="/contato" element={<Contato />} />
        <Route path="/plataforma/feed" element={<FeedPage />} />
        <Route path="/plataforma/meus-reports" element={<MyReports />} />
      </Routes>
    </Router>
  )
}

export default App
