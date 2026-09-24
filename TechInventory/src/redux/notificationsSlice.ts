// 1. Importaciones
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

// 2. Definimos los tipos de notificacion que existen por ahora.
export type NotificationType = 'inicio' | 'fin';

// 3. Estructura de cada notificacion. Pensada ya para migrar directo a una tabla de Supabase.
export type AppNotification = {
  id: string;
  tipo: NotificationType;
  mensaje: string;
  codigoEquipo: string;
  leida: boolean;
  fecha: string;
};

// 4. Estado del modulo de notificaciones.
type NotificationsState = {
  notifications: AppNotification[];
};

// 5. Estado inicial: sin notificaciones todavia. Se reemplaza al cargar desde AsyncStorage
// cuando la app inicia, si existen notificaciones guardadas de una sesion anterior.
const initialState: NotificationsState = {
  notifications: [],
};

// 6. Creamos el Slice encargado de manejar las notificaciones del sistema.
const notificationsSlice = createSlice({
  name: 'notifications',
  initialState,
  reducers: {
    // 7. Agrega una notificacion nueva, siempre al inicio del arreglo (la mas reciente primero).
    agregarNotificacion: (state, action: PayloadAction<AppNotification>) => {
      state.notifications.unshift(action.payload);
    },

    // 8. Marca todas las notificaciones existentes como leidas.
    marcarTodasLeidas: (state) => {
      state.notifications.forEach((n) => {
        n.leida = true;
      });
    },

    // 9. Reemplaza el arreglo completo con las notificaciones recuperadas de AsyncStorage.
    cargarNotificaciones: (state, action: PayloadAction<AppNotification[]>) => {
      state.notifications = action.payload;
    },
  },
});

// 10. Exportamos las acciones para poder usarlas con dispatch en cualquier pantalla.
export const { agregarNotificacion, marcarTodasLeidas, cargarNotificaciones } = notificationsSlice.actions;

// 11. Exportamos el reducer para registrarlo en store.ts.
export default notificationsSlice.reducer;