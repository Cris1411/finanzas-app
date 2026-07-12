# Finanzas App

Aplicación web de gestión financiera personal desarrollada con React y Vite para llevar el control de ingresos, gastos, cuentas y presupuestos de forma simple e intuitiva.

Esta app permite organizar tus finanzas en un solo lugar, visualizar el estado de tus cuentas y analizar tus movimientos con gráficos y resúmenes claros.

## Descripción general

Finanzas App es una aplicación de tipo SPA (Single Page Application) orientada a personas que quieren tener una visión rápida y práctica de su economía personal. Permite:

- Registrar y administrar cuentas bancarias, efectivo, tarjetas y otras formas de ahorro.
- Crear ingresos, gastos y transferencias entre cuentas.
- Visualizar un dashboard con saldo total, ingresos del mes, gastos del mes y balance.
- Consultar estadísticas con gráficos de evolución mensual y distribución por categoría.
- Personalizar categorías, monedas, tema visual y configuración general.
- Exportar e importar datos en formato JSON y CSV para respaldos y migraciones.
- Guardar la información localmente en el navegador mediante almacenamiento local.

## Funcionalidades principales

### 1. Dashboard

- Vista general del estado financiero del mes actual.
- Resumen de saldo total por moneda.
- Gráficos de ingresos vs gastos de los últimos meses.
- Acceso rápido a cuentas recientes y últimas transacciones.

### 2. Gestión de cuentas

- Crear, editar o eliminar cuentas.
- Soporte para múltiples monedas como ARS, USD, EUR y otras.
- Visualización del saldo de cada cuenta.
- Organización por tipo de cuenta: bancaria, efectivo, débito, crédito o inversión.

### 3. Registro de transacciones

- Registrar ingresos, gastos y transferencias.
- Filtrar movimientos por tipo, cuenta, categoría y mes.
- Eliminar transacciones cuando ya no sean necesarias.
- Exportar los movimientos en CSV para análisis o uso en Excel.

### 4. Estadísticas y análisis

- Evolución de ingresos, gastos y balance en distintos periodos.
- Gráficos interactivos con Recharts.
- Distribución de gastos e ingresos por categoría.

### 5. Configuración y respaldo

- Cambiar entre modo claro y oscuro.
- Elegir la moneda principal de la aplicación.
- Administrar categorías personalizadas.
- Realizar backups completos en JSON.
- Importar datos previamente exportados.
- Reiniciar los datos a los ejemplos incluidos.

## Tecnologías utilizadas

- React 19
- Vite
- Recharts
- Lucide React
- UUID
- vite-plugin-pwa
- CSS personalizado para la interfaz

## Estructura del proyecto

- src/components: componentes reutilizables de la interfaz.
- src/context: contexto global de finanzas y lógica de estado.
- src/data: datos de ejemplo, categorías, monedas y cuentas iniciales.
- src/pages: vistas principales de la aplicación (Dashboard, Cuentas, Transacciones, Estadísticas y Configuración).
- public: recursos estáticos y archivos públicos.

## Instalación

Clona el repositorio y ejecuta:

```bash
npm install
```

## Ejecución local

Inicia la aplicación en modo desarrollo:

```bash
npm run dev
```

Luego abre la URL que te proporcione Vite en el navegador.

## Scripts disponibles

```bash
npm run dev
npm run build
npm run preview
npm run lint
```

## Uso recomendado

1. Abrir la app y revisar el dashboard.
2. Crear tus cuentas principales.
3. Registrar los ingresos y gastos del mes.
4. Organizar categorías según tus necesidades.
5. Revisar estadísticas para entender tus hábitos financieros.
6. Guardar respaldos periódicamente.

## Datos de ejemplo

La app incluye datos de ejemplo precargados para mostrar el funcionamiento de la herramienta. Puedes modificarlos, eliminarlos o reiniciarlos desde la sección de configuración.

## Autor

Desarrollado por Cristian R. Sanchez
