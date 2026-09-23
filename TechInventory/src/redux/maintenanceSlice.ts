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
  codigoMantenimiento?: string;
  codigoEquipo: string;

  // Usuario autenticado que creó originalmente el registro.
  // Se conserva separado del técnico responsable del trabajo.
  registradoPorId?: string;
  registradoPorNombre?: string;
  registradoPorCorreo?: string;

  // Técnico asignado al mantenimiento.
  // Guardamos las relaciones reales y también el nombre histórico.
  tecnicoEmpleadoId?: number;
  tecnicoUsuarioId?: string;



  tecnico: string;
  tipo: MaintenanceType;
  prioridad?: MaintenancePriority;
  checklist: ChecklistItem[];
  repuestos: MaintenancePart[];
  descripcion: string;

  estadoFinal?: string;
  motivoBaja?: string;

  firmaBase64?: string;
  firmadoPorNombre?: string;
  fechaFirma?: string;

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

// 10. Redux comienza sin mantenimientos locales.
// Los registros reales serán recuperados desde Supabase.
const initialState: MaintenanceState = {
  maintenances: [],
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

    // Reemplaza el arreglo completo con los mantenimientos recuperados
    // desde Supabase o, únicamente como respaldo, desde AsyncStorage.
    cargarMantenimientos: (state, action: PayloadAction<Maintenance[]>) => {
      // Sustituimos la información actual por la fuente que acaba de cargarse.
      state.maintenances = action.payload;
    },

    // Actualiza los datos de un mantenimiento que sigue en_proceso, sin finalizarlo.
    // Ahora tambien permite editar tecnico, tipo y prioridad (antes solo checklist/repuestos/descripcion/estadoFinal).
    actualizarMantenimiento: (
      state,
      action: PayloadAction<{
        id: string;
        tecnico: string;
        tipo: MaintenanceType;
        prioridad?: MaintenancePriority;
        checklist: ChecklistItem[];
        repuestos: MaintenancePart[];
        descripcion: string;
        estadoFinal?: string;
        motivoBaja?: string;
      }>
    ) => {
      // 16. Buscamos el mantenimiento utilizando su id único.
      const mant = state.maintenances.find((m) => m.id === action.payload.id);

      // 17. Si encontramos el mantenimiento, actualizamos toda su informacion editable sin cambiar el estado.
      if (mant) {
        mant.tecnico = action.payload.tecnico;
        mant.tipo = action.payload.tipo;
        mant.prioridad = action.payload.prioridad;
        mant.checklist = action.payload.checklist;
        mant.repuestos = action.payload.repuestos;
        mant.descripcion = action.payload.descripcion;
        mant.estadoFinal = action.payload.estadoFinal;
        // Conservamos también el motivo asociado a una posible baja.
        mant.motivoBaja = action.payload.motivoBaja;
      }
    },

    // Finaliza un mantenimiento existente, adjuntando la firma digital.
    finalizarMantenimiento: (
      state,
      action: PayloadAction<{
        id: string;
        firmaBase64: string
        firmadoPorNombre?: string;
      }>
    ) => {
      // 18. Buscamos el mantenimiento utilizando su id único.
      const mant = state.maintenances.find((m) => m.id === action.payload.id);

      // 19. Si encontramos el mantenimiento, actualizamos su estado y datos finales.
      if (mant) {
        mant.status = 'finalizado';
        mant.fechaFinalizacion = new Date().toISOString();
        mant.firmaBase64 = action.payload.firmaBase64;

        // Conservamos quién firmó la conformidad en ese momento.
        // Así un cambio futuro de responsable no altera mantenimientos antiguos.
        mant.firmadoPorNombre = action.payload.firmadoPorNombre;

        // Registramos también la fecha exacta de la firma.
        mant.fechaFirma = new Date().toISOString();
      }
    },
  },
});

// 20. Exportamos las acciones para poder usarlas con dispatch en cualquier pantalla.
export const {
  crearMantenimiento,
  cargarMantenimientos,
  actualizarMantenimiento,
  finalizarMantenimiento
} = maintenanceSlice.actions;

// 21. Exportamos el reducer para registrarlo en store.ts.
export default maintenanceSlice.reducer;