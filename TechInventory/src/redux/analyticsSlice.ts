// 1. Redux Toolkit maneja la carga asíncrona de los datos estadísticos.
import {
  createAsyncThunk,
  createSlice,
} from '@reduxjs/toolkit';

import {
  AnalyticsSnapshot,
  obtenerAnalytics,
} from '../services/analyticsService';

// 2. Estado inicial vacío.
// Los valores serán reemplazados por información obtenida de Supabase.
const initialData: AnalyticsSnapshot = {
  equipos: {
    total: 0,
    activos: 0,
    disponibles: 0,
    enUso: 0,
    taller: 0,
    baja: 0,
  },

  mantenimientos: {
    total: 0,
    enProceso: 0,
    finalizados: 0,
    preventivos: 0,
    correctivos: 0,
  },

  equiposPorSucursal: [],
  actividadReciente: [],
  actualizadoEn: '',
};

type AnalyticsState = {
  data: AnalyticsSnapshot;
  cargando: boolean;
  error: string | null;
};

const initialState: AnalyticsState = {
  data: initialData,
  cargando: false,
  error: null,
};

// 3. Solicita a Supabase todos los datos necesarios para Home y Reportes.
export const cargarAnalyticsDesdeSupabase = createAsyncThunk<
  AnalyticsSnapshot,
  void,
  { rejectValue: string }
>(
  'analytics/cargarDesdeSupabase',
  async (_, { rejectWithValue }) => {
    try {
      return await obtenerAnalytics();
    } catch (error) {
      const mensaje =
        error instanceof Error
          ? error.message
          : 'No se pudieron cargar los indicadores.';

      return rejectWithValue(mensaje);
    }
  }
);

// 4. Slice utilizado exclusivamente para indicadores y reportes.
const analyticsSlice = createSlice({
  name: 'analytics',
  initialState,
  reducers: {},

  extraReducers: (builder) => {
    builder.addCase(
      cargarAnalyticsDesdeSupabase.pending,
      (state) => {
        state.cargando = true;
        state.error = null;
      }
    );

    builder.addCase(
      cargarAnalyticsDesdeSupabase.fulfilled,
      (state, action) => {
        state.data = action.payload;
        state.cargando = false;
      }
    );

    builder.addCase(
      cargarAnalyticsDesdeSupabase.rejected,
      (state, action) => {
        state.cargando = false;
        state.error =
          action.payload ??
          'No se pudieron cargar los indicadores.';
      }
    );
  },
});

export default analyticsSlice.reducer;