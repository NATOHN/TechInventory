// 1. Importaciones.
import { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { NativeStackScreenProps } from '@react-navigation/native-stack';

import { useTheme } from '../../context/ThemeContext';
import { supabase } from '../../lib/supabase';
import CustomInput from '../../components/CustomInput';
import CustomButton from '../../components/CustomButton';
import type { ProfileStackParamList } from '../../navigation/ProfileNavigator';

// 2. Tipamos la nueva ruta dentro del navegador de Perfil.
type Props = NativeStackScreenProps<
  ProfileStackParamList,
  'ChangePasswordScreen'
>;

export default function ChangePasswordScreen({ navigation }: Props) {
  const { colors } = useTheme();

  // 3. Las contraseñas permanecen únicamente en el estado local de esta pantalla.
  // Nunca se almacenan en Redux ni AsyncStorage.
  const [passwordActual, setPasswordActual] = useState('');
  const [nuevaPassword, setNuevaPassword] = useState('');
  const [confirmarPassword, setConfirmarPassword] = useState('');
  const [guardando, setGuardando] = useState(false);

  // 4. Verifica primero la contraseña actual y luego actualiza la contraseña en Supabase Auth.
  const handleCambiarPassword = async () => {
    if (guardando) return;

    if (!passwordActual || !nuevaPassword || !confirmarPassword) {
      Alert.alert(
        'Campos requeridos',
        'Completa la contraseña actual, la nueva contraseña y su confirmación.'
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
        'La confirmación debe ser igual a la nueva contraseña.'
      );
      return;
    }

    if (passwordActual === nuevaPassword) {
      Alert.alert(
        'Contraseña sin cambios',
        'La nueva contraseña debe ser diferente de la contraseña actual.'
      );
      return;
    }

    try {
      setGuardando(true);

      // 5. Recuperamos desde Supabase Auth al usuario realmente autenticado.
      const {
        data: { user },
        error: userError,
      } = await supabase.auth.getUser();

      if (userError || !user?.email) {
        console.log(
          'Error al recuperar usuario para cambio de contraseña:',
          userError
        );

        Alert.alert(
          'Sesión no disponible',
          'No fue posible verificar tu sesión actual.'
        );
        return;
      }

      // 6. Verificamos la contraseña actual contra Supabase Auth.
      const { data: loginData, error: loginError } =
        await supabase.auth.signInWithPassword({
          email: user.email,
          password: passwordActual,
        });

      if (loginError || loginData.user?.id !== user.id) {
        Alert.alert(
          'Contraseña incorrecta',
          'La contraseña actual que ingresaste no es correcta.'
        );
        return;
      }

      // 7. La contraseña actual ya fue validada.
      // Ahora actualizamos únicamente la contraseña del mismo usuario.
      const { error: updateError } = await supabase.auth.updateUser({
        password: nuevaPassword,
      });

      if (updateError) {
        console.log(
          'Error de Supabase al cambiar contraseña:',
          updateError
        );

        Alert.alert(
          'No se pudo cambiar la contraseña',
          updateError.message
        );
        return;
      }

      // 8. Limpiamos los campos después de confirmar el cambio.
      setPasswordActual('');
      setNuevaPassword('');
      setConfirmarPassword('');

      Alert.alert(
        'Contraseña actualizada',
        'Tu contraseña fue cambiada correctamente.',
        [
          {
            text: 'Aceptar',
            onPress: () => navigation.goBack(),
          },
        ]
      );
    } catch (error) {
      console.log(
        'Error inesperado al cambiar contraseña:',
        error
      );

      Alert.alert(
        'Error',
        'No fue posible cambiar la contraseña en este momento.'
      );
    } finally {
      setGuardando(false);
    }
  };

  return (
    <SafeAreaView
      edges={['top', 'left', 'right']}
      style={[
        styles.safeArea,
        { backgroundColor: colors.background },
      ]}
    >
      <ScrollView
        style={{ backgroundColor: colors.background }}
        contentContainerStyle={styles.container}
        keyboardShouldPersistTaps="handled"
      >
        {/* 9. Encabezado. */}
        <View style={styles.header}>
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            disabled={guardando}
          >
            <Ionicons
              name="arrow-back"
              size={24}
              color={colors.text}
            />
          </TouchableOpacity>

          <View>
            <Text
              style={[
                styles.title,
                { color: colors.primary },
              ]}
            >
              Cambiar contraseña
            </Text>

            <Text
              style={[
                styles.subtitle,
                { color: colors.textSecondary },
              ]}
            >
              Actualiza la contraseña de tu cuenta
            </Text>
          </View>
        </View>

        {/* 10. Información de seguridad. */}
        <View
          style={[
            styles.infoCard,
            {
              backgroundColor: colors.surface,
              borderColor: colors.border,
            },
          ]}
        >
          <Ionicons
            name="shield-checkmark-outline"
            size={24}
            color={colors.primary}
          />

          <Text
            style={[
              styles.infoText,
              { color: colors.textSecondary },
            ]}
          >
            Por seguridad debes confirmar tu contraseña actual antes de establecer una nueva.
          </Text>
        </View>

        {/* 11. Formulario. */}
        <Text style={[styles.label, { color: colors.text }]}>
          Contraseña actual
        </Text>

        <CustomInput
          type="password"
          placeholder="Ingresa tu contraseña actual"
          value={passwordActual}
          onChange={setPasswordActual}
        />

        <Text style={[styles.label, { color: colors.text }]}>
          Nueva contraseña
        </Text>

        <CustomInput
          type="password"
          placeholder="Mínimo 8 caracteres"
          value={nuevaPassword}
          onChange={setNuevaPassword}
        />

        <Text style={[styles.label, { color: colors.text }]}>
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

            <Text style={{ color: colors.textSecondary }}>
              Actualizando contraseña...
            </Text>
          </View>
        ) : (
          <CustomButton
            title="Cambiar contraseña"
            onPress={handleCambiarPassword}
          />
        )}

        <View style={{ height: 30 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1 },
  container: {
    paddingHorizontal: 16,
    paddingTop: 20,
    paddingBottom: 30,
  },

  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 24,
  },

  title: {
    fontSize: 22,
    fontWeight: 'bold',
  },

  subtitle: {
    fontSize: 13,
    marginTop: 2,
  },

  infoCard: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderRadius: 12,
    padding: 14,
    marginBottom: 24,
    gap: 12,
  },

  infoText: {
    flex: 1,
    fontSize: 13,
    lineHeight: 18,
  },

  label: {
    fontSize: 14,
    fontWeight: '700',
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