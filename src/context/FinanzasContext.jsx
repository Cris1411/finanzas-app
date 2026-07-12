import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { CATEGORIAS_DEFAULT, CUENTAS_EJEMPLO, TRANSACCIONES_EJEMPLO, MONEDAS } from '../data/datosEjemplo';
import { v4 as uuidv4 } from 'uuid';

const FinanzasContext = createContext(null);

const STORAGE_KEY = 'finanzas-app-data';

const estadoInicial = {
  cuentas: CUENTAS_EJEMPLO,
  transacciones: TRANSACCIONES_EJEMPLO,
  categorias: CATEGORIAS_DEFAULT,
  monedaPrincipal: 'ARS',
  tema: 'oscuro',
  monedasActivas: ['ARS', 'USD'],
  configuracion: {
    nombre: 'Mi Billetera',
    monedaBase: 'ARS',
  },
};

function cargarEstado() {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    if (data) {
      const parsed = JSON.parse(data);
      return { ...estadoInicial, ...parsed };
    }
  } catch (e) {
    console.warn('Error al cargar datos locales:', e);
  }
  return estadoInicial;
}

function guardarEstado(estado) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(estado));
  } catch (e) {
    console.warn('Error al guardar datos locales:', e);
  }
}

function reducer(state, action) {
  let nuevo;
  switch (action.type) {
    // CUENTAS
    case 'AGREGAR_CUENTA':
      nuevo = { ...state, cuentas: [...state.cuentas, { ...action.payload, id: uuidv4() }] };
      break;
    case 'EDITAR_CUENTA':
      nuevo = {
        ...state,
        cuentas: state.cuentas.map(c => c.id === action.payload.id ? action.payload : c),
      };
      break;
    case 'ELIMINAR_CUENTA':
      nuevo = {
        ...state,
        cuentas: state.cuentas.filter(c => c.id !== action.payload),
        transacciones: state.transacciones.filter(
          t => t.cuentaId !== action.payload && t.cuentaDestinoId !== action.payload
        ),
      };
      break;

    // TRANSACCIONES
    case 'AGREGAR_TRANSACCION': {
      const tx = { ...action.payload, id: uuidv4() };
      const cuentas = state.cuentas.map(c => {
        if (c.id === tx.cuentaId) {
          const delta = tx.tipo === 'ingreso' ? tx.monto : -tx.monto;
          return { ...c, saldo: c.saldo + delta };
        }
        if (tx.tipo === 'transferencia' && c.id === tx.cuentaDestinoId) {
          return { ...c, saldo: c.saldo + tx.monto };
        }
        return c;
      });
      nuevo = { ...state, cuentas, transacciones: [tx, ...state.transacciones] };
      break;
    }
    case 'EDITAR_TRANSACCION': {
      const vieja = state.transacciones.find(t => t.id === action.payload.id);
      const nueva = action.payload;
      let cuentas = [...state.cuentas];

      // Revertir transacción vieja
      cuentas = cuentas.map(c => {
        if (c.id === vieja.cuentaId) {
          const delta = vieja.tipo === 'ingreso' ? -vieja.monto : vieja.monto;
          return { ...c, saldo: c.saldo + delta };
        }
        if (vieja.tipo === 'transferencia' && c.id === vieja.cuentaDestinoId) {
          return { ...c, saldo: c.saldo - vieja.monto };
        }
        return c;
      });

      // Aplicar nueva
      cuentas = cuentas.map(c => {
        if (c.id === nueva.cuentaId) {
          const delta = nueva.tipo === 'ingreso' ? nueva.monto : -nueva.monto;
          return { ...c, saldo: c.saldo + delta };
        }
        if (nueva.tipo === 'transferencia' && c.id === nueva.cuentaDestinoId) {
          return { ...c, saldo: c.saldo + nueva.monto };
        }
        return c;
      });

      nuevo = {
        ...state,
        cuentas,
        transacciones: state.transacciones.map(t => t.id === nueva.id ? nueva : t),
      };
      break;
    }
    case 'ELIMINAR_TRANSACCION': {
      const tx = state.transacciones.find(t => t.id === action.payload);
      if (!tx) return state;
      const cuentas = state.cuentas.map(c => {
        if (c.id === tx.cuentaId) {
          const delta = tx.tipo === 'ingreso' ? -tx.monto : tx.monto;
          return { ...c, saldo: c.saldo + delta };
        }
        if (tx.tipo === 'transferencia' && c.id === tx.cuentaDestinoId) {
          return { ...c, saldo: c.saldo - tx.monto };
        }
        return c;
      });
      nuevo = {
        ...state,
        cuentas,
        transacciones: state.transacciones.filter(t => t.id !== action.payload),
      };
      break;
    }

    // CATEGORÍAS
    case 'AGREGAR_CATEGORIA':
      nuevo = { ...state, categorias: [...state.categorias, { ...action.payload, id: uuidv4() }] };
      break;
    case 'EDITAR_CATEGORIA':
      nuevo = {
        ...state,
        categorias: state.categorias.map(c => c.id === action.payload.id ? action.payload : c),
      };
      break;
    case 'ELIMINAR_CATEGORIA':
      nuevo = { ...state, categorias: state.categorias.filter(c => c.id !== action.payload) };
      break;

    // CONFIGURACIÓN
    case 'SET_MONEDA_PRINCIPAL':
      nuevo = { ...state, monedaPrincipal: action.payload };
      break;
    case 'SET_TEMA':
      nuevo = { ...state, tema: action.payload };
      break;
    case 'SET_CONFIGURACION':
      nuevo = { ...state, configuracion: { ...state.configuracion, ...action.payload } };
      break;
    case 'TOGGLE_MONEDA_ACTIVA': {
      const existe = state.monedasActivas.includes(action.payload);
      const monedasActivas = existe
        ? state.monedasActivas.filter(m => m !== action.payload)
        : [...state.monedasActivas, action.payload];
      nuevo = { ...state, monedasActivas };
      break;
    }

    // BACKUP
    case 'IMPORTAR_DATOS':
      nuevo = { ...estadoInicial, ...action.payload };
      break;
    case 'RESETEAR_DATOS':
      nuevo = estadoInicial;
      break;

    default:
      return state;
  }
  guardarEstado(nuevo);
  return nuevo;
}

export function FinanzasProvider({ children }) {
  const [state, dispatch] = useReducer(reducer, null, cargarEstado);

  useEffect(() => {
    const root = document.documentElement;
    if (state.tema === 'oscuro') {
      root.setAttribute('data-theme', 'dark');
    } else {
      root.setAttribute('data-theme', 'light');
    }
  }, [state.tema]);

  // Helpers
  const getCuenta = (id) => state.cuentas.find(c => c.id === id);
  const getCategoria = (id) => state.categorias.find(c => c.id === id);

  const formatMonto = (monto, moneda = state.monedaPrincipal) => {
    const m = MONEDAS[moneda] || MONEDAS['ARS'];
    try {
      return new Intl.NumberFormat(m.locale, {
        style: 'currency',
        currency: moneda === 'ARS' ? 'ARS' : moneda,
        minimumFractionDigits: 0,
        maximumFractionDigits: 2,
      }).format(monto);
    } catch {
      return `${m.simbolo} ${monto.toLocaleString()}`;
    }
  };

  const getSaldoTotal = (moneda) => {
    return state.cuentas
      .filter(c => !moneda || c.moneda === moneda)
      .reduce((acc, c) => acc + c.saldo, 0);
  };

  const getResumenMes = (año, mes) => {
    const txs = state.transacciones.filter(t => {
      const d = new Date(t.fecha);
      return d.getFullYear() === año && d.getMonth() === mes;
    });
    const ingresos = txs.filter(t => t.tipo === 'ingreso').reduce((a, t) => a + t.monto, 0);
    const gastos = txs.filter(t => t.tipo === 'gasto').reduce((a, t) => a + t.monto, 0);
    return { ingresos, gastos, balance: ingresos - gastos };
  };

  const exportarJSON = () => {
    const data = JSON.stringify(state, null, 2);
    const blob = new Blob([data], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `finanzas-backup-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const exportarCSV = () => {
    const headers = ['Fecha', 'Tipo', 'Descripción', 'Monto', 'Cuenta', 'Categoría', 'Notas'];
    const rows = state.transacciones.map(t => {
      const cuenta = getCuenta(t.cuentaId);
      const cat = getCategoria(t.categoriaId);
      return [
        new Date(t.fecha).toLocaleDateString('es-AR'),
        t.tipo,
        `"${t.descripcion}"`,
        t.tipo === 'gasto' ? -t.monto : t.monto,
        cuenta?.nombre || '',
        cat?.nombre || 'Transferencia',
        `"${t.notas || ''}"`,
      ].join(',');
    });
    const csv = [headers.join(','), ...rows].join('\n');
    const blob = new Blob(['\uFEFF' + csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `finanzas-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const importarJSON = (jsonText) => {
    try {
      const data = JSON.parse(jsonText);
      dispatch({ type: 'IMPORTAR_DATOS', payload: data });
      return true;
    } catch {
      return false;
    }
  };

  return (
    <FinanzasContext.Provider
      value={{
        ...state,
        dispatch,
        getCuenta,
        getCategoria,
        formatMonto,
        getSaldoTotal,
        getResumenMes,
        exportarJSON,
        exportarCSV,
        importarJSON,
        MONEDAS,
      }}
    >
      {children}
    </FinanzasContext.Provider>
  );
}

export function useFinanzas() {
  const ctx = useContext(FinanzasContext);
  if (!ctx) throw new Error('useFinanzas debe usarse dentro de FinanzasProvider');
  return ctx;
}
