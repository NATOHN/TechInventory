// 1. Importaciones
import AsyncStorage from '@react-native-async-storage/async-storage';
import { AppNotification } from './notificationsSlice';

// 2. Clave utilizada para guardar y recuperar las notificaciones en AsyncStorage.
const NOTIFICATIONS_KEY = 'techinventory_notifications';

// 3. Guarda el arreglo completo de notificaciones en AsyncStorage.
export const saveNotifications = async (notifications: AppNotification[]): Promise<void> => {
    await AsyncStorage.setItem(NOTIFICATIONS_KEY, JSON.stringify(notifications));
};

// 4. Recupera el arreglo de notificaciones guardado anteriormente.
// Retorna null si todavia no existe nada guardado.
export const loadNotifications = async (): Promise<AppNotification[] | null> => {
    const data = await AsyncStorage.getItem(NOTIFICATIONS_KEY);

    if (data === null) {
        return null;
    }

    return JSON.parse(data) as AppNotification[];
};