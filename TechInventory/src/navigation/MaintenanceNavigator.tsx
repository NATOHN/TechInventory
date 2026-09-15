import { createNativeStackNavigator } from '@react-navigation/native-stack';
import MaintenanceScreen from '../screens/maintenance/MaintenanceScreen';
import NewMaintenanceScreen from '../screens/maintenance/NewMaintenanceScreen';

export type MaintenanceStackParamList = {
  MaintenanceScreen: undefined;
  NewMaintenanceScreen: undefined;
};

const Stack = createNativeStackNavigator<MaintenanceStackParamList>();

export default function MaintenanceNavigator() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="MaintenanceScreen" component={MaintenanceScreen} />
      <Stack.Screen name="NewMaintenanceScreen" component={NewMaintenanceScreen} />
    </Stack.Navigator>
  );
}