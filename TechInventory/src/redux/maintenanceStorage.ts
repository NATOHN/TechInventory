// 1. Importamos AsyncStorage para persistir los mantenimientos localmente.
import AsyncStorage from '@react-native-async-storage/async-storage';
import type { Maintenance } from './maintenanceSlice';

// 2. Clave exclusiva utilizada para guardar los mantenimientos.
const MAINTENANCES_STORAGE_KEY = '@techinventory_maintenances';

// 3. Guarda el arreglo completo de mantenimientos en AsyncStorage.
export const saveMaintenances = async (maintenances: Maintenance[]) => {
  try {
    const maintenancesJson = JSON.stringify(maintenances);
    await AsyncStorage.setItem(MAINTENANCES_STORAGE_KEY, maintenancesJson);
  } catch (error) {
    console.log('Error al guardar los mantenimientos:', error);
  }
};

// 4. Recupera los mantenimientos guardados anteriormente.
export const loadMaintenances = async (): Promise<Maintenance[] | null> => {
  try {
    const maintenancesJson = await AsyncStorage.getItem(MAINTENANCES_STORAGE_KEY);

    if (!maintenancesJson) return null;

    return JSON.parse(maintenancesJson) as Maintenance[];
  } catch (error) {
    console.log('Error al recuperar los mantenimientos:', error);
    return null;
  }
};
