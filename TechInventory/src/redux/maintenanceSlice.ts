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

// 6. Define cada elemento de la lista de verificacion del mantenimiento.
export type ChecklistItem = {
  label: string;
  checked: boolean;
};

// 7. Definimos la estructura que tendrá cada mantenimiento
// almacenado dentro de Redux.
export type Maintenance = {
  id: string;
  codigoEquipo: string;       // referencia al equipo (Equipment.codigo)
  tecnico: string;
  tipo: MaintenanceType;
  prioridad?: MaintenancePriority;
  checklist: ChecklistItem[];
  repuestos: MaintenancePart[];
  descripcion: string;
  estadoFinal?: string;       // ej. "Operativo", "Requiere seguimiento"
  firmaBase64?: string;       // imagen de la firma digital codificada
  status: MaintenanceStatus;
  fechaInicio: string;
  fechaFinalizacion?: string;
};

// 8. Definimos la estructura del estado que manejará Redux para el módulo de mantenimiento.
// maintenances será el arreglo que contendrá todos los mantenimientos registrados.
type MaintenanceState = {
  maintenances: Maintenance[];
};

// 9. Lista de verificacion por defecto que se asigna a cada mantenimiento nuevo.
const defaultChecklist = (): ChecklistItem[] => [
  { label: 'Limpieza interna', checked: false },
  { label: 'Revisión de hardware', checked: false },
  { label: 'Actualización de software', checked: false },
  { label: 'Pruebas de funcionamiento', checked: false },
  { label: 'Observaciones generales', checked: false },
];

// 10. Creamos el estado inicial del módulo de mantenimiento.
// Incluimos dos mantenimientos de prueba para poder verificar visualmente el modulo.
const initialState: MaintenanceState = {
  maintenances: [
    {
      id: 'MT-0001',
      codigoEquipo: 'EQ-0002',
      tecnico: 'Carlos López',
      tipo: 'correctivo',
      prioridad: 'alta',
      checklist: defaultChecklist(),
      repuestos: [{ nombre: 'Fuente de poder 500W', cantidad: 1 }],
      descripcion: 'Revisión de fuente de poder, equipo no enciende.',
      status: 'en_proceso',
      fechaInicio: new Date().toISOString(),
    },
    {
      id: 'MT-0002',
      codigoEquipo: 'EQ-0001',
      tecnico: 'Josue Meza',
      tipo: 'preventivo',
      prioridad: 'baja',
      checklist: defaultChecklist().map((item) => ({ ...item, checked: true })),
      repuestos: [{ nombre: 'Pasta térmica', cantidad: 1 }],
      descripcion: 'Limpieza interna y cambio de pasta térmica.',
      estadoFinal: 'Operativo',
      status: 'finalizado',
      fechaInicio: new Date(Date.now() - 86400000).toISOString(),
      fechaFinalizacion: new Date().toISOString(),
    },
  ],
};

// 11. Creamos el Slice encargado de manejar
// toda la información relacionada con los mantenimientos.
const maintenanceSlice = createSlice({

  // 12. Nombre interno del Slice dentro de Redux.
  name: 'maintenance',

  // 13. Indicamos cuál será el estado inicial que utilizará este módulo.
  initialState,

  // 14. Aquí agregamos las funciones que modificarán el estado de los mantenimientos.
  reducers: {

    // Crea un nuevo mantenimiento con estado en_proceso.
    crearMantenimiento: (state, action: PayloadAction<Maintenance>) => {
      // 15. action.payload contiene el mantenimiento que fue enviado desde la aplicación.
      state.maintenances.push(action.payload);
    },

    // Actualiza los datos de un mantenimiento que sigue en_proceso, sin finalizarlo.
    actualizarMantenimiento: (
      state,
      action: PayloadAction<{
        id: string;
        checklist: ChecklistItem[];
        repuestos: MaintenancePart[];
        descripcion: string;
        estadoFinal?: string;
      }>
    ) => {
      // 16. Buscamos el mantenimiento utilizando su id único.
      const mant = state.maintenances.find((m) => m.id === action.payload.id);

      // 17. Si encontramos el mantenimiento, actualizamos su informacion sin cambiar el estado.
      if (mant) {
        mant.checklist = action.payload.checklist;
        mant.repuestos = action.payload.repuestos;
        mant.descripcion = action.payload.descripcion;
        mant.estadoFinal = action.payload.estadoFinal;
      }
    },

    // Finaliza un mantenimiento existente, adjuntando la firma digital.
    finalizarMantenimiento: (
      state,
      action: PayloadAction<{ id: string; firmaBase64: string }>
    ) => {
      // 18. Buscamos el mantenimiento utilizando su id único.
      const mant = state.maintenances.find((m) => m.id === action.payload.id);

      // 19. Si encontramos el mantenimiento, actualizamos su estado y datos finales.
      if (mant) {
        mant.status = 'finalizado';
        mant.firmaBase64 = action.payload.firmaBase64;
        mant.fechaFinalizacion = new Date().toISOString();
      }
    },
  },
});

// 20. Exportamos las acciones para poder usarlas con dispatch en cualquier pantalla.
export const { crearMantenimiento, actualizarMantenimiento, finalizarMantenimiento } = maintenanceSlice.actions;

// 21. Exportamos el reducer para registrarlo en store.ts.
export default maintenanceSlice.reducer;