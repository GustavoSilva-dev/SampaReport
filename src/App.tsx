import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'
import Home from './pages/institucional/Home'
import Sobre from './pages/institucional/Sobre'

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/sobre" element={<Sobre />} />
      </Routes>
    </Router>
  )
}

export default App
