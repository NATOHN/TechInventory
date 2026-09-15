// 1. Importaciones
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

// 2. Definimos los estados permitidos para un mantenimiento.
export type MaintenanceStatus = 'en_proceso' | 'finalizado';

// 3. Definimos los tipos de mantenimiento disponibles.
export type MaintenanceType = 'preventivo' | 'correctivo';

// 4. Definimos las prioridades disponibles (mejora opcional, no obligatoria en el alcance inicial).
export type MaintenancePriority = 'baja' | 'media' | 'alta';

// 5. Define cada repuesto utilizado dentro de un mantenimiento.
export type MaintenancePart = {
  nombre: string;
  cantidad: number;
};

// 6. Definimos la estructura que tendrá cada mantenimiento
// almacenado dentro de Redux.
export type Maintenance = {
  id: string;
  codigoEquipo: string;       // referencia al equipo (Equipment.codigo)
  tecnico: string;
  tipo: MaintenanceType;
  prioridad?: MaintenancePriority;
  descripcion: string;
  repuestos: MaintenancePart[];
  status: MaintenanceStatus;
  fechaInicio: string;
  fechaFinalizacion?: string;
};

// 7. Definimos la estructura del estado que manejará Redux para el módulo de mantenimiento.
// maintenances será el arreglo que contendrá todos los mantenimientos registrados.
type MaintenanceState = {
  maintenances: Maintenance[];
};

// 8. Creamos el estado inicial del módulo de mantenimiento.
// Incluimos dos mantenimientos de prueba para poder verificar visualmente el modulo.
const initialState: MaintenanceState = {
  maintenances: [
    {
      id: 'MT-0001',
      codigoEquipo: 'EQ-0002',
      tecnico: 'Carlos López',
      tipo: 'correctivo',
      prioridad: 'alta',
      descripcion: 'Revisión de fuente de poder, equipo no enciende.',
      repuestos: [{ nombre: 'Fuente de poder 500W', cantidad: 1 }],
      status: 'en_proceso',
      fechaInicio: new Date().toISOString(),
    },
    {
      id: 'MT-0002',
      codigoEquipo: 'EQ-0001',
      tecnico: 'Josue Meza',
      tipo: 'preventivo',
      prioridad: 'baja',
      descripcion: 'Limpieza interna y cambio de pasta térmica.',
      repuestos: [{ nombre: 'Pasta térmica', cantidad: 1 }],
      status: 'finalizado',
      fechaInicio: new Date(Date.now() - 86400000).toISOString(),
      fechaFinalizacion: new Date().toISOString(),
    },
  ],
};

// 9. Creamos el Slice encargado de manejar
// toda la información relacionada con los mantenimientos.
const maintenanceSlice = createSlice({

  // 10. Nombre interno del Slice dentro de Redux.
  name: 'maintenance',

  // 11. Indicamos cuál será el estado inicial que utilizará este módulo.
  initialState,

  // 12. Aquí agregamos las funciones que modificarán el estado de los mantenimientos.
  reducers: {

    // Crea un nuevo mantenimiento con estado en_proceso.
    crearMantenimiento: (state, action: PayloadAction<Maintenance>) => {
      // 13. action.payload contiene el mantenimiento que fue enviado desde la aplicación.
      state.maintenances.push(action.payload);
    },

    // Finaliza un mantenimiento existente.
    finalizarMantenimiento: (
      state,
      action: PayloadAction<{ id: string; descripcion: string; repuestos: MaintenancePart[] }>
    ) => {
      // 14. Buscamos el mantenimiento utilizando su id único.
      const mant = state.maintenances.find((m) => m.id === action.payload.id);

      // 15. Si encontramos el mantenimiento, actualizamos su estado y datos finales.
      if (mant) {
        mant.status = 'finalizado';
        mant.descripcion = action.payload.descripcion;
        mant.repuestos = action.payload.repuestos;
        mant.fechaFinalizacion = new Date().toISOString();
      }
    },
  },
});

// 16. Exportamos las acciones para poder usarlas con dispatch en cualquier pantalla.
export const { crearMantenimiento, finalizarMantenimiento } = maintenanceSlice.actions;

// 17. Exportamos el reducer para registrarlo en store.ts.
export default maintenanceSlice.reducer;