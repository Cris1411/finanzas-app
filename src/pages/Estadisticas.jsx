import React, { useMemo, useState } from 'react';
import { useFinanzas } from '../context/FinanzasContext';
import {
  PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend,
  LineChart, Line, XAxis, YAxis, CartesianGrid, AreaChart, Area
} from 'recharts';

const MESES = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'];

export default function Estadisticas() {
  const { transacciones, categorias, formatMonto, getResumenMes } = useFinanzas();
  const [vistaGrafico, setVistaGrafico] = useState('gastos'); // gastos | ingresos
  const [meses, setMeses] = useState(6);

  const ahora = new Date();

  // Últimos N meses de evolución
  const datosEvolucion = useMemo(() => Array.from({ length: meses }, (_, i) => {
    const d = new Date(ahora);
    d.setMonth(d.getMonth() - (meses - 1 - i));
    const { ingresos, gastos, balance } = getResumenMes(d.getFullYear(), d.getMonth());
    return { mes: MESES[d.getMonth()], Ingresos: ingresos, Gastos: gastos, Balance: balance };
  }), [transacciones, meses]);

  // Gastos por categoría (último mes)
  const datosTorta = useMemo(() => {
    const mesActual = new Date(ahora);
    const txMes = transacciones.filter(t => {
      const d = new Date(t.fecha);
      return d.getFullYear() === mesActual.getFullYear() &&
        d.getMonth() === mesActual.getMonth() &&
        t.tipo === vistaGrafico;
    });

    const porCategoria = {};
    txMes.forEach(t => {
      const cat = categorias.find(c => c.id === t.categoriaId);
      const nombre = cat?.nombre || 'Sin categoría';
      const color = cat?.color || '#9898b8';
      porCategoria[nombre] = {
        value: (porCategoria[nombre]?.value || 0) + t.monto,
        color,
      };
    });

    return Object.entries(porCategoria)
      .map(([nombre, { value, color }]) => ({ nombre, value, color }))
      .sort((a, b) => b.value - a.value);
  }, [transacciones, categorias, vistaGrafico]);

  const totalTorta = datosTorta.reduce((s, d) => s + d.value, 0);

  const CustomTooltipLine = ({ active, payload, label }) => {
    if (active && payload?.length) {
      return (
        <div className="card" style={{ padding: '0.75rem 1rem', minWidth: 180 }}>
          <div style={{ fontWeight: 700, marginBottom: '0.5rem' }}>{label}</div>
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

  const CustomTooltipPie = ({ active, payload }) => {
    if (active && payload?.length) {
      const d = payload[0].payload;
      const pct = totalTorta > 0 ? ((d.value / totalTorta) * 100).toFixed(1) : 0;
      return (
        <div className="card" style={{ padding: '0.75rem 1rem' }}>
          <div style={{ fontWeight: 700, color: d.color }}>{d.nombre}</div>
          <div style={{ fontSize: '0.85rem', marginTop: '0.25rem' }}>{formatMonto(d.value, 'ARS')}</div>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{pct}% del total</div>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="page-content">
      <div className="page-header">
        <div>
          <h1 className="page-title">Estadísticas</h1>
          <p className="page-subtitle">Análisis de tus finanzas</p>
        </div>
        <select
          className="input"
          style={{ width: 'auto' }}
          value={meses}
          onChange={e => setMeses(Number(e.target.value))}
        >
          <option value={3}>Últimos 3 meses</option>
          <option value={6}>Últimos 6 meses</option>
          <option value={12}>Últimos 12 meses</option>
        </select>
      </div>

      {/* Gráfico de área - evolución */}
      <div className="card" style={{ marginBottom: '1.5rem' }}>
        <h3 style={{ marginBottom: '1.25rem' }}>Evolución de Finanzas</h3>
        <ResponsiveContainer width="100%" height={260}>
          <AreaChart data={datosEvolucion}>
            <defs>
              <linearGradient id="gradIngresos" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="var(--accent-green)" stopOpacity={0.3} />
                <stop offset="95%" stopColor="var(--accent-green)" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="gradGastos" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="var(--accent-red)" stopOpacity={0.3} />
                <stop offset="95%" stopColor="var(--accent-red)" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
            <XAxis dataKey="mes" tick={{ fill: 'var(--text-muted)', fontSize: 12 }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fill: 'var(--text-muted)', fontSize: 11 }} axisLine={false} tickLine={false}
              tickFormatter={v => v >= 1000 ? `${(v/1000).toFixed(0)}k` : v} />
            <Tooltip content={<CustomTooltipLine />} />
            <Legend wrapperStyle={{ fontSize: '0.8rem' }} />
            <Area type="monotone" dataKey="Ingresos" stroke="var(--accent-green)" strokeWidth={2.5} fill="url(#gradIngresos)" dot={false} />
            <Area type="monotone" dataKey="Gastos" stroke="var(--accent-red)" strokeWidth={2.5} fill="url(#gradGastos)" dot={false} />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* Balance y Torta */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', marginBottom: '1.5rem' }}>

        {/* Balance mensual */}
        <div className="card">
          <h3 style={{ marginBottom: '1.25rem' }}>Balance Mensual</h3>
          <ResponsiveContainer width="100%" height={220}>
            <LineChart data={datosEvolucion}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
              <XAxis dataKey="mes" tick={{ fill: 'var(--text-muted)', fontSize: 11 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: 'var(--text-muted)', fontSize: 10 }} axisLine={false} tickLine={false}
                tickFormatter={v => v >= 1000 ? `${(v/1000).toFixed(0)}k` : v} />
              <Tooltip content={<CustomTooltipLine />} />
              <Line
                type="monotone"
                dataKey="Balance"
                stroke="var(--accent-purple)"
                strokeWidth={3}
                dot={{ fill: 'var(--accent-purple)', strokeWidth: 0, r: 4 }}
                activeDot={{ r: 6 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Torta por categoría */}
        <div className="card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
            <h3>Por Categoría</h3>
            <div style={{ display: 'flex', gap: '0.4rem' }}>
              <button
                className={`btn btn-sm ${vistaGrafico === 'gastos' ? 'btn-danger' : 'btn-ghost'}`}
                onClick={() => setVistaGrafico('gastos')}
              >
                Gastos
              </button>
              <button
                className={`btn btn-sm ${vistaGrafico === 'ingreso' ? 'btn-success' : 'btn-ghost'}`}
                onClick={() => setVistaGrafico('ingreso')}
              >
                Ingresos
              </button>
            </div>
          </div>

          {datosTorta.length === 0 ? (
            <div className="empty-state" style={{ padding: '2rem' }}>
              <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>📊</div>
              <p>Sin datos para este mes</p>
            </div>
          ) : (
            <>
              <ResponsiveContainer width="100%" height={180}>
                <PieChart>
                  <Pie
                    data={datosTorta}
                    dataKey="value"
                    nameKey="nombre"
                    cx="50%"
                    cy="50%"
                    innerRadius={50}
                    outerRadius={80}
                    paddingAngle={2}
                  >
                    {datosTorta.map((entry, i) => (
                      <Cell key={i} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip content={<CustomTooltipPie />} />
                </PieChart>
              </ResponsiveContainer>

              {/* Leyenda */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem', marginTop: '0.5rem' }}>
                {datosTorta.slice(0, 5).map((d, i) => (
                  <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', justifyContent: 'space-between' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                      <div style={{ width: 10, height: 10, borderRadius: '50%', background: d.color, flexShrink: 0 }} />
                      <span className="text-sm">{d.nombre}</span>
                    </div>
                    <span className="text-sm font-semibold">{formatMonto(d.value, 'ARS')}</span>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      </div>

      {/* Top gastos del mes */}
      <div className="card">
        <h3 style={{ marginBottom: '1rem' }}>Top Gastos del Mes</h3>
        {datosTorta.filter(d => d.value > 0).length === 0 ? (
          <div className="empty-state" style={{ padding: '1.5rem' }}>
            <p>Sin gastos registrados este mes</p>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {datosTorta.slice(0, 6).map((d, i) => {
              const pct = totalTorta > 0 ? (d.value / totalTorta) * 100 : 0;
              return (
                <div key={i}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.3rem' }}>
                    <span className="text-sm font-semibold">{d.nombre}</span>
                    <span className="text-sm" style={{ color: d.color, fontWeight: 700 }}>
                      {formatMonto(d.value, 'ARS')} ({pct.toFixed(1)}%)
                    </span>
                  </div>
                  <div className="progress-bar">
                    <div className="progress-fill" style={{ width: `${pct}%`, background: d.color }} />
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
