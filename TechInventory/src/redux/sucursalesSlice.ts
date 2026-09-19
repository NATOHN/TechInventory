// 1. Importamos las herramientas de Redux Toolkit necesarias para manejar
// el estado de sucursales y cargar los datos de forma asíncrona.
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';

// 2. Importamos el servicio que consulta Supabase y el tipo de cada sucursal.
import { obtenerSucursales, Sucursal } from '../services/sucursalesService';

// 3. Definimos el estado que manejará este módulo dentro de Redux.
type SucursalesState = {
    sucursales: Sucursal[];
    cargando: boolean;
    error: string | null;
};

// 4. Estado inicial. Comenzamos vacío porque ahora las sucursales vendrán desde Supabase.
const initialState: SucursalesState = {
    sucursales: [],
    cargando: false,
    error: null,
};

// 5. Creamos una acción asíncrona que solicita las sucursales al servicio.
// Si Supabase responde correctamente, devuelve el arreglo obtenido.
export const cargarSucursalesDesdeSupabase = createAsyncThunk<
    Sucursal[],
    void,
    { rejectValue: string }
>(
    'sucursales/cargarDesdeSupabase',
    async (_, { rejectWithValue }) => {
        try {
            return await obtenerSucursales();
        } catch (error) {
            // Convertimos cualquier error en un mensaje sencillo para almacenarlo en Redux.
            const mensaje = error instanceof Error ? error.message : 'No se pudieron cargar las sucursales.';
            return rejectWithValue(mensaje);
        }
    }
);

// 6. Creamos el Slice encargado de mantener las sucursales disponibles en la interfaz.
const sucursalesSlice = createSlice({
    name: 'sucursales',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        // 7. Mientras Supabase responde, indicamos que la carga está en proceso.
        builder.addCase(cargarSucursalesDesdeSupabase.pending, (state) => {
            state.cargando = true;
            state.error = null;
        });

        // 8. Cuando la consulta termina correctamente, guardamos las sucursales en Redux.
        builder.addCase(cargarSucursalesDesdeSupabase.fulfilled, (state, action) => {
            state.sucursales = action.payload;
            state.cargando = false;
        });

        // 9. Si ocurre un error, detenemos la carga y guardamos el mensaje recibido.
        builder.addCase(cargarSucursalesDesdeSupabase.rejected, (state, action) => {
            state.cargando = false;
            state.error = action.payload ?? 'No se pudieron cargar las sucursales.';
        });
    },
});

// 10. Exportamos el reducer para registrarlo después en el Store principal.
export default sucursalesSlice.reducer;