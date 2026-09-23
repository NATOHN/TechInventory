// 1. Importaciones.
import { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Alert,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { NativeStackScreenProps } from '@react-navigation/native-stack';

import CustomInput from '../components/CustomInput';
import CustomButton from '../components/CustomButton';
import { useTheme } from '../context/ThemeContext';
import { supabase } from '../lib/supabase';
import type { RootStackParamList } from '../navigation/StackNavigator';

// 2. Permitimos recibir el correo escrito previamente en Login.
type Props = NativeStackScreenProps<
  RootStackParamList,
  'ForgotPassword'
>;

export default function ForgotPasswordScreen({
  navigation,
  route,
}: Props) {
  const { colors } = useTheme();

  // 3. Si el usuario ya escribió su correo en Login, lo reutilizamos.
  const [email, setEmail] = useState(
    route.params?.emailInicial ?? ''
  );
  const [enviando, setEnviando] = useState(false);

  // 4. Solicita a Supabase el envío del correo de recuperación.
  const handleEnviarRecuperacion = async () => {
    if (enviando) return;

    const correoNormalizado = email.trim().toLowerCase();

    if (
      !correoNormalizado ||
      !correoNormalizado.includes('@')
    ) {
      Alert.alert(
        'Correo inválido',
        'Ingresa un correo electrónico válido.'
      );
      return;
    }

    try {
      setEnviando(true);

      const { error } =
        await supabase.auth.resetPasswordForEmail(
          correoNormalizado,
          {
            // Después de validar el enlace, Supabase regresará a TechInventory.
            redirectTo: 'techinventory://reset-password',
          }
        );

      if (error) {
        console.log(
          'Error de Supabase al enviar recuperación:',
          error
        );

        Alert.alert(
          'No se pudo enviar el correo',
          error.message
        );
        return;
      }

      // No indicamos si el correo realmente pertenece a una cuenta.
      Alert.alert(
        'Revisa tu correo',
        'Si existe una cuenta asociada a ese correo, recibirás un enlace para restablecer tu contraseña.',
        [
          {
            text: 'Aceptar',
            onPress: () => navigation.goBack(),
          },
        ]
      );
    } catch (error) {
      console.log(
        'Error inesperado al solicitar recuperación:',
        error
      );

      Alert.alert(
        'Error',
        'No fue posible solicitar la recuperación en este momento.'
      );
    } finally {
      setEnviando(false);
    }
  };

  return (
    <SafeAreaView
      style={[
        styles.safeArea,
        { backgroundColor: colors.background },
      ]}
    >
      <View style={styles.container}>
        {/* 5. Navegación hacia Login. */}
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
          disabled={enviando}
        >
          <Ionicons
            name="arrow-back"
            size={24}
            color={colors.text}
          />
        </TouchableOpacity>

        <View
          style={[
            styles.iconContainer,
            { backgroundColor: colors.surface },
          ]}
        >
          <Ionicons
            name="key-outline"
            size={34}
            color={colors.primary}
          />
        </View>

        <Text
          style={[
            styles.title,
            { color: colors.primary },
          ]}
        >
          Recuperar contraseña
        </Text>

        <Text
          style={[
            styles.description,
            { color: colors.textSecondary },
          ]}
        >
          Ingresa el correo asociado a tu cuenta. Te enviaremos un enlace para crear una nueva contraseña.
        </Text>

        <Text
          style={[
            styles.label,
            { color: colors.text },
          ]}
        >
          Correo electrónico
        </Text>

        <CustomInput
          type="email"
          placeholder="correo@ejemplo.com"
          value={email}
          onChange={setEmail}
        />

        {enviando ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator
              size="small"
              color={colors.primary}
            />

            <Text
              style={{ color: colors.textSecondary }}
            >
              Enviando correo...
            </Text>
          </View>
        ) : (
          <CustomButton
            title="Enviar enlace de recuperación"
            onPress={handleEnviarRecuperacion}
          />
        )}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1 },

  container: {
    flex: 1,
    paddingHorizontal: 24,
    justifyContent: 'center',
  },

  backButton: {
    position: 'absolute',
    top: 20,
    left: 24,
    padding: 5,
  },

  iconContainer: {
    width: 64,
    height: 64,
    borderRadius: 32,
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'center',
    marginBottom: 15,
  },

  title: {
    fontSize: 26,
    fontWeight: 'bold',
    textAlign: 'center',
  },

  description: {
    fontSize: 14,
    lineHeight: 20,
    textAlign: 'center',
    marginTop: 8,
    marginBottom: 26,
  },

  label: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 7,
  },

  loadingContainer: {
    minHeight: 50,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
  },
});