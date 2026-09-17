import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import { RouteProp } from '@react-navigation/native';
import HomeTab from '../screens/tabs/HomeTab';
import ProfileNavigator from './ProfileNavigator';
import EquipmentNavigator from './EquipmentNavigator';
import MaintenanceNavigator from './MaintenanceNavigator';
import { useTheme } from '../context/ThemeContext';
import { useLanguage } from '../context/LanguageContext';

export type TabsParamList = {
  Inicio: undefined;
  Perfil: undefined;
  Equipos: undefined;
  Mantenimiento: undefined;
};

const Tab = createBottomTabNavigator<TabsParamList>();

type TabRouteProp = RouteProp<TabsParamList, keyof TabsParamList>;

export default function TabsNavigator() {
  //Obtenemos la paleta de colores actual desde ThemeContext.
  const { colors } = useTheme();

  //Obtenemos la función t desde LanguageContext
  const { t } = useLanguage();

  return (
    <Tab.Navigator
      screenOptions={({ route }: { route: TabRouteProp }) => ({
        headerShown: false,
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.textSecondary,
        tabBarStyle: {
          backgroundColor: colors.surface,
          borderTopColor: colors.border,
        },
         tabBarIcon: ({ color, size }) => {
          let iconName: keyof typeof Ionicons.glyphMap = 'home';
          if (route.name === 'Inicio') iconName = 'home';
          else if (route.name === 'Equipos') iconName = 'cube';
          // 1. Ícono de llave inglesa (construct = llave + destornillador cruzados) para Mantenimiento.
          else if (route.name === 'Mantenimiento') iconName = 'construct';
          else if (route.name === 'Perfil') iconName = 'person';
          return <Ionicons name={iconName} size={size} color={color} />;
        },
      })}
    >
      <Tab.Screen
        name='Inicio'
        component={HomeTab}
        options={{
          tabBarLabel: t("homeTab"),
        }} 
      />

      <Tab.Screen
        name='Equipos'
        component={EquipmentNavigator}
        options={{
          tabBarLabel: t("equipmentTab"),
        }}
      />

      <Tab.Screen
      name='Mantenimiento'
      component={MaintenanceNavigator}
      options={{
        tabBarLabel: t("maintenanceTab"),
      }}
      />
      
      <Tab.Screen
  name='Perfil'
  component={ProfileNavigator}
  options={{
    tabBarLabel: t("profileTab"),
  }}
/>

    </Tab.Navigator>
  );
}