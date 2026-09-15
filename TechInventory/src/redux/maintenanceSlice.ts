import { createSlice, PayloadAction } from '@reduxjs/toolkit';

// Estados posibles de un mantenimiento
export type MaintenanceStatus = 'en_proceso' | 'finalizado';

// Tipo de mantenimiento
export type MaintenanceType = 'preventivo' | 'correctivo';

// Prioridad (mejora opcional, no obligatoria en el alcance)
export type MaintenancePriority = 'baja' | 'media' | 'alta';

// Un repuesto usado en el mantenimiento
export type MaintenancePart = {
  nombre: string;
  cantidad: number;
};

// Estructura de un mantenimiento
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

type MaintenanceState = {
  maintenances: Maintenance[];
};

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

const maintenanceSlice = createSlice({
  name: 'maintenance',
  initialState,
  reducers: {
    // Crea un nuevo mantenimiento con estado en_proceso
    crearMantenimiento: (state, action: PayloadAction<Maintenance>) => {
      state.maintenances.push(action.payload);
    },

    // Finaliza un mantenimiento existente
    finalizarMantenimiento: (
      state,
      action: PayloadAction<{ id: string; descripcion: string; repuestos: MaintenancePart[] }>
    ) => {
      const mant = state.maintenances.find((m) => m.id === action.payload.id);
      if (mant) {
        mant.status = 'finalizado';
        mant.descripcion = action.payload.descripcion;
        mant.repuestos = action.payload.repuestos;
        mant.fechaFinalizacion = new Date().toISOString();
      }
    },
  },
});

export const { crearMantenimiento, finalizarMantenimiento } = maintenanceSlice.actions;
export default maintenanceSlice.reducer;