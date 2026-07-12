import React from 'react';
import { useFinanzas } from '../context/FinanzasContext';
import {
  ShoppingCart, Car, Heart, BookOpen, Gamepad2, Home, Shirt,
  Zap, Utensils, Plane, Briefcase, Laptop, TrendingUp, Key, Plus,
  ArrowLeftRight, ArrowUpCircle, ArrowDownCircle, Wallet, HelpCircle,
} from 'lucide-react';

const ICONOS = {
  ShoppingCart, Car, Heart, BookOpen, Gamepad2, Home, Shirt,
  Zap, Utensils, Plane, Briefcase, Laptop, TrendingUp, Key, Plus,
  ArrowLeftRight, Wallet, HelpCircle,
};

function formatFecha(fechaISO) {
  const d = new Date(fechaISO);
  return d.toLocaleDateString('es-AR', { day: '2-digit', month: 'short', year: 'numeric' });
}

export default function ItemTransaccion({ transaccion, mostrarCuenta = true }) {
  const { getCuenta, getCategoria, formatMonto } = useFinanzas();

  const cuenta = getCuenta(transaccion.cuentaId);
  const cuentaDest = transaccion.cuentaDestinoId ? getCuenta(transaccion.cuentaDestinoId) : null;
  const categoria = transaccion.categoriaId ? getCategoria(transaccion.categoriaId) : null;

  let Icono, iconBg, iconColor, signo;

  if (transaccion.tipo === 'transferencia') {
    Icono = ArrowLeftRight;
    iconBg = 'rgba(116, 185, 255, 0.15)';
    iconColor = 'var(--accent-blue)';
    signo = '';
  } else if (transaccion.tipo === 'ingreso') {
    Icono = categoria ? (ICONOS[categoria.icono] || ArrowUpCircle) : ArrowUpCircle;
    iconBg = categoria ? (categoria.color + '22') : 'rgba(0,184,148,0.15)';
    iconColor = categoria?.color || 'var(--accent-green)';
    signo = '+';
  } else {
    Icono = categoria ? (ICONOS[categoria.icono] || ArrowDownCircle) : ArrowDownCircle;
    iconBg = categoria ? (categoria.color + '22') : 'rgba(255,118,117,0.15)';
    iconColor = categoria?.color || 'var(--accent-red)';
    signo = '-';
  }

  const monedaCuenta = cuenta?.moneda || 'ARS';

  return (
    <div className="tx-item animate-in">
      <div className="tx-icon" style={{ background: iconBg, color: iconColor }}>
        <Icono size={18} />
      </div>

      <div className="tx-info">
        <div className="tx-desc">{transaccion.descripcion}</div>
        <div className="tx-meta">
          <span>{formatFecha(transaccion.fecha)}</span>
          {categoria && <><span>•</span><span>{categoria.nombre}</span></>}
          {transaccion.tipo === 'transferencia' && cuentaDest && (
            <><span>•</span><span>{cuenta?.nombre} → {cuentaDest.nombre}</span></>
          )}
          {mostrarCuenta && transaccion.tipo !== 'transferencia' && cuenta && (
            <><span>•</span><span>{cuenta.nombre}</span></>
          )}
        </div>
      </div>

      <div>
        <div className={`tx-amount ${transaccion.tipo}`}>
          {signo}{formatMonto(transaccion.monto, monedaCuenta)}
        </div>
        {transaccion.notas && (
          <div className="tx-cuenta" title={transaccion.notas}>📝 {transaccion.notas.slice(0, 20)}{transaccion.notas.length > 20 ? '...' : ''}</div>
        )}
      </div>
    </div>
  );
}
