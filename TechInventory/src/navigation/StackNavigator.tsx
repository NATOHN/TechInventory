// 1. Importaciones necesarias para controlar la sesión real de Supabase.
import { useEffect, useState } from 'react';
import { View, ActivityIndicator } from 'react-native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import type { Session } from '@supabase/supabase-js';

import LoginScreen from '../screens/LoginScreen';
import TabsNavigator from './TabsNavigator';

import { supabase } from '../lib/supabase';
import { useAppDispatch } from '../redux/hooks';
import {
  cargarUsuariosDesdeSupabase,
  establecerUsuarioActual,
  limpiarUsuarios,
} from '../redux/usersSlice';

// 2. Mantenemos las mismas rutas principales de TechInventory.
export type RootStackParamList = {
  Login: undefined;
  MainTabs: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function StackNavigator() {
  const dispatch = useAppDispatch();

  // 3. Guardamos la sesión que realmente administra Supabase Auth.
  const [session, setSession] = useState<Session | null>(null);

  // 4. Evita mostrar Login momentáneamente mientras Supabase
  // comprueba si existe una sesión persistida en AsyncStorage.
  const [checkingSession, setCheckingSession] = useState(true);

  useEffect(() => {
    // 5. Recuperamos la sesión existente cuando se abre la aplicación.
    const cargarSesionInicial = async () => {
      const { data, error } = await supabase.auth.getSession();

      if (error) {
        console.log('Error al recuperar la sesión de Supabase:', error.message);
      }

      const currentSession = data.session;

      setSession(currentSession);

      // El UUID del usuario autenticado será también el currentUserId de Redux.
      dispatch(
        establecerUsuarioActual(currentSession?.user.id ?? null)
      );

      if (currentSession) {
        try {
          // Cargamos los perfiles reales para Dashboard, Perfil y Mantenimiento.
          await dispatch(cargarUsuariosDesdeSupabase()).unwrap();
        } catch (error) {
          console.log('Error al cargar usuarios después de recuperar sesión:', error);
        }
      } else {
        dispatch(limpiarUsuarios());
      }

      setCheckingSession(false);
    };

    void cargarSesionInicial();

    // 6. Escuchamos login, logout y renovación de la sesión.
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, nextSession) => {
      setSession(nextSession);

      dispatch(
        establecerUsuarioActual(nextSession?.user.id ?? null)
      );

      if (nextSession) {
        // Redux se actualiza con los perfiles reales después del login.
        void dispatch(cargarUsuariosDesdeSupabase())
          .unwrap()
          .catch((error) => {
            console.log('Error al actualizar los usuarios de Supabase:', error);
          });
      } else {
        dispatch(limpiarUsuarios());
      }

      setCheckingSession(false);
    });

    // 7. Eliminamos el listener cuando el navegador se desmonta.
    return () => {
      subscription.unsubscribe();
    };
  }, [dispatch]);

  // 8. Mientras Supabase determina si existe una sesión,
  // mostramos únicamente un indicador para evitar parpadeos entre pantallas.
  if (checkingSession) {
    return (
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    // 9. Solo existe Login cuando no hay sesión.
    // Cuando Supabase autentica al usuario, MainTabs sustituye automáticamente a Login.
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      {session ? (
        <Stack.Screen name="MainTabs" component={TabsNavigator} />
      ) : (
        <Stack.Screen name="Login" component={LoginScreen} />
      )}
    </Stack.Navigator>
  );
}