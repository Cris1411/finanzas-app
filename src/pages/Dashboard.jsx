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
  const { cuentas, transacciones, formatMonto, getSaldoTotal, getResumenMes } = useFinanzas();
  const [modalTx, setModalTx] = useState(false);

  const ahora = new Date();
  const resumenMes = getResumenMes(ahora.getFullYear(), ahora.getMonth());

  const datosGrafico = Array.from({ length: 6 }, (_, i) => {
    const d = new Date(ahora);
    d.setMonth(d.getMonth() - (5 - i));
    const { ingresos, gastos } = getResumenMes(d.getFullYear(), d.getMonth());
    return { mes: MESES[d.getMonth()], Ingresos: ingresos, Gastos: gastos };
  });

  const ultimasTx = transacciones.slice(0, 6);
  const saldoTotalARS = getSaldoTotal('ARS');
  const saldoTotalUSD = getSaldoTotal('USD');

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload?.length) {
      return (
        <div className="card" style={{ padding: '0.75rem 1rem', minWidth: 150 }}>
          <div style={{ fontWeight: 700, marginBottom: '0.4rem', fontSize: '0.825rem' }}>{label}</div>
          {payload.map(p => (
            <div key={p.name} style={{ color: p.color, fontSize: '0.775rem', fontWeight: 600 }}>
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
            {ahora.toLocaleDateString('es-AR', { weekday: 'long', day: 'numeric', month: 'long' })}
          </p>
        </div>
        <button className="btn btn-primary" onClick={() => setModalTx(true)}>
          <Plus size={17} /> Nueva Transacción
        </button>
      </div>

      {/* Stats Row — siempre 2 columnas en mobile */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(2, 1fr)',
        gap: '0.75rem',
        marginBottom: '1.25rem',
      }}>
        <div className="stat-card purple">
          <div className="stat-label">Saldo ARS</div>
          <div className={`stat-value ${saldoTotalARS >= 0 ? 'positive' : 'negative'}`}>
            {formatMonto(saldoTotalARS, 'ARS')}
          </div>
          <div className="stat-change"><Wallet size={11} /> {cuentas.filter(c => c.moneda === 'ARS').length} cuentas</div>
        </div>

        {cuentas.some(c => c.moneda === 'USD') ? (
          <div className="stat-card blue">
            <div className="stat-label">Saldo USD</div>
            <div className={`stat-value ${saldoTotalUSD >= 0 ? 'positive' : 'negative'}`}>
              {formatMonto(saldoTotalUSD, 'USD')}
            </div>
            <div className="stat-change"><DollarSign size={11} /> {cuentas.filter(c => c.moneda === 'USD').length} ctas</div>
          </div>
        ) : (
          <div className="stat-card blue">
            <div className="stat-label">Balance Mes</div>
            <div className={`stat-value ${resumenMes.balance >= 0 ? 'positive' : 'negative'}`}>
              {formatMonto(resumenMes.balance, 'ARS')}
            </div>
            <div className="stat-change">Este mes</div>
          </div>
        )}

        <div className="stat-card green">
          <div className="stat-label">Ingresos Mes</div>
          <div className="stat-value positive">{formatMonto(resumenMes.ingresos, 'ARS')}</div>
          <div className="stat-change"><TrendingUp size={11} /> Este mes</div>
        </div>

        <div className="stat-card red">
          <div className="stat-label">Gastos Mes</div>
          <div className="stat-value negative">{formatMonto(resumenMes.gastos, 'ARS')}</div>
          <div className="stat-change"><TrendingDown size={11} /> Este mes</div>
        </div>
      </div>

      {/* Gráfico */}
      <div className="card" style={{ marginBottom: '1.25rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
          <h3 style={{ fontSize: '1rem' }}>Ingresos vs Gastos</h3>
          <span className="text-xs text-muted">6 meses</span>
        </div>
        <ResponsiveContainer width="100%" height={200}>
          <BarChart data={datosGrafico} barGap={3} barCategoryGap="28%">
            <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
            <XAxis dataKey="mes" tick={{ fill: 'var(--text-muted)', fontSize: 11 }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fill: 'var(--text-muted)', fontSize: 10 }} axisLine={false} tickLine={false}
              tickFormatter={v => v >= 1000 ? `${(v / 1000).toFixed(0)}k` : v} width={36} />
            <Tooltip content={<CustomTooltip />} />
            <Legend wrapperStyle={{ fontSize: '0.775rem', paddingTop: '0.5rem' }} />
            <Bar dataKey="Ingresos" fill="var(--accent-green)" radius={[5, 5, 0, 0]} />
            <Bar dataKey="Gastos" fill="var(--accent-red)" radius={[5, 5, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Resumen mes — horizontal en mobile */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(3, 1fr)',
        gap: '0.625rem',
        marginBottom: '1.25rem',
      }}>
        <div style={{ padding: '0.875rem 0.75rem', borderRadius: '12px', background: 'rgba(0,184,148,0.08)', border: '1px solid rgba(0,184,148,0.2)', textAlign: 'center' }}>
          <div className="stat-label">Ingresos</div>
          <div style={{ fontWeight: 800, fontSize: '0.9rem', color: 'var(--accent-green)', marginTop: '0.2rem' }}>
            +{formatMonto(resumenMes.ingresos, 'ARS')}
          </div>
        </div>
        <div style={{ padding: '0.875rem 0.75rem', borderRadius: '12px', background: 'rgba(255,118,117,0.08)', border: '1px solid rgba(255,118,117,0.2)', textAlign: 'center' }}>
          <div className="stat-label">Gastos</div>
          <div style={{ fontWeight: 800, fontSize: '0.9rem', color: 'var(--accent-red)', marginTop: '0.2rem' }}>
            -{formatMonto(resumenMes.gastos, 'ARS')}
          </div>
        </div>
        <div style={{
          padding: '0.875rem 0.75rem', borderRadius: '12px', textAlign: 'center',
          background: resumenMes.balance >= 0 ? 'rgba(108,92,231,0.08)' : 'rgba(255,118,117,0.08)',
          border: `1px solid ${resumenMes.balance >= 0 ? 'rgba(108,92,231,0.2)' : 'rgba(255,118,117,0.2)'}`,
        }}>
          <div className="stat-label">Balance</div>
          <div style={{ fontWeight: 800, fontSize: '0.9rem', color: resumenMes.balance >= 0 ? 'var(--accent-purple)' : 'var(--accent-red)', marginTop: '0.2rem' }}>
            {resumenMes.balance >= 0 ? '+' : ''}{formatMonto(resumenMes.balance, 'ARS')}
          </div>
        </div>
      </div>

      {/* Cuentas rápidas */}
      <div className="card" style={{ marginBottom: '1.25rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.875rem' }}>
          <h3 style={{ fontSize: '1rem' }}>Mis Cuentas</h3>
          <button className="btn btn-ghost btn-sm" onClick={() => onNavegar('cuentas')} style={{ minHeight: 'auto', padding: '0.35rem 0.75rem' }}>
            Ver todas <ArrowRight size={13} />
          </button>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(140px, 1fr))', gap: '0.625rem' }}>
          {cuentas.slice(0, 6).map(c => (
            <div
              key={c.id}
              onClick={() => onNavegar('cuentas')}
              style={{
                background: c.color + '15',
                border: `1px solid ${c.color}35`,
                borderRadius: '10px',
                padding: '0.75rem 0.875rem',
                cursor: 'pointer',
                transition: 'transform 0.2s ease',
              }}
              onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-2px)'}
              onMouseLeave={e => e.currentTarget.style.transform = 'translateY(0)'}
            >
              <div style={{ fontSize: '0.7rem', color: c.color, fontWeight: 700, marginBottom: '0.25rem', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                {c.nombre}
              </div>
              <div style={{ fontWeight: 800, fontSize: '0.95rem', color: c.saldo < 0 ? 'var(--accent-red)' : 'var(--text-primary)', lineHeight: 1.2 }}>
                {formatMonto(c.saldo, c.moneda)}
              </div>
              <div style={{ fontSize: '0.65rem', color: 'var(--text-muted)', marginTop: '0.15rem' }}>{c.moneda}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Últimas transacciones */}
      <div className="card">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.875rem' }}>
          <h3 style={{ fontSize: '1rem' }}>Últimas Transacciones</h3>
          <button className="btn btn-ghost btn-sm" onClick={() => onNavegar('transacciones')} style={{ minHeight: 'auto', padding: '0.35rem 0.75rem' }}>
            Ver todas <ArrowRight size={13} />
          </button>
        </div>
        <div className="tx-list">
          {ultimasTx.length === 0 ? (
            <div className="empty-state" style={{ padding: '2rem' }}>
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
