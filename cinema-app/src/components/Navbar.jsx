import { Link } from 'react-router-dom';
import { useState } from 'react';

export default function Navbar() {
  const [menuAberto, setMenuAberto] = useState(false);

  const toggleMenu = () => setMenuAberto(!menuAberto);
  const fecharMenu = () => setMenuAberto(false);

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
      <div className="container">
        <Link className="navbar-brand" to="/" onClick={fecharMenu}>
          Cinema
        </Link>

        <button
          className="navbar-toggler"
          type="button"
          aria-controls="navbarNav"
          aria-expanded={menuAberto}
          aria-label="Toggle navigation"
          onClick={toggleMenu}
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        <div className={`collapse navbar-collapse ${menuAberto ? 'show' : ''}`} id="navbarNav">
          <ul className="navbar-nav ms-auto">
            <li className="nav-item">
              <Link className="nav-link" to="/filmes" onClick={fecharMenu}>Filmes</Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/salas" onClick={fecharMenu}>Salas</Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/sessoes" onClick={fecharMenu}>Sessões</Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/sessoes-disponiveis" onClick={fecharMenu}>Disponíveis</Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/venda-ingressos" onClick={fecharMenu}>Ingressos</Link>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
}
