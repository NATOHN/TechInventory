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
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { NativeStackScreenProps } from '@react-navigation/native-stack';

import { useTheme } from '../../context/ThemeContext';
import { useLanguage } from '../../context/LanguageContext';
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
  const { t } = useLanguage();

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
        t('changePasswordRequiredTitle'),
        t('changePasswordRequiredMessage')
      );
      return;
    }

    if (nuevaPassword.length < 8) {
      Alert.alert(
        t('changePasswordShortTitle'),
        t('changePasswordShortMessage')
      );
      return;
    }

    if (nuevaPassword !== confirmarPassword) {
      Alert.alert(
        t('changePasswordMismatchTitle'),
        t('changePasswordMismatchMessage')
      );
      return;
    }

    if (passwordActual === nuevaPassword) {
      Alert.alert(
        t('changePasswordSameTitle'),
        t('changePasswordSameMessage')
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
          t('changePasswordSessionTitle'),
          t('changePasswordSessionMessage')
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
          t('changePasswordIncorrectTitle'),
          t('changePasswordIncorrectMessage')
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
          t('changePasswordErrorTitle'),
          t('changePasswordErrorMessage')
        );
        return;
      }

      // 8. Limpiamos los campos después de confirmar el cambio.
      setPasswordActual('');
      setNuevaPassword('');
      setConfirmarPassword('');

      Alert.alert(
        t('changePasswordSuccessTitle'),
        t('changePasswordSuccessMessage'),
        [
          {
            text: t('commonAccept'),
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
        t('changePasswordErrorTitle'),
        t('changePasswordErrorMessage')
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
      <KeyboardAvoidingView
  style={styles.keyboardView}
  behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
>
 <ScrollView
  style={{ backgroundColor: colors.background }}
  contentContainerStyle={styles.container}
  keyboardShouldPersistTaps="handled"
  keyboardDismissMode="on-drag"
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
              {t('changePasswordTitle')}
            </Text>

            <Text
              style={[
                styles.subtitle,
                { color: colors.textSecondary },
              ]}
            >
              {t('changePasswordSubtitle')}
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
            {t('changePasswordSecurityMessage')}
          </Text>
        </View>

        {/* 11. Formulario. */}
        <Text style={[styles.label, { color: colors.text }]}>
          {t('changePasswordCurrentLabel')}
        </Text>

        <CustomInput
          type="password"
          placeholder={t('changePasswordCurrentPlaceholder')}
          value={passwordActual}
          onChange={setPasswordActual}
        />

        <Text style={[styles.label, { color: colors.text }]}>
          {t('changePasswordNewLabel')}
        </Text>

        <CustomInput
          type="password"
          placeholder={t('changePasswordNewPlaceholder')}
          value={nuevaPassword}
          onChange={setNuevaPassword}
        />

        <Text style={[styles.label, { color: colors.text }]}>
          {t('changePasswordConfirmLabel')}
        </Text>

        <CustomInput
          type="password"
          placeholder={t('changePasswordConfirmPlaceholder')}
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
              {t('changePasswordUpdating')}
            </Text>
          </View>
        ) : (
          <CustomButton
            title={t('changePasswordButton')}
            onPress={handleCambiarPassword}
          />
        )}

        <View style={{ height: 30 }} />
      </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1 },
  container: {
    paddingHorizontal: 16,
    paddingTop: 20,
    paddingBottom: 120,
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

  keyboardView: {
  flex: 1,
},
});