import React, { useState } from 'react';
import { useFinanzas } from '../context/FinanzasContext';
import { X, ArrowUpCircle, ArrowDownCircle, ArrowLeftRight } from 'lucide-react';

export default function ModalTransaccion({ onClose, cuentaPreseleccionada = null }) {
  const { cuentas, categorias, dispatch } = useFinanzas();

  const [tipo, setTipo] = useState('gasto');
  const [form, setForm] = useState({
    monto: '',
    cuentaId: cuentaPreseleccionada || (cuentas[0]?.id || ''),
    cuentaDestinoId: '',
    categoriaId: '',
    descripcion: '',
    fecha: new Date().toISOString().split('T')[0],
    notas: '',
  });
  const [errors, setErrors] = useState({});

  const set = (field, val) => {
    setForm(f => ({ ...f, [field]: val }));
    setErrors(e => ({ ...e, [field]: '' }));
  };

  const categoriasFiltradas = categorias.filter(c => c.tipo === tipo);

  const validar = () => {
    const errs = {};
    if (!form.monto || isNaN(Number(form.monto)) || Number(form.monto) <= 0)
      errs.monto = 'Ingresá un monto válido';
    if (!form.cuentaId) errs.cuentaId = 'Seleccioná una cuenta';
    if (tipo !== 'transferencia' && !form.categoriaId) errs.categoriaId = 'Seleccioná una categoría';
    if (tipo === 'transferencia' && !form.cuentaDestinoId) errs.cuentaDestinoId = 'Seleccioná cuenta destino';
    if (tipo === 'transferencia' && form.cuentaId === form.cuentaDestinoId)
      errs.cuentaDestinoId = 'La cuenta destino debe ser diferente';
    if (!form.descripcion.trim()) errs.descripcion = 'La descripción es obligatoria';
    return errs;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const errs = validar();
    if (Object.keys(errs).length) { setErrors(errs); return; }

    const cuentaOrigen = cuentas.find(c => c.id === form.cuentaId);
    dispatch({
      type: 'AGREGAR_TRANSACCION',
      payload: {
        tipo,
        monto: Number(form.monto),
        cuentaId: form.cuentaId,
        cuentaDestinoId: tipo === 'transferencia' ? form.cuentaDestinoId : null,
        categoriaId: tipo === 'transferencia' ? null : form.categoriaId,
        descripcion: form.descripcion.trim(),
        fecha: new Date(form.fecha + 'T12:00:00').toISOString(),
        notas: form.notas,
        moneda: cuentaOrigen?.moneda || 'ARS',
      },
    });
    onClose();
  };

  const TIPOS = [
    { key: 'gasto',         label: 'Gasto',         icon: ArrowDownCircle,  color: 'var(--accent-red)' },
    { key: 'ingreso',       label: 'Ingreso',        icon: ArrowUpCircle,    color: 'var(--accent-green)' },
    { key: 'transferencia', label: 'Transferencia',  icon: ArrowLeftRight,   color: 'var(--accent-blue)' },
  ];

  const colorActivo = TIPOS.find(t => t.key === tipo)?.color || 'var(--accent-purple)';

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={e => e.stopPropagation()}>
        {/* Handle bar estilo iOS */}
        <div style={{
          width: 40, height: 4, borderRadius: 4,
          background: 'var(--border)',
          margin: '0 auto 1.25rem',
        }} />

        <div className="modal-header" style={{ marginBottom: '1rem' }}>
          <h2 className="modal-title">Nueva Transacción</h2>
          <button className="btn btn-ghost btn-icon" onClick={onClose} style={{ minHeight: 44, minWidth: 44 }}>
            <X size={20} />
          </button>
        </div>

        {/* Selector de tipo — grid 3 cols siempre */}
        <div className="tipo-selector" style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0.5rem', marginBottom: '1.25rem' }}>
          {TIPOS.map(({ key, label, icon: Icon, color }) => (
            <button
              key={key}
              type="button"
              onClick={() => setTipo(key)}
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '0.3rem',
                padding: '0.75rem 0.5rem',
                borderRadius: '12px',
                border: tipo === key ? `2px solid ${color}` : '2px solid var(--border)',
                background: tipo === key ? (color + '18') : 'var(--bg-input)',
                color: tipo === key ? color : 'var(--text-muted)',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                fontFamily: 'inherit',
                fontWeight: 700,
                fontSize: '0.75rem',
                minHeight: 72,
              }}
            >
              <Icon size={22} />
              {label}
            </button>
          ))}
        </div>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '0.875rem' }}>
          {/* Monto — prominente */}
          <div className="input-group">
            <label className="input-label">Monto</label>
            <div style={{ position: 'relative' }}>
              <span style={{
                position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)',
                color: colorActivo, fontWeight: 800, fontSize: '1.1rem',
              }}>$</span>
              <input
                className={`input ${errors.monto ? 'input-error' : ''}`}
                type="number"
                inputMode="decimal"
                step="0.01"
                value={form.monto}
                onChange={e => set('monto', e.target.value)}
                placeholder="0.00"
                style={{ fontSize: '1.4rem', fontWeight: 800, paddingLeft: '1.75rem', height: '3.25rem', color: colorActivo }}
                autoFocus
              />
            </div>
            {errors.monto && <span className="input-error-msg">{errors.monto}</span>}
          </div>

          {/* Descripción */}
          <div className="input-group">
            <label className="input-label">¿Qué fue?</label>
            <input
              className={`input ${errors.descripcion ? 'input-error' : ''}`}
              value={form.descripcion}
              onChange={e => set('descripcion', e.target.value)}
              placeholder={tipo === 'ingreso' ? 'Ej: Sueldo, Freelance...' : tipo === 'transferencia' ? 'Ej: Retiro efectivo...' : 'Ej: Supermercado, Taxi...'}
              style={{ fontSize: '1rem' }}
            />
            {errors.descripcion && <span className="input-error-msg">{errors.descripcion}</span>}
          </div>

          {/* Cuenta origen */}
          <div className="input-group">
            <label className="input-label">{tipo === 'transferencia' ? 'Cuenta Origen' : 'Cuenta'}</label>
            <select
              className={`input ${errors.cuentaId ? 'input-error' : ''}`}
              value={form.cuentaId}
              onChange={e => set('cuentaId', e.target.value)}
            >
              <option value="">Seleccionar cuenta...</option>
              {cuentas.map(c => (
                <option key={c.id} value={c.id}>{c.nombre} ({c.moneda})</option>
              ))}
            </select>
            {errors.cuentaId && <span className="input-error-msg">{errors.cuentaId}</span>}
          </div>

          {/* Categoría o cuenta destino */}
          {tipo === 'transferencia' ? (
            <div className="input-group">
              <label className="input-label">Cuenta Destino</label>
              <select
                className={`input ${errors.cuentaDestinoId ? 'input-error' : ''}`}
                value={form.cuentaDestinoId}
                onChange={e => set('cuentaDestinoId', e.target.value)}
              >
                <option value="">Seleccionar cuenta...</option>
                {cuentas.filter(c => c.id !== form.cuentaId).map(c => (
                  <option key={c.id} value={c.id}>{c.nombre} ({c.moneda})</option>
                ))}
              </select>
              {errors.cuentaDestinoId && <span className="input-error-msg">{errors.cuentaDestinoId}</span>}
            </div>
          ) : (
            <div className="input-group">
              <label className="input-label">Categoría</label>
              <select
                className={`input ${errors.categoriaId ? 'input-error' : ''}`}
                value={form.categoriaId}
                onChange={e => set('categoriaId', e.target.value)}
              >
                <option value="">Seleccionar categoría...</option>
                {categoriasFiltradas.map(c => (
                  <option key={c.id} value={c.id}>{c.nombre}</option>
                ))}
              </select>
              {errors.categoriaId && <span className="input-error-msg">{errors.categoriaId}</span>}
            </div>
          )}

          {/* Fecha */}
          <div className="input-group">
            <label className="input-label">Fecha</label>
            <input
              className="input"
              type="date"
              value={form.fecha}
              onChange={e => set('fecha', e.target.value)}
            />
          </div>

          {/* Notas */}
          <div className="input-group">
            <label className="input-label">Notas (opcional)</label>
            <input
              className="input"
              value={form.notas}
              onChange={e => set('notas', e.target.value)}
              placeholder="Nota adicional..."
            />
          </div>

          {/* Botón submit grande */}
          <button
            type="submit"
            style={{
              marginTop: '0.25rem',
              padding: '1rem',
              borderRadius: '14px',
              fontSize: '1rem',
              fontWeight: 800,
              border: 'none',
              cursor: 'pointer',
              color: 'white',
              background: tipo === 'ingreso'
                ? 'linear-gradient(135deg, var(--accent-green), var(--accent-green-light))'
                : tipo === 'transferencia'
                  ? 'linear-gradient(135deg, var(--accent-blue), #6c5ce7)'
                  : 'linear-gradient(135deg, var(--accent-red), var(--accent-orange))',
              boxShadow: '0 4px 16px rgba(0,0,0,0.2)',
              transition: 'transform 0.15s ease',
              fontFamily: 'inherit',
              letterSpacing: '-0.3px',
            }}
            onMouseDown={e => e.currentTarget.style.transform = 'scale(0.98)'}
            onMouseUp={e => e.currentTarget.style.transform = 'scale(1)'}
          >
            Registrar {tipo === 'ingreso' ? 'Ingreso ✅' : tipo === 'transferencia' ? 'Transferencia 🔄' : 'Gasto ❌'}
          </button>
        </form>
      </div>
    </div>
  );
}
