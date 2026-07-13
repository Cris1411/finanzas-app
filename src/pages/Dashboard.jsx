import React, { useState } from 'react';
import { useFinanzas } from '../context/FinanzasContext';
import {
  TrendingUp, TrendingDown, Wallet, Plus, ArrowRight,
  DollarSign, Activity
} from 'lucide-react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend
} from 'recharts';
import ItemTransaccion from '../components/ItemTransaccion';
import ModalTransaccion from '../components/ModalTransaccion';
import { MONEDAS } from '../data/datosEjemplo';

const MESES = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'];

export default function Dashboard({ onNavegar }) {
  const { cuentas, transacciones, formatMonto, getSaldoTotal, getResumenMes, monedaPrincipal } = useFinanzas();
  const [modalTx, setModalTx] = useState(false);

  const ahora = new Date();
  const resumenMes = getResumenMes(ahora.getFullYear(), ahora.getMonth());

  // Datos para el gráfico de los últimos 6 meses
  const datosGrafico = Array.from({ length: 6 }, (_, i) => {
    const d = new Date(ahora);
    d.setMonth(d.getMonth() - (5 - i));
    const { ingresos, gastos } = getResumenMes(d.getFullYear(), d.getMonth());
    return {
      mes: MESES[d.getMonth()],
      Ingresos: ingresos,
      Gastos: gastos,
    };
  });

  const ultimasTx = transacciones.slice(0, 6);

  // Saldo total ARS
  const saldoTotalARS = getSaldoTotal('ARS');
  const saldoTotalUSD = getSaldoTotal('USD');

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload?.length) {
      return (
        <div className="card" style={{ padding: '0.75rem 1rem', minWidth: 160 }}>
          <div style={{ fontWeight: 700, marginBottom: '0.5rem', color: 'var(--text-primary)' }}>{label}</div>
          {payload.map(p => (
            <div key={p.name} style={{ color: p.color, fontSize: '0.8rem', fontWeight: 600 }}>
              {p.name}: {formatMonto(p.value, 'ARS')}
            </div>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="page-content">
      {/* Header */}
      <div className="page-header">
        <div>
          <h1 className="page-title">Dashboard</h1>
          <p className="page-subtitle">
            {ahora.toLocaleDateString('es-AR', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}
          </p>
        </div>
        <button className="btn btn-primary" onClick={() => setModalTx(true)}>
          <Plus size={16} /> Nueva Transacción
        </button>
      </div>

      {/* Stats Row */}
      <div className="grid-4 mb-6" style={{ marginBottom: '1.5rem' }}>
        <div className="stat-card purple">
          <div className="stat-label">Saldo Total ARS</div>
          <div className={`stat-value ${saldoTotalARS >= 0 ? 'positive' : 'negative'}`}>
            {formatMonto(saldoTotalARS, 'ARS')}
          </div>
          <div className="stat-change"><Wallet size={12} /> {cuentas.filter(c => c.moneda === 'ARS').length} cuentas</div>
        </div>

        {cuentas.some(c => c.moneda === 'USD') && (
          <div className="stat-card blue">
            <div className="stat-label">Saldo Total USD</div>
            <div className={`stat-value ${saldoTotalUSD >= 0 ? 'positive' : 'negative'}`}>
              {formatMonto(saldoTotalUSD, 'USD')}
            </div>
            <div className="stat-change"><DollarSign size={12} /> {cuentas.filter(c => c.moneda === 'USD').length} cuentas</div>
          </div>
        )}

        <div className="stat-card green">
          <div className="stat-label">Ingresos del Mes</div>
          <div className="stat-value positive">{formatMonto(resumenMes.ingresos, 'ARS')}</div>
          <div className="stat-change"><TrendingUp size={12} /> Este mes</div>
        </div>

        <div className="stat-card red">
          <div className="stat-label">Gastos del Mes</div>
          <div className="stat-value negative">{formatMonto(resumenMes.gastos, 'ARS')}</div>
          <div className="stat-change"><TrendingDown size={12} /> Este mes</div>
        </div>
      </div>

      {/* Gráfico + Cuentas */}
      <div className="dashboard-chart-grid">

        {/* Gráfico */}
        <div className="card">
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem' }}>
            <h3>Ingresos vs Gastos</h3>
            <span className="text-xs text-muted">Últimos 6 meses</span>
          </div>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={datosGrafico} barGap={4} barCategoryGap="30%">
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
              <XAxis dataKey="mes" tick={{ fill: 'var(--text-muted)', fontSize: 12 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: 'var(--text-muted)', fontSize: 11 }} axisLine={false} tickLine={false}
                tickFormatter={v => v >= 1000 ? `${(v/1000).toFixed(0)}k` : v} />
              <Tooltip content={<CustomTooltip />} />
              <Legend wrapperStyle={{ fontSize: '0.8rem', paddingTop: '0.5rem' }} />
              <Bar dataKey="Ingresos" fill="var(--accent-green)" radius={[6, 6, 0, 0]} />
              <Bar dataKey="Gastos" fill="var(--accent-red)" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Balance del mes */}
        <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <h3>Resumen del Mes</h3>

          <div style={{ padding: '1rem', borderRadius: '12px', background: 'rgba(0,184,148,0.08)', border: '1px solid rgba(0,184,148,0.2)' }}>
            <div className="stat-label">Ingresos</div>
            <div className="stat-value positive" style={{ fontSize: '1.3rem', marginTop: '0.25rem' }}>
              +{formatMonto(resumenMes.ingresos, 'ARS')}
            </div>
          </div>

          <div style={{ padding: '1rem', borderRadius: '12px', background: 'rgba(255,118,117,0.08)', border: '1px solid rgba(255,118,117,0.2)' }}>
            <div className="stat-label">Gastos</div>
            <div className="stat-value negative" style={{ fontSize: '1.3rem', marginTop: '0.25rem' }}>
              -{formatMonto(resumenMes.gastos, 'ARS')}
            </div>
          </div>

          <div style={{
            padding: '1rem',
            borderRadius: '12px',
            background: resumenMes.balance >= 0
              ? 'rgba(108,92,231,0.08)' : 'rgba(255,118,117,0.08)',
            border: `1px solid ${resumenMes.balance >= 0 ? 'rgba(108,92,231,0.2)' : 'rgba(255,118,117,0.2)'}`,
          }}>
            <div className="stat-label">Balance</div>
            <div className={`stat-value ${resumenMes.balance >= 0 ? 'positive' : 'negative'}`} style={{ fontSize: '1.3rem', marginTop: '0.25rem' }}>
              {resumenMes.balance >= 0 ? '+' : ''}{formatMonto(resumenMes.balance, 'ARS')}
            </div>
          </div>

          <button className="btn btn-ghost btn-sm" onClick={() => onNavegar('estadisticas')}>
            <Activity size={14} /> Ver estadísticas completas
          </button>
        </div>
      </div>

      {/* Cuentas rápidas */}
      <div className="card" style={{ marginBottom: '1.5rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
          <h3>Mis Cuentas</h3>
          <button className="btn btn-ghost btn-sm" onClick={() => onNavegar('cuentas')}>
            Ver todas <ArrowRight size={14} />
          </button>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '0.75rem' }}>
          {cuentas.slice(0, 5).map(c => {
            const moneda = MONEDAS[c.moneda];
            return (
              <div
                key={c.id}
                onClick={() => onNavegar('cuentas')}
                style={{
                  background: c.color + '12',
                  border: `1px solid ${c.color}33`,
                  borderRadius: '12px',
                  padding: '0.85rem 1rem',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                }}
                onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-2px)'}
                onMouseLeave={e => e.currentTarget.style.transform = 'translateY(0)'}
              >
                <div className="text-xs" style={{ color: c.color, fontWeight: 600, marginBottom: '0.35rem' }}>{c.nombre}</div>
                <div style={{ fontWeight: 800, fontSize: '1.1rem', color: c.saldo < 0 ? 'var(--accent-red)' : 'var(--text-primary)' }}>
                  {formatMonto(c.saldo, c.moneda)}
                </div>
                <div className="text-xs text-muted">{c.moneda}</div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Últimas transacciones */}
      <div className="card">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
          <h3>Últimas Transacciones</h3>
          <button className="btn btn-ghost btn-sm" onClick={() => onNavegar('transacciones')}>
            Ver todas <ArrowRight size={14} />
          </button>
        </div>
        <div className="tx-list">
          {ultimasTx.length === 0 ? (
            <div className="empty-state">
              <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>💸</div>
              <h3>Sin transacciones</h3>
              <p>Registrá tu primer movimiento</p>
            </div>
          ) : (
            ultimasTx.map(tx => <ItemTransaccion key={tx.id} transaccion={tx} />)
          )}
        </div>
      </div>

      {modalTx && <ModalTransaccion onClose={() => setModalTx(false)} />}
    </div>
  );
}
