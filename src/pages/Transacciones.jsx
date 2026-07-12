import React, { useState, useMemo } from 'react';
import { useFinanzas } from '../context/FinanzasContext';
import { Plus, Search, Trash2, Filter, Download } from 'lucide-react';
import ItemTransaccion from '../components/ItemTransaccion';
import ModalTransaccion from '../components/ModalTransaccion';

export default function Transacciones() {
  const { transacciones, cuentas, categorias, dispatch, exportarCSV } = useFinanzas();
  const [modalTx, setModalTx] = useState(false);

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
      <div className="page-header">
        <div>
          <h1 className="page-title">Transacciones</h1>
          <p className="page-subtitle">{txFiltradas.length} movimiento{txFiltradas.length !== 1 ? 's' : ''}</p>
        </div>
        <div style={{ display: 'flex', gap: '0.5rem' }}>
          <button className="btn btn-ghost" onClick={exportarCSV} title="Exportar CSV">
            <Download size={16} /> CSV
          </button>
          <button className="btn btn-primary" onClick={() => setModalTx(true)}>
            <Plus size={16} /> Nueva
          </button>
        </div>
      </div>

      {/* Mini resumen */}
      <div className="grid-2 md-2" style={{ marginBottom: '1.25rem' }}>
        <div className="stat-card green" style={{ padding: '1rem' }}>
          <div className="stat-label">Ingresos filtrados</div>
          <div className="stat-value positive" style={{ fontSize: '1.3rem' }}>
            +{totalIngresos.toLocaleString('es-AR')}
          </div>
        </div>
        <div className="stat-card red" style={{ padding: '1rem' }}>
          <div className="stat-label">Gastos filtrados</div>
          <div className="stat-value negative" style={{ fontSize: '1.3rem' }}>
            -{totalGastos.toLocaleString('es-AR')}
          </div>
        </div>
      </div>

      {/* Filtros */}
      <div className="filtros-bar">
        <div style={{ position: 'relative', flex: '1 1 200px', minWidth: 150 }}>
          <Search size={14} style={{ position: 'absolute', left: '0.6rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
          <input
            className="input"
            style={{ paddingLeft: '2rem' }}
            placeholder="Buscar..."
            value={filtros.busqueda}
            onChange={e => setFiltro('busqueda', e.target.value)}
          />
        </div>

        <select className="input" value={filtros.tipo} onChange={e => setFiltro('tipo', e.target.value)}>
          <option value="">Todos los tipos</option>
          <option value="ingreso">Ingresos</option>
          <option value="gasto">Gastos</option>
          <option value="transferencia">Transferencias</option>
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
          <button className="btn btn-ghost btn-sm" onClick={limpiarFiltros}>
            <Filter size={14} /> Limpiar
          </button>
        )}
      </div>

      {/* Lista */}
      {txFiltradas.length === 0 ? (
        <div className="empty-state card">
          <div style={{ fontSize: '2.5rem', marginBottom: '0.75rem' }}>📂</div>
          <h3>Sin transacciones</h3>
          <p style={{ marginBottom: '1rem' }}>
            {hayFiltros ? 'Ningún movimiento coincide con los filtros' : 'Registrá tu primer movimiento financiero'}
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
              <button
                className="btn btn-ghost btn-icon btn-sm"
                onClick={() => dispatch({ type: 'ELIMINAR_TRANSACCION', payload: tx.id })}
                style={{
                  position: 'absolute',
                  right: '0.5rem',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  opacity: 0,
                  transition: 'opacity 0.2s',
                  color: 'var(--accent-red)',
                }}
                onMouseEnter={e => e.currentTarget.style.opacity = 1}
                onMouseLeave={e => e.currentTarget.style.opacity = 0}
                title="Eliminar transacción"
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
