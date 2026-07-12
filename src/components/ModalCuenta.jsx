import React, { useState } from 'react';
import { useFinanzas } from '../context/FinanzasContext';
import { X } from 'lucide-react';
import { TIPOS_CUENTA, MONEDAS } from '../data/datosEjemplo';

const COLORES = [
  '#6c5ce7', '#00b894', '#e17055', '#74b9ff', '#fd79a8',
  '#fdcb6e', '#00cec9', '#a29bfe', '#ff7675', '#55efc4',
  '#e84393', '#2d3436', '#636e72', '#b2bec3', '#dfe6e9',
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

    const saldoFinal = form.saldoNegativo ? -Math.abs(Number(form.saldo)) : Math.abs(Number(form.saldo));

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
        <div className="modal-header">
          <h2 className="modal-title">{esEdicion ? 'Editar Cuenta' : 'Nueva Cuenta'}</h2>
          <button className="btn btn-ghost btn-icon btn-sm" onClick={onClose}><X size={18} /></button>
        </div>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div className="input-group">
            <label className="input-label">Nombre de la cuenta</label>
            <input
              className={`input ${errors.nombre ? 'input-error' : ''}`}
              value={form.nombre}
              onChange={e => set('nombre', e.target.value)}
              placeholder="Ej: Cuenta Galicia, Efectivo..."
            />
            {errors.nombre && <span className="input-error-msg">{errors.nombre}</span>}
          </div>

          <div className="grid-2">
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
                  <option key={key} value={key}>{val.simbolo} — {val.nombre}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="input-group">
            <label className="input-label">Saldo actual</label>
            <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
              <input
                className={`input ${errors.saldo ? 'input-error' : ''}`}
                type="number"
                value={form.saldo}
                onChange={e => set('saldo', e.target.value)}
                placeholder="0"
                style={{ flex: 1 }}
              />
              <button
                type="button"
                className={`btn btn-sm ${form.saldoNegativo ? 'btn-danger' : 'btn-ghost'}`}
                onClick={() => set('saldoNegativo', !form.saldoNegativo)}
                title="Saldo negativo (deuda)"
              >
                {form.saldoNegativo ? '−Deuda' : '+Positivo'}
              </button>
            </div>
            {errors.saldo && <span className="input-error-msg">{errors.saldo}</span>}
          </div>

          <div className="input-group">
            <label className="input-label">Descripción (opcional)</label>
            <input
              className="input"
              value={form.descripcion}
              onChange={e => set('descripcion', e.target.value)}
              placeholder="Ej: Cuenta sueldo principal"
            />
          </div>

          <div className="input-group">
            <label className="input-label">Color</label>
            <div className="color-picker-grid">
              {COLORES.map(c => (
                <div
                  key={c}
                  className={`color-dot ${form.color === c ? 'selected' : ''}`}
                  style={{ background: c }}
                  onClick={() => set('color', c)}
                />
              ))}
            </div>
          </div>

          <div className="modal-footer">
            <button type="button" className="btn btn-ghost" onClick={onClose}>Cancelar</button>
            <button type="submit" className="btn btn-primary">
              {esEdicion ? 'Guardar cambios' : 'Crear cuenta'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
