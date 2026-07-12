import { v4 as uuidv4 } from 'uuid';

export const TIPOS_CUENTA = {
  banco: { label: 'Cuenta Bancaria', icono: 'Building2' },
  efectivo: { label: 'Efectivo', icono: 'Wallet' },
  debito: { label: 'Tarjeta de Débito', icono: 'CreditCard' },
  credito: { label: 'Tarjeta de Crédito', icono: 'CreditCard' },
  inversion: { label: 'Inversión', icono: 'TrendingUp' },
  otro: { label: 'Otro', icono: 'PiggyBank' },
};

export const MONEDAS = {
  ARS: { simbolo: '$', nombre: 'Peso Argentino', locale: 'es-AR' },
  USD: { simbolo: 'U$S', nombre: 'Dólar Estadounidense', locale: 'en-US' },
  EUR: { simbolo: '€', nombre: 'Euro', locale: 'es-ES' },
  BRL: { simbolo: 'R$', nombre: 'Real Brasileño', locale: 'pt-BR' },
  CLP: { simbolo: 'CLP', nombre: 'Peso Chileno', locale: 'es-CL' },
  UYU: { simbolo: '$U', nombre: 'Peso Uruguayo', locale: 'es-UY' },
};

const now = new Date();
const hoy = (offsetDias = 0) => {
  const d = new Date(now);
  d.setDate(d.getDate() - offsetDias);
  return d.toISOString();
};

export const CATEGORIAS_DEFAULT = [
  // Gastos
  { id: 'cat-01', nombre: 'Alimentación', tipo: 'gasto', icono: 'ShoppingCart', color: '#e17055' },
  { id: 'cat-02', nombre: 'Transporte', tipo: 'gasto', icono: 'Car', color: '#74b9ff' },
  { id: 'cat-03', nombre: 'Salud', tipo: 'gasto', icono: 'Heart', color: '#ff7675' },
  { id: 'cat-04', nombre: 'Educación', tipo: 'gasto', icono: 'BookOpen', color: '#a29bfe' },
  { id: 'cat-05', nombre: 'Entretenimiento', tipo: 'gasto', icono: 'Gamepad2', color: '#fd79a8' },
  { id: 'cat-06', nombre: 'Hogar', tipo: 'gasto', icono: 'Home', color: '#55efc4' },
  { id: 'cat-07', nombre: 'Ropa', tipo: 'gasto', icono: 'Shirt', color: '#ffeaa7' },
  { id: 'cat-08', nombre: 'Servicios', tipo: 'gasto', icono: 'Zap', color: '#fdcb6e' },
  { id: 'cat-09', nombre: 'Restaurantes', tipo: 'gasto', icono: 'Utensils', color: '#e84393' },
  { id: 'cat-10', nombre: 'Viajes', tipo: 'gasto', icono: 'Plane', color: '#00cec9' },
  // Ingresos
  { id: 'cat-11', nombre: 'Sueldo', tipo: 'ingreso', icono: 'Briefcase', color: '#00b894' },
  { id: 'cat-12', nombre: 'Freelance', tipo: 'ingreso', icono: 'Laptop', color: '#6c5ce7' },
  { id: 'cat-13', nombre: 'Inversiones', tipo: 'ingreso', icono: 'TrendingUp', color: '#00cec9' },
  { id: 'cat-14', nombre: 'Alquiler', tipo: 'ingreso', icono: 'Key', color: '#fdcb6e' },
  { id: 'cat-15', nombre: 'Otros Ingresos', tipo: 'ingreso', icono: 'Plus', color: '#55efc4' },
];

export const CUENTAS_EJEMPLO = [
  {
    id: 'cuenta-01',
    nombre: 'Cuenta Galicia',
    tipo: 'banco',
    moneda: 'ARS',
    saldo: 285000,
    color: '#6c5ce7',
    descripcion: 'Cuenta sueldo principal',
  },
  {
    id: 'cuenta-02',
    nombre: 'Efectivo en mano',
    tipo: 'efectivo',
    moneda: 'ARS',
    saldo: 45000,
    color: '#00b894',
    descripcion: '',
  },
  {
    id: 'cuenta-03',
    nombre: 'Visa Naranja X',
    tipo: 'credito',
    moneda: 'ARS',
    saldo: -120000,
    color: '#e17055',
    descripcion: 'Tarjeta de crédito',
  },
  {
    id: 'cuenta-04',
    nombre: 'Caja de Ahorro USD',
    tipo: 'banco',
    moneda: 'USD',
    saldo: 1500,
    color: '#00cec9',
    descripcion: 'Ahorros en dólares',
  },
  {
    id: 'cuenta-05',
    nombre: 'Mercado Pago',
    tipo: 'debito',
    moneda: 'ARS',
    saldo: 18500,
    color: '#74b9ff',
    descripcion: 'Billetera virtual',
  },
];

export const TRANSACCIONES_EJEMPLO = [
  // Julio (mes actual)
  { id: uuidv4(), tipo: 'ingreso', monto: 350000, cuentaId: 'cuenta-01', cuentaDestinoId: null, categoriaId: 'cat-11', descripcion: 'Sueldo julio', fecha: hoy(2), notas: '' },
  { id: uuidv4(), tipo: 'gasto', monto: 28500, cuentaId: 'cuenta-01', cuentaDestinoId: null, categoriaId: 'cat-01', descripcion: 'Supermercado Carrefour', fecha: hoy(1), notas: '' },
  { id: uuidv4(), tipo: 'gasto', monto: 15000, cuentaId: 'cuenta-03', cuentaDestinoId: null, categoriaId: 'cat-09', descripcion: 'Cena en restaurante', fecha: hoy(1), notas: 'Cena con amigos' },
  { id: uuidv4(), tipo: 'gasto', monto: 8500, cuentaId: 'cuenta-01', cuentaDestinoId: null, categoriaId: 'cat-02', descripcion: 'SUBE y taxi', fecha: hoy(0), notas: '' },
  { id: uuidv4(), tipo: 'gasto', monto: 45000, cuentaId: 'cuenta-03', cuentaDestinoId: null, categoriaId: 'cat-06', descripcion: 'Expensas julio', fecha: hoy(0), notas: '' },
  { id: uuidv4(), tipo: 'transferencia', monto: 20000, cuentaId: 'cuenta-01', cuentaDestinoId: 'cuenta-02', categoriaId: null, descripcion: 'Retiro efectivo', fecha: hoy(3), notas: '' },
  { id: uuidv4(), tipo: 'gasto', monto: 12000, cuentaId: 'cuenta-05', cuentaDestinoId: null, categoriaId: 'cat-08', descripcion: 'Netflix + Spotify', fecha: hoy(4), notas: 'Servicios streaming' },
  { id: uuidv4(), tipo: 'ingreso', monto: 80000, cuentaId: 'cuenta-01', cuentaDestinoId: null, categoriaId: 'cat-12', descripcion: 'Proyecto freelance', fecha: hoy(5), notas: 'Desarrollo web' },

  // Junio
  { id: uuidv4(), tipo: 'ingreso', monto: 350000, cuentaId: 'cuenta-01', cuentaDestinoId: null, categoriaId: 'cat-11', descripcion: 'Sueldo junio', fecha: hoy(32), notas: '' },
  { id: uuidv4(), tipo: 'gasto', monto: 95000, cuentaId: 'cuenta-03', cuentaDestinoId: null, categoriaId: 'cat-07', descripcion: 'Ropa temporada', fecha: hoy(35), notas: '' },
  { id: uuidv4(), tipo: 'gasto', monto: 31000, cuentaId: 'cuenta-01', cuentaDestinoId: null, categoriaId: 'cat-01', descripcion: 'Almacén y verdulería', fecha: hoy(38), notas: '' },
  { id: uuidv4(), tipo: 'gasto', monto: 22000, cuentaId: 'cuenta-01', cuentaDestinoId: null, categoriaId: 'cat-03', descripcion: 'Médico y farmacia', fecha: hoy(40), notas: '' },
  { id: uuidv4(), tipo: 'gasto', monto: 45000, cuentaId: 'cuenta-03', cuentaDestinoId: null, categoriaId: 'cat-06', descripcion: 'Expensas junio', fecha: hoy(42), notas: '' },
  { id: uuidv4(), tipo: 'ingreso', monto: 150, cuentaId: 'cuenta-04', cuentaDestinoId: null, categoriaId: 'cat-13', descripcion: 'Interés depósito USD', fecha: hoy(45), notas: '' },

  // Mayo
  { id: uuidv4(), tipo: 'ingreso', monto: 350000, cuentaId: 'cuenta-01', cuentaDestinoId: null, categoriaId: 'cat-11', descripcion: 'Sueldo mayo', fecha: hoy(62), notas: '' },
  { id: uuidv4(), tipo: 'gasto', monto: 180000, cuentaId: 'cuenta-03', cuentaDestinoId: null, categoriaId: 'cat-10', descripcion: 'Escapada a Mar del Plata', fecha: hoy(65), notas: 'Fin de semana largo' },
  { id: uuidv4(), tipo: 'gasto', monto: 29500, cuentaId: 'cuenta-01', cuentaDestinoId: null, categoriaId: 'cat-01', descripcion: 'Supermercado', fecha: hoy(68), notas: '' },
  { id: uuidv4(), tipo: 'gasto', monto: 45000, cuentaId: 'cuenta-03', cuentaDestinoId: null, categoriaId: 'cat-06', descripcion: 'Expensas mayo', fecha: hoy(70), notas: '' },
];
