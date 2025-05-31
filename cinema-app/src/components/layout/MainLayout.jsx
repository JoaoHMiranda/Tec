// src/components/layout/MainLayout.jsx
import React from 'react';
import { Outlet } from 'react-router-dom';
import AppNavbar from '../navbar/AppNavbar'; // <<< CAMINHO ATUALIZADO AQUI
import { Container } from 'react-bootstrap';

function MainLayout() {
  return (
    <>
      <AppNavbar />
      <Container fluid="md" className="mt-4 mb-4">
        <main>
          <Outlet />
        </main>
      </Container>
      <footer className="bg-dark text-white text-center p-3 mt-auto">
        <Container>
          <p>&copy; {new Date().getFullYear()} CinemaApp. Todos os direitos reservados.</p>
        </Container>
      </footer>
    </>
  );
}

export default MainLayout;