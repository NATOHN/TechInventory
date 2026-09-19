// 1. Importaciones.
import { useState } from 'react';
import { View, Text, StyleSheet, Alert } from 'react-native';

import CustomInput from '../components/CustomInput';
import CustomButton from '../components/CustomButton';

import { useLanguage } from '../context/LanguageContext';
import { useTheme } from '../context/ThemeContext';
import { supabase } from '../lib/supabase';

export default function LoginScreen() {
  // 2. Estados utilizados únicamente por el formulario de inicio de sesión.
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const { colors } = useTheme();
  const { t } = useLanguage();

  // 3. Autenticamos realmente contra Supabase utilizando correo y contraseña.
  const handleLogin = async () => {
    // Evitamos ejecutar dos inicios de sesión al mismo tiempo.
    if (loading) return;

    const correoNormalizado = email.trim().toLowerCase();

    if (!correoNormalizado.includes('@')) {
      Alert.alert('Correo inválido', 'Ingresa un correo electrónico válido.');
      return;
    }

    if (password.length < 6) {
      Alert.alert(
        'Contraseña inválida',
        'La contraseña debe contener al menos 6 caracteres.'
      );
      return;
    }

    try {
      setLoading(true);

      // Supabase Auth valida las credenciales y crea la sesión.
      // StackNavigator detectará automáticamente el cambio de sesión.
      const { error } = await supabase.auth.signInWithPassword({
        email: correoNormalizado,
        password,
      });

      if (error) {
        Alert.alert(
          'No se pudo iniciar sesión',
          'Verifica tu correo y contraseña e intenta nuevamente.'
        );
      }
    } catch (error) {
      console.log('Error inesperado durante el inicio de sesión:', error);

      Alert.alert(
        'Error',
        'No fue posible iniciar sesión en este momento.'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <View
      style={[
        styles.container,
        { backgroundColor: colors.background },
      ]}
    >
      {/* 4. Identidad principal de la aplicación. */}
      <Text style={[styles.title, { color: colors.primary }]}>
        TechInventory
      </Text>

      <Text
        style={[
          styles.subtitle,
          { color: colors.textSecondary },
        ]}
      >
        {t('loginSubtitle')}
      </Text>

      {/* 5. El correo será la identidad utilizada por Supabase Auth. */}
      <CustomInput
        type="email"
        placeholder={t('emailPlaceholder')}
        value={email}
        onChange={setEmail}
      />

      {/* 6. La contraseña se envía solamente a Supabase Auth.
      Nunca se almacena dentro de Redux. */}
      <CustomInput
        type="password"
        placeholder={t('passwordPlaceholder')}
        value={password}
        onChange={setPassword}
      />

      <CustomButton
        title={loading ? 'Ingresando...' : t('loginButton')}
        onPress={handleLogin}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 24,
  },
  title: {
    fontSize: 30,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 14,
    textAlign: 'center',
    marginBottom: 24,
  },
});