// 1. Importaciones necesarias para controlar la sesión real de Supabase.
import { useEffect, useState } from 'react';
import { View, ActivityIndicator, Linking, Alert, } from 'react-native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import type { Session } from '@supabase/supabase-js';

import LoginScreen from '../screens/LoginScreen';
import ForgotPasswordScreen from '../screens/ForgotPasswordScreen';
import ResetPasswordScreen from '../screens/ResetPasswordScreen';
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
  // Podemos precargar el correo escrito en Login.
  ForgotPassword: {
    emailInicial?: string;
  } | undefined;

  // Esta pantalla se abre únicamente desde el enlace de recuperación.
  ResetPassword: undefined;
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

  // 5. Indica que la sesión actual proviene de un enlace para recuperar contraseña.
const [passwordRecovery, setPasswordRecovery] = useState(false);


// Procesa el enlace enviado por Supabase para recuperar la contraseña.
// Soporta tanto PKCE (?code=...) como enlaces con access_token y refresh_token.
const procesarRecoveryUrl = async (url: string) => {
  if (!url.startsWith('techinventory://reset-password')) {
    return false;
  }

  try {
    console.log('URL de recuperación recibida:', url);

    // Algunos enlaces devuelven parámetros después de ? y otros después de #.
    const queryString = url.includes('?')
      ? url.split('?')[1]?.split('#')[0] ?? ''
      : '';

    const hashString = url.includes('#')
      ? url.split('#')[1] ?? ''
      : '';

    const params = new URLSearchParams(
      [queryString, hashString]
        .filter(Boolean)
        .join('&')
    );

    const errorDescription = params.get('error_description');

    if (errorDescription) {
      Alert.alert(
        'Enlace no válido',
        decodeURIComponent(errorDescription)
      );

      return true;
    }

    // Indicamos desde este momento que estamos dentro del flujo de recuperación.
    setPasswordRecovery(true);

    // OPCIÓN 1: Supabase puede devolver un código PKCE.
    const code = params.get('code');

    if (code) {
      const { error } =
        await supabase.auth.exchangeCodeForSession(code);

      if (error) {
        console.log(
          'Error al intercambiar código de recuperación:',
          error
        );

        setPasswordRecovery(false);

        Alert.alert(
          'Enlace no válido',
          'No fue posible validar el enlace de recuperación.'
        );
      }

      return true;
    }

    // OPCIÓN 2: Supabase puede devolver directamente los tokens.
    const accessToken = params.get('access_token');
    const refreshToken = params.get('refresh_token');

    if (accessToken && refreshToken) {
      const { error } = await supabase.auth.setSession({
        access_token: accessToken,
        refresh_token: refreshToken,
      });

      if (error) {
        console.log(
          'Error al crear sesión de recuperación:',
          error
        );

        setPasswordRecovery(false);

        Alert.alert(
          'Enlace no válido',
          'No fue posible validar el enlace de recuperación.'
        );
      }

      return true;
    }

    // Si no llegó ni code ni tokens, el enlace no puede crear una sesión.
    console.log(
      'El enlace no contiene code ni tokens de recuperación.'
    );

    setPasswordRecovery(false);

    Alert.alert(
      'Enlace no válido',
      'El enlace de recuperación está incompleto o ya no es válido.'
    );

    return true;
  } catch (error) {
    console.log(
      'Error al procesar enlace de recuperación:',
      error
    );

    setPasswordRecovery(false);

    Alert.alert(
      'Error',
      'No fue posible procesar el enlace de recuperación.'
    );

    return true;
  }
};

  useEffect(() => {
    // 5. Recuperamos la sesión existente cuando se abre la aplicación.
    const cargarSesionInicial = async () => {
      // Si la aplicación fue abierta desde el correo, procesamos primero ese enlace.
const initialUrl = await Linking.getInitialURL();

if (initialUrl) {
  await procesarRecoveryUrl(initialUrl);
}

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

    // Escuchamos enlaces recibidos mientras TechInventory ya está abierto.
const linkingSubscription = Linking.addEventListener(
  'url',
  ({ url }) => {
    void procesarRecoveryUrl(url);
  }
);

    // 6. Escuchamos login, logout y renovación de la sesión.
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, nextSession) => {

      
      
       // Detectamos que la sesión proviene de recuperación de contraseña.
  if (event === 'PASSWORD_RECOVERY') {
    setPasswordRecovery(true);
  }

  // Al cerrar la sesión temporal de recuperación regresamos al Login.
  if (event === 'SIGNED_OUT') {
    setPasswordRecovery(false);
  }

  // Desde aquí continúa exactamente tu lógica anterior.
  setSession(nextSession);

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
  linkingSubscription.remove();
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
      {passwordRecovery ? (
  // El enlace de correo tiene prioridad sobre el resto de la aplicación.
  <Stack.Screen
    name="ResetPassword"
    component={ResetPasswordScreen}
  />
) : session ? (
  <Stack.Screen
    name="MainTabs"
    component={TabsNavigator}
  />
) : (
  <>
    <Stack.Screen
      name="Login"
      component={LoginScreen}
    />

    <Stack.Screen
      name="ForgotPassword"
      component={ForgotPasswordScreen}
    />
  </>
)}
    </Stack.Navigator>
  );
}