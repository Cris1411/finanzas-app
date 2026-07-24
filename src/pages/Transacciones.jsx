import React, { useState, useMemo } from 'react';
import { useFinanzas } from '../context/FinanzasContext';
import { Plus, Search, Trash2, ChevronDown, ChevronUp, Download } from 'lucide-react';
import ItemTransaccion from '../components/ItemTransaccion';
import ModalTransaccion from '../components/ModalTransaccion';

export default function Transacciones() {
  const { transacciones, cuentas, categorias, dispatch, exportarCSV } = useFinanzas();
  const [modalTx, setModalTx] = useState(false);
  const [filtrosAbiertos, setFiltrosAbiertos] = useState(false);

  const [filtros, setFiltros] = useState({
    busqueda: '',
    tipo: '',
    cuentaId: '',
    categoriaId: '',
    mes: '',
  });

  const setFiltro = (k, v) => setFiltros(f => ({ ...f, [k]: v }));

  const txFiltradas = useMemo(() => {
    return transacciones.filter(tx => {
      if (filtros.busqueda && !tx.descripcion.toLowerCase().includes(filtros.busqueda.toLowerCase())) return false;
      if (filtros.tipo && tx.tipo !== filtros.tipo) return false;
      if (filtros.cuentaId && tx.cuentaId !== filtros.cuentaId) return false;
      if (filtros.categoriaId && tx.categoriaId !== filtros.categoriaId) return false;
      if (filtros.mes) {
        const [año, mes] = filtros.mes.split('-').map(Number);
        const d = new Date(tx.fecha);
        if (d.getFullYear() !== año || d.getMonth() + 1 !== mes) return false;
      }
      return true;
    });
  }, [transacciones, filtros]);

  const totalIngresos = txFiltradas.filter(t => t.tipo === 'ingreso').reduce((s, t) => s + t.monto, 0);
  const totalGastos = txFiltradas.filter(t => t.tipo === 'gasto').reduce((s, t) => s + t.monto, 0);

  const hayFiltros = Object.values(filtros).some(v => v !== '');
  const limpiarFiltros = () => setFiltros({ busqueda: '', tipo: '', cuentaId: '', categoriaId: '', mes: '' });

  return (
    <div className="page-content">
      {/* Header */}
      <div className="page-header">
        <div>
          <h1 className="page-title">Transacciones</h1>
          <p className="page-subtitle">{txFiltradas.length} movimiento{txFiltradas.length !== 1 ? 's' : ''}</p>
        </div>
        {/* Grupo de botones en mobile */}
        <div className="btn-group" style={{ display: 'flex', gap: '0.5rem' }}>
          <button className="btn btn-ghost" onClick={exportarCSV} title="Exportar CSV">
            <Download size={16} /> CSV
          </button>
          <button className="btn btn-primary" onClick={() => setModalTx(true)}>
            <Plus size={16} /> Nueva
          </button>
        </div>
      </div>

      {/* Mini resumen — siempre 2 cols */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '0.75rem', marginBottom: '1rem' }}>
        <div className="stat-card green" style={{ padding: '0.875rem 1rem' }}>
          <div className="stat-label">Ingresos</div>
          <div className="stat-value positive">+{totalIngresos.toLocaleString('es-AR')}</div>
        </div>
        <div className="stat-card red" style={{ padding: '0.875rem 1rem' }}>
          <div className="stat-label">Gastos</div>
          <div className="stat-value negative">-{totalGastos.toLocaleString('es-AR')}</div>
        </div>
      </div>

      {/* Búsqueda rápida siempre visible */}
      <div style={{ position: 'relative', marginBottom: '0.625rem' }}>
        <Search size={15} style={{ position: 'absolute', left: '0.875rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)', pointerEvents: 'none' }} />
        <input
          className="input"
          style={{ paddingLeft: '2.4rem', paddingRight: filtros.busqueda ? '2.4rem' : '1rem' }}
          placeholder="Buscar transacciones..."
          value={filtros.busqueda}
          onChange={e => setFiltro('busqueda', e.target.value)}
        />
        {filtros.busqueda && (
          <button
            onClick={() => setFiltro('busqueda', '')}
            style={{ position: 'absolute', right: '0.75rem', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)', padding: '0.25rem' }}
          >
            ✕
          </button>
        )}
      </div>

      {/* Botón para mostrar/ocultar filtros avanzados */}
      <button
        className="btn btn-ghost btn-sm"
        style={{ width: '100%', marginBottom: '0.75rem', justifyContent: 'space-between' }}
        onClick={() => setFiltrosAbiertos(!filtrosAbiertos)}
      >
        <span>Filtros avanzados {hayFiltros && `(${Object.values(filtros).filter(v => v && v !== filtros.busqueda).length} activos)`}</span>
        {filtrosAbiertos ? <ChevronUp size={15} /> : <ChevronDown size={15} />}
      </button>

      {/* Panel filtros avanzados */}
      {filtrosAbiertos && (
        <div className="filtros-bar" style={{ marginBottom: '1rem' }}>
          <select className="input" value={filtros.tipo} onChange={e => setFiltro('tipo', e.target.value)}>
            <option value="">Todos los tipos</option>
            <option value="ingreso">✅ Ingresos</option>
            <option value="gasto">❌ Gastos</option>
            <option value="transferencia">🔄 Transferencias</option>
          </select>

          <select className="input" value={filtros.cuentaId} onChange={e => setFiltro('cuentaId', e.target.value)}>
            <option value="">Todas las cuentas</option>
            {cuentas.map(c => <option key={c.id} value={c.id}>{c.nombre}</option>)}
          </select>

          <select className="input" value={filtros.categoriaId} onChange={e => setFiltro('categoriaId', e.target.value)}>
            <option value="">Todas las categorías</option>
            {categorias.map(c => <option key={c.id} value={c.id}>{c.nombre}</option>)}
          </select>

          <input
            className="input"
            type="month"
            value={filtros.mes}
            onChange={e => setFiltro('mes', e.target.value)}
          />

          {hayFiltros && (
            <button className="btn btn-danger btn-sm" onClick={limpiarFiltros}>
              Limpiar filtros
            </button>
          )}
        </div>
      )}

      {/* Lista de transacciones */}
      {txFiltradas.length === 0 ? (
        <div className="card empty-state">
          <div style={{ fontSize: '2.5rem', marginBottom: '0.75rem' }}>📂</div>
          <h3>Sin transacciones</h3>
          <p style={{ marginBottom: '1rem' }}>
            {hayFiltros ? 'Ningún movimiento coincide con los filtros' : 'Registrá tu primer movimiento'}
          </p>
          {!hayFiltros && (
            <button className="btn btn-primary btn-sm" onClick={() => setModalTx(true)}>
              <Plus size={14} /> Agregar
            </button>
          )}
        </div>
      ) : (
        <div className="tx-list">
          {txFiltradas.map(tx => (
            <div key={tx.id} style={{ position: 'relative' }}>
              <ItemTransaccion transaccion={tx} />
              {/* Botón eliminar — swipe-friendly en mobile */}
              <button
                className="btn btn-ghost btn-icon btn-sm"
                onClick={() => {
                  if (window.confirm('¿Eliminar esta transacción?')) {
                    dispatch({ type: 'ELIMINAR_TRANSACCION', payload: tx.id });
                  }
                }}
                style={{
                  position: 'absolute',
                  right: '0.25rem',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  color: 'var(--accent-red)',
                  opacity: 0.4,
                  minHeight: '44px',
                  minWidth: '44px',
                }}
                onMouseEnter={e => e.currentTarget.style.opacity = 1}
                onMouseLeave={e => e.currentTarget.style.opacity = 0.4}
                onFocus={e => e.currentTarget.style.opacity = 1}
                onBlur={e => e.currentTarget.style.opacity = 0.4}
                title="Eliminar transacción"
                aria-label="Eliminar transacción"
              >
                <Trash2 size={15} />
              </button>
            </div>
          ))}
        </div>
      )}

      {modalTx && <ModalTransaccion onClose={() => setModalTx(false)} />}
    </div>
  );
}
