// src/App.jsx
import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import AppRoutes from './routes/AppRoutes';

function App() {
  return (
    <BrowserRouter>  {/* <<< ESSENCIAL: BrowserRouter envolve AppRoutes */}
      <AppRoutes />
    </BrowserRouter>
  );
}

export default App;