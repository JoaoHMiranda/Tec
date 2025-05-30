import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { useState } from 'react';

import Home from './pages/Home';
import CadastroFilmes from './pages/CadastroFilmes';
import VendaIngressos from './pages/VendaIngressos';
import CadastroSessoes from './pages/CadastroSessoes';
import SessoesDisponiveis from './pages/SessoesDisponiveis';
import CadastroSalas from './pages/CadastroSalas';

function Navbar() {
  const [menuAberto, setMenuAberto] = useState(false);

  const toggleMenu = () => setMenuAberto(!menuAberto);
  const fecharMenu = () => setMenuAberto(false);

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark fixed-top">
      <div className="container-fluid">
        <Link className="navbar-brand" to="/" onClick={fecharMenu}>Cinema</Link>
        <button
          className="navbar-toggler"
          type="button"
          onClick={toggleMenu}
          aria-controls="navbarNav"
          aria-expanded={menuAberto}
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className={`collapse navbar-collapse ${menuAberto ? 'show' : ''}`} id="navbarNav">
          <ul className="navbar-nav me-auto">
            <li className="nav-item">
              <Link className="nav-link" to="/cadastro-filmes" onClick={fecharMenu}>Cadastro de Filmes</Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/cadastro-salas" onClick={fecharMenu}>Cadastro de Salas</Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/cadastro-sessoes" onClick={fecharMenu}>Cadastro de Sessões</Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/venda-ingressos" onClick={fecharMenu}>Venda de Ingressos</Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/sessoes" onClick={fecharMenu}>Listagem de Sessões</Link>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
}

export default function App() {
  return (
    <Router>
      <Navbar />
      <div className="container mt-5 pt-5">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/cadastro-filmes" element={<CadastroFilmes />} />
          <Route path="/cadastro-salas" element={<CadastroSalas />} />
          <Route path="/cadastro-sessoes" element={<CadastroSessoes />} />
          <Route path="/venda-ingressos" element={<VendaIngressos />} />
          <Route path="/sessoes" element={<SessoesDisponiveis />} />
        </Routes>
      </div>
    </Router>
  );
}
