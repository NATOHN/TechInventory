// 1. Importaciones
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import CustomButton from '../../components/CustomButton';
import { navigationRef } from '../../navigation/NavigationService';
import { useTheme } from '../../context/ThemeContext';
import { useLanguage } from '../../context/LanguageContext';
import { useAppSelector } from '../../redux/hooks';

export default function ProfileScreen({ navigation }: any) {
  // 2. Obtenemos la paleta de colores actual desde ThemeContext.
  const { colors } = useTheme();

  // 3. Obtenemos la función t desde LanguageContext para mostrar los textos traducidos.
  const { t } = useLanguage();

  // 4. Buscamos al usuario que representa la sesion actual dentro de Redux.
  const currentUser = useAppSelector((state) =>
    state.users.users.find((u) => u.id === state.users.currentUserId)
  );

  // 5. Texto del rol mostrado bajo el nombre, segun el rol real del usuario actual.
  const rolTexto = currentUser?.rol === 'administrador' ? 'Administrador' : 'Técnico de mantenimiento';

  // 6. Cierra la sesion y regresa a la pantalla de Login.
  const handleLogout = () => {
    if (navigationRef.isReady()) {
      navigationRef.reset({ index: 0, routes: [{ name: 'Login' }] });
    }
  };

  return (
    // 7. SafeAreaView evita que el contenido quede pegado a los bordes del dispositivo.
    <SafeAreaView edges={['top', 'left', 'right']} style={[styles.safeArea, { backgroundColor: colors.background }]}>
      <ScrollView contentContainerStyle={[styles.container, { backgroundColor: colors.background }]}>
        <Ionicons name="person-circle" size={100} color={colors.primary} />
        <Text style={[styles.name, { color: colors.text }]}>{t('profile')}</Text>
        <Text style={[styles.role, { color: colors.textSecondary }]}>{rolTexto}</Text>

        {/* 8. Acceso a la pantalla de Configuracion, donde viven administracion, aplicacion y datos */}
        <TouchableOpacity
          style={[styles.configRow, { backgroundColor: colors.surface, borderColor: colors.border }]}
          onPress={() => navigation.navigate('ConfigurationScreen')}
        >
          <Ionicons name="settings-outline" size={22} color={colors.primary} />
          <Text style={[styles.configText, { color: colors.text }]}>Configuración</Text>
          <Ionicons name="chevron-forward" size={20} color={colors.textSecondary} />
        </TouchableOpacity>

        <CustomButton title={t('logout')} onPress={handleLogout} variant="danger" />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1 },
  container: { flexGrow: 1, alignItems: 'center', justifyContent: 'center', padding: 24 },
  name: { fontSize: 24, fontWeight: 'bold', marginTop: 12 },
  role: { fontSize: 14, marginBottom: 32 },
  configRow: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    borderWidth: 1,
    borderRadius: 12,
    paddingVertical: 14,
    paddingHorizontal: 16,
    marginBottom: 24,
  },
  configText: { flex: 1, fontSize: 15, fontWeight: '600' },
});