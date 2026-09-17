// 1. Importaciones
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import MaintenanceScreen from '../screens/maintenance/MaintenanceScreen';
import EnterEquipmentCodeScreen from '../screens/maintenance/EnterEquipmentCodeScreen';
import NewMaintenanceScreen from '../screens/maintenance/NewMaintenanceScreen';
import SignatureScreen from '../screens/maintenance/SignatureScreen';

// 2. Definimos las pantallas disponibles dentro del Stack de mantenimiento.
export type MaintenanceStackParamList = {
  MaintenanceScreen: undefined;
  EnterEquipmentCodeScreen: undefined;
  NewMaintenanceScreen: { codigoEquipo?: string; maintenanceId?: string };
  SignatureScreen: { maintenanceId: string };
};

// 3. Creamos el Stack Navigator tipado del modulo de mantenimiento.
const Stack = createNativeStackNavigator<MaintenanceStackParamList>();

export default function MaintenanceNavigator() {
  return (
    // 4. Ocultamos el header nativo, ya que cada pantalla maneja su propio encabezado.
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      {/* 5. Pantalla principal: lista de mantenimientos con filtros por estado */}
      <Stack.Screen name="MaintenanceScreen" component={MaintenanceScreen} />
      {/* 6. Pantalla para escanear o ingresar el codigo del equipo antes de iniciar el mantenimiento */}
      <Stack.Screen name="EnterEquipmentCodeScreen" component={EnterEquipmentCodeScreen} />
      {/* 7. Pantalla de formulario para registrar/editar/ver un mantenimiento */}
      <Stack.Screen name="NewMaintenanceScreen" component={NewMaintenanceScreen} />
      {/* 8. Pantalla de firma digital, ultimo paso antes de finalizar el mantenimiento */}
      <Stack.Screen name="SignatureScreen" component={SignatureScreen} />
    </Stack.Navigator>
  );
}