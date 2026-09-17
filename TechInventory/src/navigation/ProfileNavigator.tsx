// 1. Importaciones
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import ProfileScreen from '../screens/profile/ProfileScreen';
import ConfigurationScreen from '../screens/profile/ConfigurationScreen';
import UsersScreen from '../screens/profile/UsersScreen';
import NewUserScreen from '../screens/profile/NewUserScreen';

// 2. Definimos las pantallas disponibles dentro del Stack de perfil/configuracion.
export type ProfileStackParamList = {
  ProfileScreen: undefined;
  ConfigurationScreen: undefined;
  UsersScreen: undefined;
  NewUserScreen: undefined;
};

// 3. Creamos el Stack Navigator tipado del modulo de perfil.
const Stack = createNativeStackNavigator<ProfileStackParamList>();

export default function ProfileNavigator() {
  return (
    // 4. Ocultamos el header nativo, ya que cada pantalla maneja su propio encabezado.
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      {/* 5. Pantalla principal: identidad del usuario y accesos rapidos */}
      <Stack.Screen name="ProfileScreen" component={ProfileScreen} />
      {/* 6. Pantalla de configuracion: administracion, aplicacion y datos */}
      <Stack.Screen name="ConfigurationScreen" component={ConfigurationScreen} />
      {/* 7. Listado de usuarios y tecnicos del sistema */}
      <Stack.Screen name="UsersScreen" component={UsersScreen} />
      {/* 8. Formulario para registrar un usuario nuevo */}
      <Stack.Screen name="NewUserScreen" component={NewUserScreen} />
    </Stack.Navigator>
  );
}