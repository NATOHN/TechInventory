import { createNativeStackNavigator } from '@react-navigation/native-stack';
import LoginScreen from '../screens/LoginScreen';
import TabsNavigator from './TabsNavigator';

export type RootStackParamList = {
  Login: undefined;
  MainTabs: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function StackNavigator() {
  return (
    <Stack.Navigator initialRouteName='Login' screenOptions={{ headerShown: false }}>
      <Stack.Screen name='Login' component={LoginScreen} />
      <Stack.Screen name='MainTabs' component={TabsNavigator} />
    </Stack.Navigator>
  );
}