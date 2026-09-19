// 1. Importamos Redux Toolkit para manejar el catálogo y su carga asíncrona.
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';

// 2. Importamos el servicio de Supabase y el tipo utilizado por cada empleado.
import { obtenerEmpleados, Empleado } from '../services/empleadosService';

// 3. Definimos el estado correspondiente al catálogo de empleados.
type EmpleadosState = {
    empleados: Empleado[];
    cargando: boolean;
    error: string | null;
};

// 4. El catálogo comienza vacío porque será cargado desde Supabase.
const initialState: EmpleadosState = {
    empleados: [],
    cargando: false,
    error: null,
};

// 5. Acción asíncrona encargada de solicitar los empleados a Supabase.
export const cargarEmpleadosDesdeSupabase = createAsyncThunk<
    Empleado[],
    void,
    { rejectValue: string }
>(
    'empleados/cargarDesdeSupabase',
    async (_, { rejectWithValue }) => {
        try {
            return await obtenerEmpleados();
        } catch (error) {
            // Convertimos cualquier error en un mensaje que Redux pueda almacenar.
            const mensaje = error instanceof Error ? error.message : 'No se pudieron cargar los empleados.';
            return rejectWithValue(mensaje);
        }
    }
);

// 6. Creamos el Slice encargado del catálogo de empleados.
const empleadosSlice = createSlice({
    name: 'empleados',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        // 7. Marcamos el inicio de la consulta.
        builder.addCase(cargarEmpleadosDesdeSupabase.pending, (state) => {
            state.cargando = true;
            state.error = null;
        });

        // 8. Guardamos en Redux los empleados recuperados correctamente.
        builder.addCase(cargarEmpleadosDesdeSupabase.fulfilled, (state, action) => {
            state.empleados = action.payload;
            state.cargando = false;
        });

        // 9. Conservamos el error si la consulta falla.
        builder.addCase(cargarEmpleadosDesdeSupabase.rejected, (state, action) => {
            state.cargando = false;
            state.error = action.payload ?? 'No se pudieron cargar los empleados.';
        });
    },
});

// 10. Exportamos el reducer para registrarlo dentro del Store.
export default empleadosSlice.reducer;