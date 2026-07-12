import React, { useState } from 'react';
import { useFinanzas } from '../context/FinanzasContext';
import { Plus, Search } from 'lucide-react';
import TarjetaCuenta from '../components/TarjetaCuenta';
import ModalCuenta from '../components/ModalCuenta';
import { MONEDAS } from '../data/datosEjemplo';

export default function Cuentas() {
  const { cuentas, formatMonto, getSaldoTotal } = useFinanzas();
  const [modalNueva, setModalNueva] = useState(false);
  const [busqueda, setBusqueda] = useState('');

  const cuentasFiltradas = cuentas.filter(c =>
    c.nombre.toLowerCase().includes(busqueda.toLowerCase()) ||
    c.tipo.toLowerCase().includes(busqueda.toLowerCase())
  );

  const monedas = [...new Set(cuentas.map(c => c.moneda))];

  return (
    <div className="page-content">
      <div className="page-header">
        <div>
          <h1 className="page-title">Cuentas</h1>
          <p className="page-subtitle">{cuentas.length} cuenta{cuentas.length !== 1 ? 's' : ''} registrada{cuentas.length !== 1 ? 's' : ''}</p>
        </div>
        <button className="btn btn-primary" onClick={() => setModalNueva(true)}>
          <Plus size={16} /> Nueva Cuenta
        </button>
      </div>

      {/* Totales por moneda */}
      <div className="grid-4 mb-6" style={{ marginBottom: '1.5rem' }}>
        {monedas.map(moneda => {
          const total = getSaldoTotal(moneda);
          const info = MONEDAS[moneda];
          return (
            <div key={moneda} className="stat-card purple">
              <div className="stat-label">Total {moneda}</div>
              <div className={`stat-value ${total >= 0 ? 'positive' : 'negative'}`}>
                {formatMonto(total, moneda)}
              </div>
              <div className="stat-change">{info?.nombre}</div>
            </div>
          );
        })}
        {monedas.length === 0 && (
          <div className="stat-card purple" style={{ gridColumn: '1/-1' }}>
            <div className="stat-label">Sin cuentas</div>
            <div className="stat-value neutral">—</div>
          </div>
        )}
      </div>

      {/* Buscador */}
      <div className="filtros-bar" style={{ marginBottom: '1.25rem' }}>
        <div style={{ position: 'relative', flex: 1 }}>
          <Search size={16} style={{ position: 'absolute', left: '0.75rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
          <input
            className="input"
            style={{ paddingLeft: '2.25rem' }}
            placeholder="Buscar cuenta..."
            value={busqueda}
            onChange={e => setBusqueda(e.target.value)}
          />
        </div>
      </div>

      {/* Grid de cuentas */}
      {cuentasFiltradas.length === 0 ? (
        <div className="empty-state">
          <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🏦</div>
          <h3>{cuentas.length === 0 ? 'No tenés cuentas aún' : 'No hay resultados'}</h3>
          <p style={{ marginBottom: '1.5rem' }}>
            {cuentas.length === 0 ? 'Agregá tu primera cuenta para empezar a registrar tus finanzas' : 'Probá con otro término de búsqueda'}
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

      {modalNueva && <ModalCuenta onClose={() => setModalNueva(false)} />}
    </div>
  );
}
