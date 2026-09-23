// 1. Importaciones
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import ProfileScreen from '../screens/profile/ProfileScreen';
import EditProfileScreen from '../screens/profile/EditProfileScreen';
import ConfigurationScreen from '../screens/profile/ConfigurationScreen';
import UsersScreen from '../screens/profile/UsersScreen';
import NewUserScreen from '../screens/profile/NewUserScreen';
// Pantalla para administrar sucursales y departamentos.
import LocationsScreen from '../screens/profile/LocationsScreen';
// Administración de empleados disponible para administradores.
import EmployeesScreen from '../screens/profile/EmployeesScreen';
// Pantalla para que cualquier usuario autenticado cambie su propia contraseña.
import ChangePasswordScreen from '../screens/profile/ChangePasswordScreen';

// 2. Definimos las pantallas disponibles dentro del Stack de perfil/configuracion.
export type ProfileStackParamList = {
  ProfileScreen: undefined;
  EditProfileScreen: undefined;
  ConfigurationScreen: undefined;
  UsersScreen: undefined;
  NewUserScreen: undefined;
  LocationsScreen: undefined;
  EmployeesScreen: undefined;
  ChangePasswordScreen: undefined;
};

// 3. Creamos el Stack Navigator tipado del modulo de perfil.
const Stack = createNativeStackNavigator<ProfileStackParamList>();

export default function ProfileNavigator() {
  return (
    // 4. Ocultamos el header nativo, ya que cada pantalla maneja su propio encabezado.
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      {/* 5. Pantalla principal: identidad del usuario y accesos rapidos */}
      <Stack.Screen name="ProfileScreen" component={ProfileScreen} />
      {/* 6. Pantalla para editar foto, nombre, correo y contraseña del usuario actual */}
      <Stack.Screen name="EditProfileScreen" component={EditProfileScreen} />
      {/* 7. Pantalla de configuracion: administracion, aplicacion y datos */}
      <Stack.Screen name="ConfigurationScreen" component={ConfigurationScreen} />
      {/* 8. Listado de usuarios y tecnicos del sistema */}
      <Stack.Screen name="UsersScreen" component={UsersScreen} />
      {/* 9. Formulario para registrar un usuario nuevo */}
      <Stack.Screen name="NewUserScreen" component={NewUserScreen} />
      {/* 10. Pantalla para administrar sucursales y departamentos */}
      <Stack.Screen name="LocationsScreen" component={LocationsScreen} />
      {/*11. Pantalla para registrar y consultar empleados */}
      <Stack.Screen name="EmployeesScreen" component={EmployeesScreen} />
      {/* 12. Cambio de contraseña disponible para cualquier usuario autenticado */}
      <Stack.Screen name="ChangePasswordScreen" component={ChangePasswordScreen} />
    </Stack.Navigator>
  );
}