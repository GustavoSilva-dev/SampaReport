import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'
import Faq from './pages/institucional/Faq'
import Home from './pages/institucional/Home'
import Integrantes from './pages/institucional/Integrantes'
import Sobre from './pages/institucional/Sobre'

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/sobre" element={<Sobre />} />
        <Route path="/integrantes" element={<Integrantes />} />
        <Route path="/faq" element={<Faq />} />
      </Routes>
    </Router>
  )
}

export default App
