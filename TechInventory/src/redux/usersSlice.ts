// 1. Importaciones
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

// 2. Definimos los dos unicos tipos de usuario que existen en el sistema.
export type UserRole = 'tecnico' | 'administrador';

// 3. Estructura de cada usuario. Se diseña ya pensando en la futura tabla de Supabase:
// mismos nombres de campo, para que migrar sea solo cambiar de donde se leen los datos.
export type AppUser = {
  id: string;
  nombreCompleto: string;
  correo: string;
  rol: UserRole;
  fechaCreacion: string;
};

// 4. Estado del modulo de usuarios.
type UsersState = {
  users: AppUser[];
  // 5. Referencia al usuario que esta usando la app en este momento.
  // Esto es un reemplazo temporal mientras no exista autenticacion real con Supabase;
  // cuando se conecte el login real, este valor se llenara con la sesion autenticada.
  currentUserId: string;
};

// 6. Estado inicial con datos de prueba: un administrador (la sesion actual) y un tecnico.
const initialState: UsersState = {
  users: [
    {
      id: 'USR-0001',
      nombreCompleto: 'Leonardo Alvarado',
      correo: 'leonardo@techinventory.com',
      rol: 'administrador',
      fechaCreacion: new Date().toISOString(),
    },
    {
      id: 'USR-0002',
      nombreCompleto: 'Carlos Méndez',
      correo: 'carlos.mendez@techinventory.com',
      rol: 'tecnico',
      fechaCreacion: new Date().toISOString(),
    },
  ],
  currentUserId: 'USR-0001',
};

// 7. Creamos el Slice encargado de manejar los usuarios y tecnicos del sistema.
const usersSlice = createSlice({
  name: 'users',
  initialState,
  reducers: {
    // 8. Crea un usuario nuevo dentro del sistema.
    crearUsuario: (state, action: PayloadAction<AppUser>) => {
      state.users.push(action.payload);
    },

    // 9. Actualiza los datos editables de un usuario existente.
    actualizarUsuario: (
      state,
      action: PayloadAction<{ id: string; nombreCompleto: string; correo: string; rol: UserRole }>
    ) => {
      const user = state.users.find((u) => u.id === action.payload.id);
      if (user) {
        user.nombreCompleto = action.payload.nombreCompleto;
        user.correo = action.payload.correo;
        user.rol = action.payload.rol;
      }
    },

    // 10. Elimina un usuario del sistema.
    eliminarUsuario: (state, action: PayloadAction<{ id: string }>) => {
      state.users = state.users.filter((u) => u.id !== action.payload.id);
    },
  },
});

// 11. Exportamos las acciones para poder usarlas con dispatch en cualquier pantalla.
export const { crearUsuario, actualizarUsuario, eliminarUsuario } = usersSlice.actions;

// 12. Exportamos el reducer para registrarlo en store.ts.
export default usersSlice.reducer;