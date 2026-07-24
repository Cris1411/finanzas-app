import React, { useState } from 'react';
import { useFinanzas } from '../context/FinanzasContext';
import { X } from 'lucide-react';
import { TIPOS_CUENTA, MONEDAS } from '../data/datosEjemplo';

const COLORES = [
  '#6c5ce7', '#00b894', '#e17055', '#74b9ff', '#fd79a8',
  '#fdcb6e', '#00cec9', '#a29bfe', '#ff7675', '#55efc4',
  '#e84393', '#2d3436', '#636e72', '#b2bec3',
];

export default function ModalCuenta({ cuenta = null, onClose }) {
  const { dispatch } = useFinanzas();
  const esEdicion = !!cuenta;

  const [form, setForm] = useState({
    nombre: cuenta?.nombre || '',
    tipo: cuenta?.tipo || 'banco',
    moneda: cuenta?.moneda || 'ARS',
    saldo: cuenta?.saldo !== undefined ? Math.abs(cuenta.saldo) : '',
    saldoNegativo: cuenta?.saldo < 0 || false,
    color: cuenta?.color || COLORES[0],
    descripcion: cuenta?.descripcion || '',
  });
  const [errors, setErrors] = useState({});

  const set = (field, val) => {
    setForm(f => ({ ...f, [field]: val }));
    setErrors(e => ({ ...e, [field]: '' }));
  };

  const validar = () => {
    const errs = {};
    if (!form.nombre.trim()) errs.nombre = 'El nombre es obligatorio';
    if (form.saldo === '' || isNaN(Number(form.saldo))) errs.saldo = 'Ingresá un monto válido';
    return errs;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const errs = validar();
    if (Object.keys(errs).length) { setErrors(errs); return; }

    const saldoFinal = form.saldoNegativo
      ? -Math.abs(Number(form.saldo))
      : Math.abs(Number(form.saldo));

    const payload = {
      ...(cuenta || {}),
      nombre: form.nombre.trim(),
      tipo: form.tipo,
      moneda: form.moneda,
      saldo: saldoFinal,
      color: form.color,
      descripcion: form.descripcion,
    };

    dispatch({ type: esEdicion ? 'EDITAR_CUENTA' : 'AGREGAR_CUENTA', payload });
    onClose();
  };

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
          <h2 className="modal-title">{esEdicion ? 'Editar Cuenta' : 'Nueva Cuenta'}</h2>
          <button
            className="btn btn-ghost btn-icon"
            onClick={onClose}
            style={{ minHeight: 44, minWidth: 44 }}
          >
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '0.875rem' }}>
          {/* Nombre */}
          <div className="input-group">
            <label className="input-label">Nombre de la cuenta</label>
            <input
              className={`input ${errors.nombre ? 'input-error' : ''}`}
              value={form.nombre}
              onChange={e => set('nombre', e.target.value)}
              placeholder="Ej: Galicia, Efectivo, Visa..."
              style={{ fontSize: '1rem' }}
            />
            {errors.nombre && <span className="input-error-msg">{errors.nombre}</span>}
          </div>

          {/* Tipo y Moneda — 2 cols en desktop, 1 en mobile */}
          <div className="grid-2 form-grid">
            <div className="input-group">
              <label className="input-label">Tipo</label>
              <select className="input" value={form.tipo} onChange={e => set('tipo', e.target.value)}>
                {Object.entries(TIPOS_CUENTA).map(([key, val]) => (
                  <option key={key} value={key}>{val.label}</option>
                ))}
              </select>
            </div>
            <div className="input-group">
              <label className="input-label">Moneda</label>
              <select className="input" value={form.moneda} onChange={e => set('moneda', e.target.value)}>
                {Object.entries(MONEDAS).map(([key, val]) => (
                  <option key={key} value={key}>{val.simbolo} — {key}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Saldo */}
          <div className="input-group">
            <label className="input-label">Saldo actual</label>
            <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'flex-start' }}>
              <div style={{ flex: 1 }}>
                <input
                  className={`input ${errors.saldo ? 'input-error' : ''}`}
                  type="number"
                  inputMode="decimal"
                  value={form.saldo}
                  onChange={e => set('saldo', e.target.value)}
                  placeholder="0"
                  style={{ fontSize: '1.1rem', fontWeight: 700 }}
                />
                {errors.saldo && <span className="input-error-msg">{errors.saldo}</span>}
              </div>
              <button
                type="button"
                className={`btn btn-sm ${form.saldoNegativo ? 'btn-danger' : 'btn-ghost'}`}
                onClick={() => set('saldoNegativo', !form.saldoNegativo)}
                style={{ minHeight: 44, flexShrink: 0 }}
                title="Indicar si la cuenta tiene saldo negativo (deuda)"
              >
                {form.saldoNegativo ? '− Deuda' : '+ Positivo'}
              </button>
            </div>
          </div>

          {/* Descripción */}
          <div className="input-group">
            <label className="input-label">Descripción (opcional)</label>
            <input
              className="input"
              value={form.descripcion}
              onChange={e => set('descripcion', e.target.value)}
              placeholder="Ej: Cuenta sueldo, tarjeta de débito..."
            />
          </div>

          {/* Color */}
          <div className="input-group">
            <label className="input-label">Color de la cuenta</label>
            <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
              {COLORES.map(c => (
                <button
                  key={c}
                  type="button"
                  onClick={() => set('color', c)}
                  style={{
                    width: 32, height: 32, borderRadius: '50%',
                    background: c,
                    border: form.color === c ? '3px solid var(--text-primary)' : '3px solid transparent',
                    boxShadow: form.color === c ? `0 0 0 2px ${c}` : 'none',
                    cursor: 'pointer',
                    transform: form.color === c ? 'scale(1.2)' : 'scale(1)',
                    transition: 'all 0.2s ease',
                    flexShrink: 0,
                    minHeight: 32,
                    minWidth: 32,
                  }}
                  aria-label={`Color ${c}`}
                />
              ))}
            </div>
          </div>

          {/* Vista previa */}
          <div style={{
            padding: '0.875rem 1rem',
            borderRadius: '12px',
            background: form.color + '14',
            border: `1px solid ${form.color}40`,
            display: 'flex',
            alignItems: 'center',
            gap: '0.75rem',
          }}>
            <div style={{ width: 10, height: 10, borderRadius: '50%', background: form.color, flexShrink: 0 }} />
            <span style={{ fontWeight: 700, fontSize: '0.9rem', color: 'var(--text-primary)' }}>
              {form.nombre || 'Vista previa'}
            </span>
            <span style={{ marginLeft: 'auto', fontWeight: 800, color: form.saldoNegativo ? 'var(--accent-red)' : 'var(--accent-green)', fontSize: '0.9rem' }}>
              {form.saldoNegativo ? '-' : '+'}{form.saldo || '0'} {form.moneda}
            </span>
          </div>

          {/* Botón submit */}
          <button
            type="submit"
            style={{
              padding: '1rem',
              borderRadius: '14px',
              fontSize: '1rem',
              fontWeight: 800,
              border: 'none',
              cursor: 'pointer',
              color: 'white',
              background: `linear-gradient(135deg, ${form.color}, ${form.color}cc)`,
              boxShadow: `0 4px 20px ${form.color}44`,
              transition: 'transform 0.15s ease',
              fontFamily: 'inherit',
              marginTop: '0.25rem',
            }}
            onMouseDown={e => e.currentTarget.style.transform = 'scale(0.98)'}
            onMouseUp={e => e.currentTarget.style.transform = 'scale(1)'}
          >
            {esEdicion ? '✅ Guardar cambios' : '🏦 Crear cuenta'}
          </button>
        </form>
      </div>
    </div>
  );
}
