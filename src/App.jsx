import React, { useState } from 'react';
import { FinanzasProvider } from './context/FinanzasContext';
import Sidebar from './components/Sidebar';
import BottomNav from './components/BottomNav';
import Dashboard from './pages/Dashboard';
import Cuentas from './pages/Cuentas';
import Transacciones from './pages/Transacciones';
import Estadisticas from './pages/Estadisticas';
import Configuracion from './pages/Configuracion';
import './index.css';

const PAGINAS = {
  dashboard: Dashboard,
  cuentas: Cuentas,
  transacciones: Transacciones,
  estadisticas: Estadisticas,
  configuracion: Configuracion,
};

function AppInner() {
  const [pagina, setPagina] = useState('dashboard');

  const PaginaActual = PAGINAS[pagina] || Dashboard;

  return (
    <div className="app-layout">
      <Sidebar paginaActual={pagina} onNavegar={setPagina} />
      <main className="main-content">
        <PaginaActual onNavegar={setPagina} />
      </main>
      <BottomNav paginaActual={pagina} onNavegar={setPagina} />
    </div>
  );
}

export default function App() {
  return (
    <FinanzasProvider>
      <AppInner />
    </FinanzasProvider>
  );
}
