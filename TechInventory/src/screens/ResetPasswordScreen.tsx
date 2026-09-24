// 1. Importaciones.
import { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';

import CustomInput from '../components/CustomInput';
import CustomButton from '../components/CustomButton';
import { useTheme } from '../context/ThemeContext';
import { supabase } from '../lib/supabase';

export default function ResetPasswordScreen() {
  const { colors } = useTheme();

  // 2. La contraseña permanece únicamente en esta pantalla.
  const [nuevaPassword, setNuevaPassword] = useState('');
  const [confirmarPassword, setConfirmarPassword] =
    useState('');
  const [guardando, setGuardando] = useState(false);

  // 3. Actualiza la contraseña utilizando la sesión de recuperación.
  const handleActualizarPassword = async () => {
    if (guardando) return;

    if (!nuevaPassword || !confirmarPassword) {
      Alert.alert(
        'Campos requeridos',
        'Escribe y confirma tu nueva contraseña.'
      );
      return;
    }

    if (nuevaPassword.length < 8) {
      Alert.alert(
        'Contraseña muy corta',
        'La nueva contraseña debe contener al menos 8 caracteres.'
      );
      return;
    }

    if (nuevaPassword !== confirmarPassword) {
      Alert.alert(
        'Las contraseñas no coinciden',
        'Ambas contraseñas deben ser iguales.'
      );
      return;
    }

    try {
      setGuardando(true);

      // La sesión utilizada aquí proviene del enlace enviado por Supabase.
      const { error } = await supabase.auth.updateUser({
        password: nuevaPassword,
      });

      if (error) {
        console.log(
          'Error de Supabase al restablecer contraseña:',
          error
        );

        Alert.alert(
          'No se pudo actualizar la contraseña',
          error.message
        );
        return;
      }

      setNuevaPassword('');
      setConfirmarPassword('');

      Alert.alert(
        'Contraseña actualizada',
        'Tu contraseña fue restablecida correctamente. Inicia sesión con tu nueva contraseña.',
        [
          {
            text: 'Aceptar',
            onPress: async () => {
              // Cerramos la sesión temporal de recuperación
              // para regresar de forma segura al Login.
              await supabase.auth.signOut();
            },
          },
        ]
      );
    } catch (error) {
      console.log(
        'Error inesperado al restablecer contraseña:',
        error
      );

      Alert.alert(
        'Error',
        'No fue posible actualizar la contraseña.'
      );
    } finally {
      setGuardando(false);
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
        <View
          style={[
            styles.iconContainer,
            { backgroundColor: colors.surface },
          ]}
        >
          <Ionicons
            name="lock-open-outline"
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
          Nueva contraseña
        </Text>

        <Text
          style={[
            styles.description,
            { color: colors.textSecondary },
          ]}
        >
          Escribe la nueva contraseña que utilizarás para ingresar a TechInventory.
        </Text>

        <Text
          style={[
            styles.label,
            { color: colors.text },
          ]}
        >
          Nueva contraseña
        </Text>

        <CustomInput
          type="password"
          placeholder="Mínimo 8 caracteres"
          value={nuevaPassword}
          onChange={setNuevaPassword}
        />

        <Text
          style={[
            styles.label,
            { color: colors.text },
          ]}
        >
          Confirmar nueva contraseña
        </Text>

        <CustomInput
          type="password"
          placeholder="Repite la nueva contraseña"
          value={confirmarPassword}
          onChange={setConfirmarPassword}
        />

        {guardando ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator
              size="small"
              color={colors.primary}
            />

            <Text
              style={{ color: colors.textSecondary }}
            >
              Actualizando contraseña...
            </Text>
          </View>
        ) : (
          <CustomButton
            title="Guardar nueva contraseña"
            onPress={handleActualizarPassword}
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
    justifyContent: 'center',
    paddingHorizontal: 24,
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