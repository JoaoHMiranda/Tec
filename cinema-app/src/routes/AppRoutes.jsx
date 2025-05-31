// src/routes/AppRoutes.jsx
import React from 'react';
import { Routes, Route } from 'react-router-dom';

// Layout Principal
import MainLayout from '../components/layout/MainLayout';

// Páginas
import HomePage from '../pages/HomePage';
import VendaIngressos from '../pages/VendaIngressos';
import GerenciarFilmes from '../pages/GerenciarFilmes';
import GerenciarSalas from '../pages/GerenciarSalas';   
import GerenciarSessoes from '../pages/GerenciarSessoes';

// (Opcional: Componente para página não encontrada)
// import NotFoundPage from '../pages/NotFoundPage';

function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<MainLayout />}>
        <Route index element={<HomePage />} />
        
        <Route path="vender-ingresso" element={<VendaIngressos />} />
        <Route path="vender-ingresso/:sessaoId" element={<VendaIngressos />} />

        <Route path="filmes" element={<GerenciarFilmes />} /> 
        <Route path="salas" element={<GerenciarSalas />} />
        <Route path="gerenciar-sessoes" element={<GerenciarSessoes />} />
        
        {/* <Route path="*" element={<NotFoundPage />} /> */}
      </Route>
    </Routes>
  );
}

export default AppRoutes;