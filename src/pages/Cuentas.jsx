import React, { useState } from 'react';
import { useFinanzas } from '../context/FinanzasContext';
import {
  Plus, Search, ArrowUp, ArrowDown, GripVertical,
  CheckCircle2, SlidersHorizontal
} from 'lucide-react';
import TarjetaCuenta from '../components/TarjetaCuenta';
import ModalCuenta from '../components/ModalCuenta';
import { MONEDAS, TIPOS_CUENTA } from '../data/datosEjemplo';
import { Wallet, Building2, CreditCard, TrendingUp, PiggyBank } from 'lucide-react';

const ICONOS_TIPO = { Building2, Wallet, CreditCard, TrendingUp, PiggyBank };

function getIconoTipo(tipo) {
  const cfg = TIPOS_CUENTA[tipo];
  return ICONOS_TIPO[cfg?.icono] || Wallet;
}

export default function Cuentas() {
  const { cuentas, formatMonto, getSaldoTotal, dispatch } = useFinanzas();
  const [modalNueva, setModalNueva] = useState(false);
  const [busqueda, setBusqueda] = useState('');
  const [modoOrden, setModoOrden] = useState(false);

  const cuentasFiltradas = cuentas.filter(c =>
    c.nombre.toLowerCase().includes(busqueda.toLowerCase()) ||
    c.tipo.toLowerCase().includes(busqueda.toLowerCase())
  );

  const monedas = [...new Set(cuentas.map(c => c.moneda))];

  const moverCuenta = (id, direction) => {
    dispatch({ type: 'MOVER_CUENTA', payload: { id, direction } });
  };

  return (
    <div className="page-content">
      {/* Header */}
      <div className="page-header">
        <div>
          <h1 className="page-title">Cuentas</h1>
          <p className="page-subtitle">{cuentas.length} cuenta{cuentas.length !== 1 ? 's' : ''}</p>
        </div>
        <div style={{ display: 'flex', gap: '0.5rem' }}>
          <button
            className={`btn ${modoOrden ? 'btn-success' : 'btn-ghost'}`}
            onClick={() => setModoOrden(!modoOrden)}
            title={modoOrden ? 'Confirmar orden' : 'Reordenar cuentas'}
          >
            {modoOrden
              ? <><CheckCircle2 size={16} /> Listo</>
              : <><SlidersHorizontal size={16} /> Ordenar</>
            }
          </button>
          <button className="btn btn-primary" onClick={() => setModalNueva(true)}>
            <Plus size={16} /> Nueva
          </button>
        </div>
      </div>

      {/* Banner modo ordenamiento */}
      {modoOrden && (
        <div style={{
          background: 'linear-gradient(135deg, rgba(0,184,148,0.12), rgba(0,206,201,0.08))',
          border: '1px solid rgba(0,184,148,0.3)',
          borderRadius: '12px',
          padding: '0.875rem 1rem',
          marginBottom: '1rem',
          display: 'flex',
          alignItems: 'center',
          gap: '0.75rem',
          fontSize: '0.875rem',
          color: 'var(--accent-green)',
          fontWeight: 600,
        }}>
          <SlidersHorizontal size={18} />
          <div>
            <div>Modo de ordenamiento activo</div>
            <div style={{ fontWeight: 400, color: 'var(--text-secondary)', fontSize: '0.8rem', marginTop: '0.15rem' }}>
              Usá las flechas ↑ ↓ para mover cada cuenta. Tocá <strong>Listo</strong> para confirmar.
            </div>
          </div>
        </div>
      )}

      {/* Totales por moneda */}
      {!modoOrden && monedas.length > 0 && (
        <div style={{
          display: 'grid',
          gridTemplateColumns: `repeat(${Math.min(monedas.length, 2)}, 1fr)`,
          gap: '0.75rem',
          marginBottom: '1rem',
        }}>
          {monedas.map(moneda => {
            const total = getSaldoTotal(moneda);
            const info = MONEDAS[moneda];
            return (
              <div key={moneda} className="stat-card purple">
                <div className="stat-label">Total {moneda}</div>
                <div className={`stat-value ${total >= 0 ? 'positive' : 'negative'}`}>
                  {formatMonto(total, moneda)}
                </div>
                <div className="stat-change" style={{ fontSize: '0.7rem' }}>{info?.nombre}</div>
              </div>
            );
          })}
        </div>
      )}

      {/* Buscador — oculto en modo orden */}
      {!modoOrden && (
        <div style={{ position: 'relative', marginBottom: '1rem' }}>
          <Search size={15} style={{
            position: 'absolute', left: '0.875rem', top: '50%',
            transform: 'translateY(-50%)', color: 'var(--text-muted)', pointerEvents: 'none',
          }} />
          <input
            className="input"
            style={{ paddingLeft: '2.4rem' }}
            placeholder="Buscar cuenta..."
            value={busqueda}
            onChange={e => setBusqueda(e.target.value)}
          />
        </div>
      )}

      {/* ===== MODO ORDENAMIENTO ===== */}
      {modoOrden ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.625rem' }}>
          {cuentas.map((cuenta, idx) => {
            const Icono = getIconoTipo(cuenta.tipo);
            const tipoCfg = TIPOS_CUENTA[cuenta.tipo] || TIPOS_CUENTA.otro;
            const esNegativo = cuenta.saldo < 0;
            const esPrimero = idx === 0;
            const esUltimo = idx === cuentas.length - 1;

            return (
              <div
                key={cuenta.id}
                className="animate-in"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.75rem',
                  background: 'var(--bg-card)',
                  border: `1px solid ${cuenta.color}44`,
                  borderLeft: `4px solid ${cuenta.color}`,
                  borderRadius: '14px',
                  padding: '0.875rem 1rem',
                  transition: 'all 0.2s ease',
                }}
              >
                {/* Número de posición */}
                <div style={{
                  width: 28, height: 28, borderRadius: '50%',
                  background: cuenta.color + '22',
                  color: cuenta.color,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontWeight: 800, fontSize: '0.8rem', flexShrink: 0,
                }}>
                  {idx + 1}
                </div>

                {/* Ícono tipo */}
                <div style={{
                  width: 38, height: 38, borderRadius: '10px',
                  background: cuenta.color + '20',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  color: cuenta.color, flexShrink: 0,
                }}>
                  <Icono size={18} />
                </div>

                {/* Info */}
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{
                    fontWeight: 700, fontSize: '0.9rem',
                    color: 'var(--text-primary)',
                    overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
                  }}>
                    {cuenta.nombre}
                  </div>
                  <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginTop: '0.1rem' }}>
                    {tipoCfg.label} · {cuenta.moneda}
                  </div>
                </div>

                {/* Saldo */}
                <div style={{
                  fontWeight: 800, fontSize: '0.9rem', flexShrink: 0,
                  color: esNegativo ? 'var(--accent-red)' : 'var(--accent-green)',
                  textAlign: 'right',
                }}>
                  {formatMonto(cuenta.saldo, cuenta.moneda)}
                </div>

                {/* Flechas de orden */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.2rem', flexShrink: 0 }}>
                  <button
                    className="btn btn-ghost btn-icon btn-sm"
                    onClick={() => moverCuenta(cuenta.id, 'up')}
                    disabled={esPrimero}
                    style={{
                      minHeight: 36, minWidth: 36, borderRadius: '8px',
                      opacity: esPrimero ? 0.25 : 1,
                      color: 'var(--accent-purple)',
                      transition: 'all 0.15s ease',
                    }}
                    title="Subir"
                    aria-label="Mover arriba"
                  >
                    <ArrowUp size={16} />
                  </button>
                  <button
                    className="btn btn-ghost btn-icon btn-sm"
                    onClick={() => moverCuenta(cuenta.id, 'down')}
                    disabled={esUltimo}
                    style={{
                      minHeight: 36, minWidth: 36, borderRadius: '8px',
                      opacity: esUltimo ? 0.25 : 1,
                      color: 'var(--accent-purple)',
                      transition: 'all 0.15s ease',
                    }}
                    title="Bajar"
                    aria-label="Mover abajo"
                  >
                    <ArrowDown size={16} />
                  </button>
                </div>
              </div>
            );
          })}

          {/* Botón Listo abajo también */}
          <button
            className="btn btn-success"
            style={{ marginTop: '0.5rem', width: '100%', justifyContent: 'center', padding: '0.875rem' }}
            onClick={() => setModoOrden(false)}
          >
            <CheckCircle2 size={18} /> Confirmar orden
          </button>
        </div>
      ) : (
        /* ===== MODO NORMAL — GRID DE TARJETAS ===== */
        <>
          {cuentasFiltradas.length === 0 ? (
            <div className="empty-state">
              <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🏦</div>
              <h3>{cuentas.length === 0 ? 'No tenés cuentas aún' : 'Sin resultados'}</h3>
              <p style={{ marginBottom: '1.5rem' }}>
                {cuentas.length === 0 ? 'Agregá tu primera cuenta para comenzar' : 'Probá con otro término'}
              </p>
              {cuentas.length === 0 && (
                <button className="btn btn-primary" onClick={() => setModalNueva(true)}>
                  <Plus size={16} /> Agregar cuenta
                </button>
              )}
            </div>
          ) : (
            <div className="grid-auto">
              {cuentasFiltradas.map(cuenta => (
                <TarjetaCuenta key={cuenta.id} cuenta={cuenta} />
              ))}
            </div>
          )}
        </>
      )}

      {modalNueva && <ModalCuenta onClose={() => setModalNueva(false)} />}
    </div>
  );
}
