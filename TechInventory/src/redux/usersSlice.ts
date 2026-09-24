// 1. Importamos Redux Toolkit para manejar usuarios y su carga asíncrona.
import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';

// 2. Importamos el servicio encargado de consultar public.usuarios.
import { actualizarPerfilEnSupabase, obtenerUsuarios } from '../services/usuariosService';

// 3. Roles disponibles actualmente dentro de TechInventory.
export type UserRole = 'tecnico' | 'administrador';

// 4. Estructura que utiliza la interfaz para cada usuario.
// El ID ahora será el UUID real generado por Supabase Auth.
export type AppUser = {
  id: string;
  empleadoId?: number;
  nombreCompleto: string;
  correo: string;
  rol: UserRole;
  fechaCreacion: string;
  fotoPerfil?: string;
};

// 5. Estado de usuarios dentro de Redux.
type UsersState = {
  users: AppUser[];

  // NULL significa que actualmente no existe una sesión autenticada.
  currentUserId: string | null;

  cargando: boolean;
  error: string | null;
};

// 6. Ya no mantenemos usuarios ficticios.
// Supabase será la fuente persistente y Redux la fuente utilizada por la interfaz.
const initialState: UsersState = {
  users: [],
  currentUserId: null,
  cargando: false,
  error: null,
};

// 7. Recupera los usuarios activos almacenados en Supabase.
export const cargarUsuariosDesdeSupabase = createAsyncThunk<
  AppUser[],
  void,
  { rejectValue: string }
>(
  'users/cargarDesdeSupabase',
  async (_, { rejectWithValue }) => {
    try {
      return await obtenerUsuarios();
    } catch (error) {
      const mensaje =
        error instanceof Error
          ? error.message
          : 'No se pudieron cargar los usuarios.';

      return rejectWithValue(mensaje);
    }
  }
);

// Actualiza el perfil del usuario autenticado primero en Supabase
// y luego sincroniza el resultado con Redux.
export const actualizarPerfilPropioEnSupabase = createAsyncThunk<
  {
    id: string;
    nombreCompleto: string;
    fotoPerfil?: string;
  },
  {
    usuarioId: string;
    nombreCompleto: string;
    fotoPerfil?: string;
  },
  { rejectValue: string }
>(
  'users/actualizarPerfilPropioEnSupabase',
  async (datos, { rejectWithValue }) => {
    try {
      return await actualizarPerfilEnSupabase(datos);
    } catch (error) {
      const mensaje =
        error instanceof Error
          ? error.message
          : 'No se pudo actualizar el perfil.';

      return rejectWithValue(mensaje);
    }
  }
);


// 8. Slice encargado del estado de usuarios.
const usersSlice = createSlice({
  name: 'users',
  initialState,
  reducers: {
    // 9. Vincula Redux con el UUID de la sesión actual de Supabase Auth.
    establecerUsuarioActual: (
      state,
      action: PayloadAction<string | null>
    ) => {
      state.currentUserId = action.payload;
    },

    // 10. Limpiamos información de sesión cuando el usuario cierra sesión.
    limpiarUsuarios: (state) => {
      state.users = [];
      state.currentUserId = null;
      state.cargando = false;
      state.error = null;
    },

    // 11. Conservamos estas acciones porque las pantallas actuales todavía
    // las utilizan. En el próximo bloque las conectaremos también a Supabase.
    crearUsuario: (state, action: PayloadAction<AppUser>) => {
      state.users.push(action.payload);
    },

    actualizarUsuario: (
      state,
      action: PayloadAction<{
        id: string;
        empleadoId?: number;
        nombreCompleto: string;
        correo: string;
        rol: UserRole;
      }>
    ) => {
      const user = state.users.find((u) => u.id === action.payload.id);

      if (user) {
        user.empleadoId = action.payload.empleadoId;
        user.nombreCompleto = action.payload.nombreCompleto;
        user.correo = action.payload.correo;
        user.rol = action.payload.rol;
      }
    },

    actualizarPerfilPropio: (
      state,
      action: PayloadAction<{
        id: string;
        nombreCompleto: string;
        correo: string;
        fotoPerfil?: string;
      }>
    ) => {
      const user = state.users.find((u) => u.id === action.payload.id);

      if (user) {
        user.nombreCompleto = action.payload.nombreCompleto;
        user.correo = action.payload.correo;
        user.fotoPerfil = action.payload.fotoPerfil;
      }
    },

    eliminarUsuario: (state, action: PayloadAction<{ id: string }>) => {
      state.users = state.users.filter((u) => u.id !== action.payload.id);
    },
  },

  extraReducers: (builder) => {
    // 12. Marcamos el inicio de la consulta.
    builder.addCase(cargarUsuariosDesdeSupabase.pending, (state) => {
      state.cargando = true;
      state.error = null;
    });

    // 13. Guardamos los usuarios recuperados correctamente.
    builder.addCase(cargarUsuariosDesdeSupabase.fulfilled, (state, action) => {
      state.users = action.payload;
      state.cargando = false;
    });

    // 14. Conservamos el mensaje si la consulta falla.
    builder.addCase(cargarUsuariosDesdeSupabase.rejected, (state, action) => {
      state.cargando = false;
      state.error =
        action.payload ?? 'No se pudieron cargar los usuarios.';
    });

    // Indicamos que comenzó la actualización del perfil.
    builder.addCase(actualizarPerfilPropioEnSupabase.pending, (state) => {
      state.cargando = true;
      state.error = null;
    });

    // Sincronizamos Redux con los datos confirmados por Supabase.
    builder.addCase(actualizarPerfilPropioEnSupabase.fulfilled, (state, action) => {
      const user = state.users.find((u) => u.id === action.payload.id);

      if (user) {
        user.nombreCompleto = action.payload.nombreCompleto;
        user.fotoPerfil = action.payload.fotoPerfil;
      }

      state.cargando = false;
    });

    // Conservamos el error si Supabase rechaza el UPDATE.
    builder.addCase(actualizarPerfilPropioEnSupabase.rejected, (state, action) => {
      state.cargando = false;
      state.error =
        action.payload ?? 'No se pudo actualizar el perfil.';
    });
  },
});

// 15. Exportamos las acciones utilizadas actualmente por las pantallas.
export const {
  establecerUsuarioActual,
  limpiarUsuarios,
  crearUsuario,
  actualizarUsuario,
  actualizarPerfilPropio,
  eliminarUsuario,
} = usersSlice.actions;

// 16. Exportamos el reducer que ya se encuentra registrado en store.ts.
export default usersSlice.reducer;