// 1. Importamos Redux Toolkit para crear el estado y la carga asíncrona de departamentos.
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';

// 2. Importamos el servicio que consulta Supabase y el tipo de departamento.
import { obtenerDepartamentos, Departamento } from '../services/departamentosService';

// 3. Definimos la estructura que tendrá el módulo de departamentos dentro de Redux.
type DepartamentosState = {
    departamentos: Departamento[];
    cargando: boolean;
    error: string | null;
};

// 4. El catálogo inicia vacío porque los departamentos serán obtenidos desde Supabase.
const initialState: DepartamentosState = {
    departamentos: [],
    cargando: false,
    error: null,
};

// 5. Acción asíncrona encargada de solicitar los departamentos a Supabase.
export const cargarDepartamentosDesdeSupabase = createAsyncThunk<
    Departamento[],
    void,
    { rejectValue: string }
>(
    'departamentos/cargarDesdeSupabase',
    async (_, { rejectWithValue }) => {
        try {
            return await obtenerDepartamentos();
        } catch (error) {
            // Convertimos el error recibido en un mensaje que podamos guardar dentro de Redux.
            const mensaje = error instanceof Error ? error.message : 'No se pudieron cargar los departamentos.';
            return rejectWithValue(mensaje);
        }
    }
);

// 6. Creamos el Slice que mantendrá el catálogo disponible para toda la aplicación.
const departamentosSlice = createSlice({
    name: 'departamentos',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        // 7. Indicamos que comenzó la consulta a Supabase.
        builder.addCase(cargarDepartamentosDesdeSupabase.pending, (state) => {
            state.cargando = true;
            state.error = null;
        });

        // 8. Guardamos en Redux todos los departamentos recibidos correctamente.
        builder.addCase(cargarDepartamentosDesdeSupabase.fulfilled, (state, action) => {
            state.departamentos = action.payload;
            state.cargando = false;
        });

        // 9. Si ocurre un problema, detenemos la carga y conservamos el mensaje de error.
        builder.addCase(cargarDepartamentosDesdeSupabase.rejected, (state, action) => {
            state.cargando = false;
            state.error = action.payload ?? 'No se pudieron cargar los departamentos.';
        });
    },
});

// 10. Exportamos el reducer para registrarlo después dentro del Store principal.
export default departamentosSlice.reducer;