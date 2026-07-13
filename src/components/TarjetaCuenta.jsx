import React, { useState } from 'react';
import { useFinanzas } from '../context/FinanzasContext';
import {
  Wallet, Building2, CreditCard, TrendingUp, PiggyBank,
  MoreVertical, Pencil, Trash2, Plus, X
} from 'lucide-react';
import { TIPOS_CUENTA, MONEDAS } from '../data/datosEjemplo';
import ModalCuenta from './ModalCuenta';

const ICONOS_MAP = {
  Building2, Wallet, CreditCard, TrendingUp, PiggyBank,
};

const COLORES = [
  '#6c5ce7', '#00b894', '#e17055', '#74b9ff', '#fd79a8',
  '#fdcb6e', '#00cec9', '#a29bfe', '#55efc4', '#ff7675',
];

function getIconoTipo(tipo) {
  const cfg = TIPOS_CUENTA[tipo];
  const Icono = ICONOS_MAP[cfg?.icono] || Wallet;
  return Icono;
}

export default function TarjetaCuenta({ cuenta, onClick, onMove, isPrimero, isUltimo }) {
  const { formatMonto, dispatch } = useFinanzas();
  const [menuOpen, setMenuOpen] = useState(false);
  const [editando, setEditando] = useState(false);
  const [confirmando, setConfirmando] = useState(false);

  const Icono = getIconoTipo(cuenta.tipo);
  const tipoCfg = TIPOS_CUENTA[cuenta.tipo] || TIPOS_CUENTA.otro;
  const monedaInfo = MONEDAS[cuenta.moneda] || MONEDAS.ARS;
  const esNegativo = cuenta.saldo < 0;

  const handleEliminar = (e) => {
    e.stopPropagation();
    if (confirmando) {
      dispatch({ type: 'ELIMINAR_CUENTA', payload: cuenta.id });
      setMenuOpen(false);
    } else {
      setConfirmando(true);
      setTimeout(() => setConfirmando(false), 3000);
    }
  };

  const handleCardClick = () => {
    if (onClick) {
      onClick(cuenta);
    } else {
      setEditando(true);
    }
  };

  return (
    <>
      <div className="account-card animate-in" onClick={handleCardClick}>
        <div className="account-card-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <div
              className="account-icon"
              style={{ background: cuenta.color + '22', color: cuenta.color }}
            >
              <Icono size={20} />
            </div>
            <div>
              <div className="account-name">{cuenta.nombre}</div>
              <div className="account-type">{tipoCfg.label}</div>
            </div>
          </div>

          <div style={{ position: 'relative' }}>
            <button
              className="btn btn-ghost btn-icon btn-sm"
              onClick={(e) => { e.stopPropagation(); setMenuOpen(!menuOpen); }}
              aria-label="Opciones"
            >
              <MoreVertical size={16} />
            </button>
            {menuOpen && (
              <div className="dropdown-menu" onClick={e => e.stopPropagation()}>
                <button className="dropdown-item" onClick={() => { setEditando(true); setMenuOpen(false); }}>
                  <Pencil size={14} /> Editar
                </button>
                {onMove && !isPrimero && (
                  <button
                    className="dropdown-item"
                    onClick={(e) => { e.stopPropagation(); onMove(cuenta.id, 'up'); setMenuOpen(false); }}
                  >
                    ▲ Mover arriba
                  </button>
                )}
                {onMove && !isUltimo && (
                  <button
                    className="dropdown-item"
                    onClick={(e) => { e.stopPropagation(); onMove(cuenta.id, 'down'); setMenuOpen(false); }}
                  >
                    ▼ Mover abajo
                  </button>
                )}
                <button
                  className="dropdown-item danger"
                  onClick={handleEliminar}
                >
                  <Trash2 size={14} />
                  {confirmando ? '¿Confirmar?' : 'Eliminar'}
                </button>
              </div>
            )}
          </div>
        </div>

        <div className="account-balance" style={{ color: esNegativo ? 'var(--accent-red)' : 'var(--text-primary)' }}>
          {formatMonto(cuenta.saldo, cuenta.moneda)}
        </div>
        <div className="account-moneda">{monedaInfo.nombre} • {cuenta.moneda}</div>
        {cuenta.descripcion && (
          <div className="text-xs text-muted mt-2" style={{ marginTop: '0.5rem' }}>{cuenta.descripcion}</div>
        )}

        {/* Barra de color */}
        <div
          style={{
            position: 'absolute',
            bottom: 0,
            left: 0,
            right: 0,
            height: '3px',
            background: cuenta.color,
            borderRadius: '0 0 16px 16px',
            opacity: 0.7,
          }}
        />
      </div>

      {editando && (
        <ModalCuenta
          cuenta={cuenta}
          onClose={() => setEditando(false)}
        />
      )}
    </>
  );
}
