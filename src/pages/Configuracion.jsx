import React, { useState, useRef } from 'react';
import { useFinanzas } from '../context/FinanzasContext';
import {
  Moon, Sun, Download, Upload, Trash2, Plus, Pencil, X,
  AlertTriangle, Check, RefreshCw, Globe
} from 'lucide-react';
import { MONEDAS } from '../data/datosEjemplo';

const ICONOS_DISPONIBLES = [
  'ShoppingCart', 'Car', 'Heart', 'BookOpen', 'Gamepad2', 'Home',
  'Shirt', 'Zap', 'Utensils', 'Plane', 'Briefcase', 'Laptop',
  'TrendingUp', 'Key', 'Plus', 'Wallet',
];

const COLORES_CAT = [
  '#e17055', '#74b9ff', '#ff7675', '#a29bfe', '#fd79a8',
  '#fdcb6e', '#00cec9', '#55efc4', '#00b894', '#6c5ce7',
  '#e84393', '#2ecc71',
];

export default function Configuracion() {
  const {
    tema, dispatch, categorias, monedaPrincipal,
    exportarJSON, exportarCSV, importarJSON, transacciones, cuentas,
  } = useFinanzas();

  const [tab, setTab] = useState('general');
  const [mensaje, setMensaje] = useState('');
  const [confirmReset, setConfirmReset] = useState(false);
  const [modalCat, setModalCat] = useState(null); // null | 'nueva' | categoria
  const fileRef = useRef();

  const mostrarMensaje = (msg) => {
    setMensaje(msg);
    setTimeout(() => setMensaje(''), 3000);
  };

  const handleImportar = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      const ok = importarJSON(ev.target.result);
      mostrarMensaje(ok ? '✅ Datos importados correctamente' : '❌ Error: archivo inválido');
    };
    reader.readAsText(file);
    e.target.value = '';
  };

  const handleReset = () => {
    if (confirmReset) {
      dispatch({ type: 'RESETEAR_DATOS' });
      setConfirmReset(false);
      mostrarMensaje('✅ Datos reiniciados a los ejemplos');
    } else {
      setConfirmReset(true);
      setTimeout(() => setConfirmReset(false), 4000);
    }
  };

  const TABS = [
    { id: 'general', label: 'General' },
    { id: 'categorias', label: 'Categorías' },
    { id: 'datos', label: 'Datos y Backup' },
  ];

  return (
    <div className="page-content">
      <div className="page-header">
        <div>
          <h1 className="page-title">Configuración</h1>
          <p className="page-subtitle">Personalizá tu experiencia</p>
        </div>
      </div>

      {mensaje && (
        <div style={{
          background: 'var(--bg-card)',
          border: '1px solid var(--border)',
          borderRadius: '10px',
          padding: '0.75rem 1rem',
          marginBottom: '1rem',
          color: 'var(--text-primary)',
          fontSize: '0.875rem',
          fontWeight: 600,
          animation: 'slideIn 0.3s ease',
        }}>
          {mensaje}
        </div>
      )}

      {/* Tabs */}
      <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.5rem', flexWrap: 'wrap' }}>
        {TABS.map(t => (
          <button
            key={t.id}
            className={`btn ${tab === t.id ? 'btn-primary' : 'btn-ghost'} btn-sm`}
            onClick={() => setTab(t.id)}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* GENERAL */}
      {tab === 'general' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {/* Tema */}
          <div className="card">
            <h3 style={{ marginBottom: '1rem' }}>Apariencia</h3>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div>
                <div style={{ fontWeight: 600 }}>Tema {tema === 'oscuro' ? 'Oscuro' : 'Claro'}</div>
                <div className="text-sm text-muted">Cambiá entre el modo oscuro y claro</div>
              </div>
              <button
                className={`btn ${tema === 'oscuro' ? 'btn-ghost' : 'btn-primary'}`}
                onClick={() => dispatch({ type: 'SET_TEMA', payload: tema === 'oscuro' ? 'claro' : 'oscuro' })}
              >
                {tema === 'oscuro' ? <><Sun size={16} /> Modo Claro</> : <><Moon size={16} /> Modo Oscuro</>}
              </button>
            </div>
          </div>

          {/* Moneda principal */}
          <div className="card">
            <h3 style={{ marginBottom: '1rem' }}>Moneda Principal</h3>
            <p className="text-sm text-muted" style={{ marginBottom: '1rem' }}>
              La moneda que se usará por defecto en el dashboard y estadísticas
            </p>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: '0.75rem' }}>
              {Object.entries(MONEDAS).map(([key, val]) => (
                <button
                  key={key}
                  onClick={() => dispatch({ type: 'SET_MONEDA_PRINCIPAL', payload: key })}
                  className={`btn ${monedaPrincipal === key ? 'btn-primary' : 'btn-ghost'}`}
                  style={{ justifyContent: 'flex-start', gap: '0.5rem' }}
                >
                  <Globe size={14} />
                  <span style={{ fontWeight: 700 }}>{key}</span>
                  <span style={{ fontSize: '0.8rem', opacity: 0.7 }}>{val.simbolo}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Resumen */}
          <div className="card">
            <h3 style={{ marginBottom: '0.75rem' }}>Resumen de uso</h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0.75rem' }}>
              {[
                { label: 'Cuentas', value: cuentas.length },
                { label: 'Transacciones', value: transacciones.length },
                { label: 'Categorías', value: categorias.length },
              ].map(({ label, value }) => (
                <div key={label} style={{
                  textAlign: 'center', padding: '1rem', background: 'var(--bg-secondary)',
                  borderRadius: '10px',
                }}>
                  <div style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--accent-purple)' }}>{value}</div>
                  <div className="text-sm text-muted">{label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* CATEGORÍAS */}
      {tab === 'categorias' && (
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
            <h3>Categorías ({categorias.length})</h3>
            <button className="btn btn-primary btn-sm" onClick={() => setModalCat('nueva')}>
              <Plus size={14} /> Nueva
            </button>
          </div>

          {['gasto', 'ingreso'].map(tipo => (
            <div key={tipo} style={{ marginBottom: '1.5rem' }}>
              <div className="text-sm text-muted font-semibold" style={{ marginBottom: '0.5rem', textTransform: 'uppercase', letterSpacing: '1px' }}>
                {tipo === 'gasto' ? '📤 Gastos' : '📥 Ingresos'}
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                {categorias.filter(c => c.tipo === tipo).map(cat => (
                  <div key={cat.id} className="card" style={{ padding: '0.75rem 1rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                      <div style={{ width: 12, height: 12, borderRadius: '50%', background: cat.color }} />
                      <span style={{ fontWeight: 600 }}>{cat.nombre}</span>
                    </div>
                    <button
                      className="btn btn-ghost btn-icon btn-sm"
                      onClick={() => dispatch({ type: 'ELIMINAR_CATEGORIA', payload: cat.id })}
                      style={{ color: 'var(--accent-red)' }}
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          ))}

          {modalCat === 'nueva' && <ModalNuevaCat onClose={() => setModalCat(null)} />}
        </div>
      )}

      {/* DATOS */}
      {tab === 'datos' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div className="card">
            <h3 style={{ marginBottom: '0.5rem' }}>Exportar datos</h3>
            <p className="text-sm text-muted" style={{ marginBottom: '1rem' }}>
              Guardá una copia de seguridad de todos tus datos
            </p>
            <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
              <button className="btn btn-primary" onClick={() => { exportarJSON(); mostrarMensaje('✅ Backup JSON descargado'); }}>
                <Download size={16} /> Exportar JSON (Backup completo)
              </button>
              <button className="btn btn-ghost" onClick={() => { exportarCSV(); mostrarMensaje('✅ CSV descargado'); }}>
                <Download size={16} /> Exportar CSV (para Excel)
              </button>
            </div>
          </div>

          <div className="card">
            <h3 style={{ marginBottom: '0.5rem' }}>Importar datos</h3>
            <p className="text-sm text-muted" style={{ marginBottom: '1rem' }}>
              Restaurá desde un backup JSON previamente exportado. ⚠️ Esto reemplaza todos los datos actuales.
            </p>
            <input
              type="file"
              accept=".json"
              ref={fileRef}
              onChange={handleImportar}
              style={{ display: 'none' }}
            />
            <button className="btn btn-ghost" onClick={() => fileRef.current?.click()}>
              <Upload size={16} /> Importar desde JSON
            </button>
          </div>

          <div className="card" style={{ borderColor: 'rgba(255,118,117,0.3)' }}>
            <h3 style={{ marginBottom: '0.5rem', color: 'var(--accent-red)' }}>
              <AlertTriangle size={18} style={{ display: 'inline', marginRight: '0.4rem' }} />
              Zona de peligro
            </h3>
            <p className="text-sm text-muted" style={{ marginBottom: '1rem' }}>
              Reiniciar a los datos de ejemplo. Esta acción no se puede deshacer.
            </p>
            <button
              className="btn btn-danger"
              onClick={handleReset}
            >
              <RefreshCw size={16} />
              {confirmReset ? '⚠️ ¿Confirmar reset?' : 'Reiniciar datos de ejemplo'}
            </button>
          </div>
        </div>
      )}

      <div style={{
        marginTop: '2rem',
        padding: '1rem 1.25rem',
        border: '1px solid var(--border)',
        borderRadius: '14px',
        background: 'linear-gradient(135deg, rgba(108,92,231,0.08), rgba(0,184,148,0.08))',
        textAlign: 'center',
        color: 'var(--text-muted)',
        boxShadow: '0 8px 24px rgba(0, 0, 0, 0.05)',
      }}>
        <div style={{
          width: '42px',
          height: '42px',
          borderRadius: '50%',
          margin: '0 auto 0.7rem',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: 'linear-gradient(135deg, var(--accent-purple), var(--accent-green))',
          color: 'white',
          fontWeight: 800,
          fontSize: '0.95rem',
        }}>
          CRS
        </div>
        <div style={{ fontWeight: 800, color: 'var(--text-primary)', marginBottom: '0.3rem', fontSize: '1rem' }}>
          Cristian R. Sanchez
        </div>
        <div style={{ fontSize: '0.92rem', lineHeight: 1.5 }}>
          Desarrollador de Finanzas App · Hecho con dedicación para ayudarte a organizar tus finanzas
        </div>
        <div style={{ marginTop: '0.5rem', fontSize: '0.8rem', opacity: 0.8 }}>
          Versión 1.0 · Gestión financiera personal
        </div>
      </div>
    </div>
  );
}

function ModalNuevaCat({ onClose }) {
  const { dispatch } = useFinanzas();
  const [form, setForm] = useState({ nombre: '', tipo: 'gasto', color: COLORES_CAT[0], icono: ICONOS_DISPONIBLES[0] });

  const handleSave = () => {
    if (!form.nombre.trim()) return;
    dispatch({ type: 'AGREGAR_CATEGORIA', payload: form });
    onClose();
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <h2 className="modal-title">Nueva Categoría</h2>
          <button className="btn btn-ghost btn-icon btn-sm" onClick={onClose}><X size={18} /></button>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div className="input-group">
            <label className="input-label">Nombre</label>
            <input className="input" value={form.nombre} onChange={e => setForm(f => ({ ...f, nombre: e.target.value }))} placeholder="Nombre de la categoría" />
          </div>
          <div className="input-group">
            <label className="input-label">Tipo</label>
            <select className="input" value={form.tipo} onChange={e => setForm(f => ({ ...f, tipo: e.target.value }))}>
              <option value="gasto">Gasto</option>
              <option value="ingreso">Ingreso</option>
            </select>
          </div>
          <div className="input-group">
            <label className="input-label">Color</label>
            <div className="color-picker-grid">
              {COLORES_CAT.map(c => (
                <div key={c} className={`color-dot ${form.color === c ? 'selected' : ''}`} style={{ background: c }} onClick={() => setForm(f => ({ ...f, color: c }))} />
              ))}
            </div>
          </div>
        </div>
        <div className="modal-footer">
          <button className="btn btn-ghost" onClick={onClose}>Cancelar</button>
          <button className="btn btn-primary" onClick={handleSave}>Crear categoría</button>
        </div>
      </div>
    </div>
  );
}
