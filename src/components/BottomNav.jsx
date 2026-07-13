import React, { useState } from 'react';
import { useFinanzas } from '../context/FinanzasContext';
import {
  LayoutDashboard, Wallet, List, BarChart2, Settings, Plus
} from 'lucide-react';
import ModalTransaccion from './ModalTransaccion';

const NAV_ITEMS = [
  { id: 'dashboard', label: 'Inicio', icon: LayoutDashboard },
  { id: 'cuentas', label: 'Cuentas', icon: Wallet },
  { id: 'transacciones', label: 'Movimientos', icon: List },
  { id: 'estadisticas', label: 'Stats', icon: BarChart2 },
  { id: 'configuracion', label: 'Config', icon: Settings },
];

export default function BottomNav({ paginaActual, onNavegar }) {
  const [showModal, setShowModal] = useState(false);

  const navItemsMid = NAV_ITEMS.slice(0, 2);
  const navItemsRight = NAV_ITEMS.slice(2);

  return (
    <>
      <nav className="bottom-nav">
        <div className="bottom-nav-items">
          {navItemsMid.map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              className={`bottom-nav-item ${paginaActual === id ? 'active' : ''}`}
              onClick={() => onNavegar(id)}
              aria-label={label}
              aria-current={paginaActual === id ? 'page' : undefined}
            >
              <Icon size={20} />
              <span>{label}</span>
            </button>
          ))}

          <button
            className="bottom-nav-fab"
            onClick={() => setShowModal(true)}
            aria-label="Nueva transacción"
            title="Nueva transacción"
          >
            <Plus size={24} />
          </button>

          {navItemsRight.map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              className={`bottom-nav-item ${paginaActual === id ? 'active' : ''}`}
              onClick={() => onNavegar(id)}
              aria-label={label}
              aria-current={paginaActual === id ? 'page' : undefined}
            >
              <Icon size={20} />
              <span>{label}</span>
            </button>
          ))}
        </div>
      </nav>

      {showModal && (
        <ModalTransaccion onClose={() => setShowModal(false)} />
      )}
    </>
  );
}

