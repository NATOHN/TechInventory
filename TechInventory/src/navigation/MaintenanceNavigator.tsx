// 1. Importaciones
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import MaintenanceScreen from '../screens/maintenance/MaintenanceScreen';
import NewMaintenanceScreen from '../screens/maintenance/NewMaintenanceScreen';

// 2. Definimos las pantallas disponibles dentro del Stack de mantenimiento.
export type MaintenanceStackParamList = {
  MaintenanceScreen: undefined;
  NewMaintenanceScreen: undefined;
};

// 3. Creamos el Stack Navigator tipado del modulo de mantenimiento.
const Stack = createNativeStackNavigator<MaintenanceStackParamList>();

export default function MaintenanceNavigator() {
  return (
    // 4. Ocultamos el header nativo, ya que cada pantalla maneja su propio encabezado.
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      // 5. Pantalla principal: lista de mantenimientos con filtros por estado
      <Stack.Screen name="MaintenanceScreen" component={MaintenanceScreen} />
      // 6. Pantalla de formulario para registrar un nuevo mantenimiento 
      <Stack.Screen name="NewMaintenanceScreen" component={NewMaintenanceScreen} />
    </Stack.Navigator>
  );
}