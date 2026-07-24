import React, { useState } from 'react';
import { useFinanzas } from '../context/FinanzasContext';
import {
  LayoutDashboard, Wallet, List, BarChart2, Settings,
  TrendingUp, Moon, Sun, X, Menu
} from 'lucide-react';

const NAV_ITEMS = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { id: 'cuentas', label: 'Cuentas', icon: Wallet },
  { id: 'transacciones', label: 'Transacciones', icon: List },
  { id: 'estadisticas', label: 'Estadísticas', icon: BarChart2 },
  { id: 'configuracion', label: 'Configuración', icon: Settings },
];

const LABELS_PAGINA = {
  dashboard: 'Dashboard',
  cuentas: 'Cuentas',
  transacciones: 'Transacciones',
  estadisticas: 'Estadísticas',
  configuracion: 'Configuración',
};

export default function Sidebar({ paginaActual, onNavegar }) {
  const { tema, dispatch } = useFinanzas();
  const [mobileOpen, setMobileOpen] = useState(false);

  const toggleTema = () => {
    dispatch({ type: 'SET_TEMA', payload: tema === 'oscuro' ? 'claro' : 'oscuro' });
  };

  const navegar = (id) => {
    onNavegar(id);
    setMobileOpen(false);
  };

  return (
    <>
      {/* ===== TOPBAR MOBILE ===== */}
      <header className="mobile-topbar">
        <button
          className="btn btn-ghost btn-icon"
          onClick={() => setMobileOpen(true)}
          aria-label="Abrir menú"
          style={{ marginLeft: '-0.25rem' }}
        >
          <Menu size={22} />
        </button>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <div style={{
            width: 28, height: 28, borderRadius: 8,
            background: 'linear-gradient(135deg, var(--accent-purple), var(--accent-purple-light))',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <TrendingUp size={15} color="white" />
          </div>
          <span style={{ fontWeight: 800, fontSize: '1rem', letterSpacing: '-0.3px' }}>
            {LABELS_PAGINA[paginaActual] || 'FinanzasApp'}
          </span>
        </div>

        <button
          className="btn btn-ghost btn-icon"
          onClick={toggleTema}
          aria-label="Cambiar tema"
          style={{ marginRight: '-0.25rem' }}
        >
          {tema === 'oscuro' ? <Sun size={19} /> : <Moon size={19} />}
        </button>
      </header>

      {/* ===== OVERLAY MOBILE ===== */}
      {mobileOpen && (
        <div
          style={{
            position: 'fixed', inset: 0,
            background: 'rgba(0,0,0,0.55)',
            zIndex: 299,
            backdropFilter: 'blur(2px)',
          }}
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* ===== SIDEBAR ===== */}
      <aside className={`sidebar ${mobileOpen ? 'open' : ''}`}>
        {/* Logo */}
        <div
          className="sidebar-logo"
          style={{ cursor: 'pointer' }}
          onClick={() => navegar('dashboard')}
        >
          <div className="sidebar-logo-icon">
            <TrendingUp size={22} />
          </div>
          <div className="sidebar-logo-text">
            Finanzas<span>App</span>
          </div>
          {/* Cerrar en mobile */}
          <button
            className="btn btn-ghost btn-icon btn-sm"
            onClick={(e) => { e.stopPropagation(); setMobileOpen(false); }}
            style={{ marginLeft: 'auto' }}
            aria-label="Cerrar menú"
          >
            <X size={18} />
          </button>
        </div>

        {/* Navegación */}
        <nav className="sidebar-nav">
          <span className="nav-section-title">Principal</span>
          {NAV_ITEMS.slice(0, 4).map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              className={`nav-item ${paginaActual === id ? 'active' : ''}`}
              onClick={() => navegar(id)}
            >
              <Icon className="nav-icon" size={18} />
              {label}
            </button>
          ))}

          <span className="nav-section-title" style={{ marginTop: '0.5rem' }}>Sistema</span>
          <button
            className={`nav-item ${paginaActual === 'configuracion' ? 'active' : ''}`}
            onClick={() => navegar('configuracion')}
          >
            <Settings className="nav-icon" size={18} />
            Configuración
          </button>
        </nav>

        {/* Footer */}
        <div className="sidebar-footer">
          <button className="nav-item btn-block" onClick={toggleTema}>
            {tema === 'oscuro'
              ? <Sun className="nav-icon" size={18} />
              : <Moon className="nav-icon" size={18} />}
            {tema === 'oscuro' ? 'Modo Claro' : 'Modo Oscuro'}
          </button>
        </div>
      </aside>
    </>
  );
}
