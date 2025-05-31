// src/components/layout/AppNavbar.jsx
import React from 'react';
import { NavLink } from 'react-router-dom';
import { Navbar, Nav, Container } from 'react-bootstrap';
import {
  FaHome, FaTicketAlt, FaFilm,
  FaPhotoVideo,    // Para Filmes
  FaTv,            // Para Salas
  FaCalendarCheck  // Para Sessões
} from 'react-icons/fa';

function AppNavbar() {
  return (
    <Navbar bg="dark" variant="dark" expand="lg" sticky="top" className="shadow-sm">
      <Container>
        <Navbar.Brand as={NavLink} to="/">
          <FaFilm className="me-2" />CinemaApp
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="ms-auto">
            <Nav.Link
              as={NavLink}
              to="/"
              end
              title="Página Inicial"
            >
              <FaHome className="me-1" /> {/* Ícone padrão (branco/cinza claro na navbar dark) */}
              Início
            </Nav.Link>
            
            <Nav.Link
              as={NavLink}
              to="/vender-ingresso"
              title="Vender um Novo Ingresso"
            >
              <FaTicketAlt className="me-1 text-success" /> {/* Ícone Verde */}
              Vender Ingresso
            </Nav.Link>

            <Nav.Link
              as={NavLink}
              to="/filmes"
              title="Gerenciar Filmes"
            >
              <FaPhotoVideo className="me-1 text-info" /> {/* Ícone Ciano/Azul Claro */}
              Filmes
            </Nav.Link>

            <Nav.Link
              as={NavLink}
              to="/salas"
              title="Gerenciar Salas"
            >
              <FaTv className="me-1 text-warning" /> {/* Ícone Amarelo/Laranja */}
              Salas
            </Nav.Link>

            <Nav.Link
              as={NavLink}
              to="/gerenciar-sessoes"
              title="Gerenciar Sessões"
            >
              <FaCalendarCheck className="me-1 text-primary" /> {/* Ícone Azul */}
              Sessões
            </Nav.Link>
            
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}

export default AppNavbar;