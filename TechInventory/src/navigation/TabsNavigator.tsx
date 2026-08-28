import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import { RouteProp } from '@react-navigation/native';
import HomeTab from '../screens/tabs/HomeTab';
import ProfileTab from '../screens/tabs/ProfileTab';
import EquipmentNavigator from './EquipmentNavigator';

export type TabsParamList = {
  Inicio: undefined;
  Perfil: undefined;
  Equipos: undefined;
};

const Tab = createBottomTabNavigator<TabsParamList>();

type TabRouteProp = RouteProp<TabsParamList, keyof TabsParamList>;

export default function TabsNavigator() {
  return (
    <Tab.Navigator
      screenOptions={({ route }: { route: TabRouteProp }) => ({
        headerShown: false,
        tabBarActiveTintColor: '#1E3A8A',
        tabBarInactiveTintColor: '#888',
        tabBarIcon: ({ color, size }) => {
          let iconName: keyof typeof Ionicons.glyphMap = 'home';
          if (route.name === 'Inicio') iconName = 'home';
          else if (route.name === 'Equipos') iconName = 'cube';
          else if (route.name === 'Perfil') iconName = 'person';
          return <Ionicons name={iconName} size={size} color={color} />;
        },
      })}
    >
      <Tab.Screen name='Inicio' component={HomeTab} />
      <Tab.Screen name='Equipos' component={EquipmentNavigator}/>
      <Tab.Screen name='Perfil' component={ProfileTab} />
    </Tab.Navigator>
  );
}