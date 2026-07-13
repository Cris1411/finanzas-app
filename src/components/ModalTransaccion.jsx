import React, { useState } from 'react';
import { useFinanzas } from '../context/FinanzasContext';
import { X, ArrowUpCircle, ArrowDownCircle, ArrowLeftRight } from 'lucide-react';

export default function ModalTransaccion({ onClose, cuentaPreseleccionada = null, transaccion = null }) {
  const { cuentas, categorias, dispatch, monedaPrincipal } = useFinanzas();

  const [tipo, setTipo] = useState(transaccion?.tipo || 'gasto');
  const [form, setForm] = useState({
    monto: transaccion?.monto?.toString() || '',
    cuentaId: transaccion?.cuentaId || cuentaPreseleccionada || (cuentas[0]?.id || ''),
    cuentaDestinoId: transaccion?.cuentaDestinoId || '',
    categoriaId: transaccion?.categoriaId || '',
    descripcion: transaccion?.descripcion || '',
    fecha: transaccion ? new Date(transaccion.fecha).toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
    notas: transaccion?.notas || '',
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

    const payload = {
      id: transaccion?.id,
      tipo,
      monto: Number(form.monto),
      cuentaId: form.cuentaId,
      cuentaDestinoId: tipo === 'transferencia' ? form.cuentaDestinoId : null,
      categoriaId: tipo === 'transferencia' ? null : form.categoriaId,
      descripcion: form.descripcion.trim(),
      fecha: new Date(form.fecha + 'T12:00:00').toISOString(),
      notas: form.notas,
      moneda: cuentaOrigen?.moneda || 'ARS',
    };

    dispatch({
      type: transaccion ? 'EDITAR_TRANSACCION' : 'AGREGAR_TRANSACCION',
      payload,
    });
    onClose();
  };

  const TIPOS = [
    { key: 'gasto', label: 'Gasto', icon: ArrowDownCircle, color: 'var(--accent-red)' },
    { key: 'ingreso', label: 'Ingreso', icon: ArrowUpCircle, color: 'var(--accent-green)' },
    { key: 'transferencia', label: 'Transferencia', icon: ArrowLeftRight, color: 'var(--accent-blue)' },
  ];

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <h2 className="modal-title">{transaccion ? 'Editar Transacción' : 'Nueva Transacción'}</h2>
          <button className="btn btn-ghost btn-icon btn-sm" onClick={onClose}><X size={18} /></button>
        </div>

        {/* Selector de tipo */}
        <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.25rem' }}>
          {TIPOS.map(({ key, label, icon: Icon, color }) => (
            <button
              key={key}
              type="button"
              onClick={() => setTipo(key)}
              className={`btn btn-sm flex-1 ${tipo === key ? '' : 'btn-ghost'}`}
              style={tipo === key ? {
                background: color + '22',
                color,
                border: `1.5px solid ${color}`,
              } : {}}
            >
              <Icon size={15} /> <span style={{ display: 'inline' }}>{label}</span>
            </button>
          ))}
        </div>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem', overflowY: 'auto', maxHeight: 'calc(80vh - 120px)' }}>
          {/* Monto */}
          <div className="input-group">
            <label className="input-label">Monto</label>
            <input
              className={`input ${errors.monto ? 'input-error' : ''}`}
              type="number"
              step="0.01"
              value={form.monto}
              onChange={e => set('monto', e.target.value)}
              placeholder="0.00"
              style={{ fontSize: '1.25rem', fontWeight: 700 }}
              autoFocus
            />
            {errors.monto && <span className="input-error-msg">{errors.monto}</span>}
          </div>

          {/* Descripción */}
          <div className="input-group">
            <label className="input-label">Descripción</label>
            <input
              className={`input ${errors.descripcion ? 'input-error' : ''}`}
              value={form.descripcion}
              onChange={e => set('descripcion', e.target.value)}
              placeholder="¿En qué gastaste / de dónde ingresó?"
            />
            {errors.descripcion && <span className="input-error-msg">{errors.descripcion}</span>}
          </div>

          <div className="grid-2">
            {/* Cuenta origen */}
            <div className="input-group">
              <label className="input-label">{tipo === 'transferencia' ? 'Cuenta Origen' : 'Cuenta'}</label>
              <select
                className={`input ${errors.cuentaId ? 'input-error' : ''}`}
                value={form.cuentaId}
                onChange={e => set('cuentaId', e.target.value)}
              >
                <option value="">Seleccionar...</option>
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
                  <option value="">Seleccionar...</option>
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
                  <option value="">Seleccionar...</option>
                  {categoriasFiltradas.map(c => (
                    <option key={c.id} value={c.id}>{c.nombre}</option>
                  ))}
                </select>
                {errors.categoriaId && <span className="input-error-msg">{errors.categoriaId}</span>}
              </div>
            )}
          </div>

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
              placeholder="Notas adicionales..."
            />
          </div>

          <div className="modal-footer">
            <button type="button" className="btn btn-ghost" onClick={onClose}>Cancelar</button>
            <button
              type="submit"
              className="btn"
              style={{
                background: tipo === 'ingreso'
                  ? 'linear-gradient(135deg, var(--accent-green), var(--accent-green-light))'
                  : tipo === 'transferencia'
                    ? 'linear-gradient(135deg, var(--accent-blue), #6c5ce7)'
                    : 'linear-gradient(135deg, var(--accent-red), var(--accent-orange))',
                color: 'white',
              }}
            >
              {transaccion ? 'Guardar cambios' : `Registrar ${tipo === 'ingreso' ? 'Ingreso' : tipo === 'transferencia' ? 'Transferencia' : 'Gasto'}`} 
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
