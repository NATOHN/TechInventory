// 1. Importaciones
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Switch } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../context/ThemeContext';
import { useLanguage } from '../../context/LanguageContext';
import { useAppSelector } from '../../redux/hooks';



export default function ConfigurationScreen({ navigation }: any) {
  // 3. Obtenemos la paleta de colores actual desde ThemeContext.
  const { colors } = useTheme();

  // 4. Obtenemos del ThemeContext el modo oscuro actual y su funcion para alternarlo.
  const { isDark, toggleTheme } = useTheme();

  // 5. Obtenemos la informacion del idioma desde LanguageContext.
  // Obtenemos idioma, cambio de idioma y traducciones.
const { language, changeLanguage, t } = useLanguage();

  // 6. Buscamos al usuario que representa la sesion actual dentro de Redux.
  const currentUser = useAppSelector((state) =>
    state.users.users.find((u) => u.id === state.users.currentUserId)
  );

  // 7. La seccion de Administracion solo se muestra a usuarios con rol administrador.
  const esAdministrador = currentUser?.rol === 'administrador';

  return (
    <SafeAreaView edges={['top', 'left', 'right']} style={[styles.safeArea, { backgroundColor: colors.background }]}>
      <ScrollView style={{ backgroundColor: colors.background }} contentContainerStyle={styles.container}>

        {/* 8. Encabezado con boton de regreso, titulo e indicador del rol actual */}
        <View style={styles.header}>
          <View style={styles.headerLeft}>
            <TouchableOpacity onPress={() => navigation.goBack()}>
              <Ionicons name="arrow-back" size={24} color={colors.text} />
            </TouchableOpacity>
            <Text style={[styles.title, { color: colors.primary }]}>{t('configurationTitle')}</Text>
          </View>

          <View style={[styles.roleBadge, { backgroundColor: colors.primary }]}>
            <Ionicons name="person-circle-outline" size={14} color="#FFFFFF" />
            <Text style={styles.roleBadgeText}>
  {esAdministrador
    ? t('administratorRole')
    : t('technicianShortRole')}
</Text>
          </View>
        </View>

        {/* 9. Seccion Administracion: solo visible para administradores */}
        {esAdministrador && (
          <>
            <Text style={[styles.sectionTitle, { color: colors.text }]}>{t('configurationAdministrationSection')}</Text>

            <TouchableOpacity
              style={[styles.row, { backgroundColor: colors.surface, borderColor: colors.border }]}
              onPress={() => navigation.navigate('UsersScreen')}
            >
              <Ionicons name="people-outline" size={22} color={colors.primary} />
              <View style={styles.rowText}>
                <Text style={[styles.rowTitle, { color: colors.text }]}>{t('configurationUsersTitle')}</Text>
                <Text style={[styles.rowSubtitle, { color: colors.textSecondary }]}>{t('configurationUsersDescription')}</Text>
              </View>
              <Ionicons name="chevron-forward" size={20} color={colors.textSecondary} />
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.row, { backgroundColor: colors.surface, borderColor: colors.border }]}
              // Abre la administración de sucursales y departamentos.
              onPress={() => navigation.navigate('LocationsScreen')}
            >
              <Ionicons name="location-outline" size={22} color={colors.primary} />
              <View style={styles.rowText}>
                <Text style={[styles.rowTitle, { color: colors.text }]}>{t('configurationLocationsTitle')}</Text>
                <Text style={[styles.rowSubtitle, { color: colors.textSecondary }]}> {t('configurationLocationsDescription')}</Text>
              </View>
              <Ionicons name="chevron-forward" size={20} color={colors.textSecondary} />
            </TouchableOpacity>

            {/* Administración de empleados disponible únicamente para administradores. */}
            <TouchableOpacity
              style={[styles.row, { backgroundColor: colors.surface, borderColor: colors.border }]}
              onPress={() => navigation.navigate('EmployeesScreen')}
            >
              <Ionicons name="id-card-outline" size={22} color={colors.primary} />

              <View style={styles.rowText}>
                <Text style={[styles.rowTitle, { color: colors.text }]}>
                  {t('configurationEmployeesTitle')}
                </Text>

                <Text style={[styles.rowSubtitle, { color: colors.textSecondary }]}>
                  {t('configurationEmployeesDescription')}
                </Text>
              </View>

              <Ionicons name="chevron-forward" size={20} color={colors.textSecondary} />
            </TouchableOpacity>


          </>
        )}




        {/* 10. Seccion Aplicacion: preferencias visibles para cualquier rol */}
        <Text style={[styles.sectionTitle, { color: colors.text }]}>{t('configurationApplicationSection')}</Text>

        <View style={[styles.row, { backgroundColor: colors.surface, borderColor: colors.border }]}>
          <Ionicons name="globe-outline" size={22} color={colors.primary} />
          <View style={styles.rowText}>
            <Text style={[styles.rowTitle, { color: colors.text }]}>{t('languageLabel')}</Text>
          </View>
          <View style={styles.languageOptions}>
            <TouchableOpacity onPress={() => changeLanguage('es')}>
              <Text style={[styles.languageOption, { color: language === 'es' ? colors.primary : colors.textSecondary }]}>ES</Text>
            </TouchableOpacity>
            <Text style={{ color: colors.textSecondary }}> | </Text>
            <TouchableOpacity onPress={() => changeLanguage('en')}>
              <Text style={[styles.languageOption, { color: language === 'en' ? colors.primary : colors.textSecondary }]}>EN</Text>
            </TouchableOpacity>
          </View>
        </View>

        <View style={[styles.row, { backgroundColor: colors.surface, borderColor: colors.border }]}>
          <Ionicons name="moon-outline" size={22} color={colors.primary} />
          <View style={styles.rowText}>
            <Text style={[styles.rowTitle, { color: colors.text }]}>
  {t('configurationThemeTitle')}
</Text>

<Text style={[styles.rowSubtitle, { color: colors.textSecondary }]}>
  {t('configurationThemeDescription')}
</Text>
          </View>
          <Switch
            value={isDark}
            onValueChange={toggleTheme}
            trackColor={{ false: '#D1D5DB', true: colors.primary }}
            thumbColor="#FFFFFF"
          />
        </View>

        {/* Cuenta: disponible para administrador y técnico. */}
<Text style={[styles.sectionTitle, { color: colors.text }]}>
  {t('configurationAccountSection')}
</Text>

<TouchableOpacity
  style={[
    styles.row,
    {
      backgroundColor: colors.surface,
      borderColor: colors.border,
    },
  ]}
  onPress={() => navigation.navigate('ChangePasswordScreen')}
>
  <Ionicons
    name="key-outline"
    size={22}
    color={colors.primary}
  />

  <View style={styles.rowText}>
    <Text
  style={[
    styles.rowTitle,
    { color: colors.text },
  ]}
>
  {t('configurationChangePasswordTitle')}
</Text>

    <Text
      style={[
        styles.rowSubtitle,
        { color: colors.textSecondary },
      ]}
    >
      {t('configurationChangePasswordDescription')}
    </Text>
  </View>

  <Ionicons
    name="chevron-forward"
    size={20}
    color={colors.textSecondary}
  />
</TouchableOpacity>
        <View style={{ height: 30 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1 },
  container: { paddingHorizontal: 16, paddingTop: 20, paddingBottom: 30 },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  headerLeft: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  title: { fontSize: 22, fontWeight: 'bold' },
  roleBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 20,
  },
  roleBadgeText: { color: '#FFFFFF', fontSize: 12, fontWeight: '700' },
  sectionTitle: { fontSize: 15, fontWeight: '700', marginTop: 10, marginBottom: 10 },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    borderWidth: 1,
    borderRadius: 12,
    padding: 14,
    marginBottom: 10,
  },
  rowText: { flex: 1 },
  rowTitle: { fontSize: 14, fontWeight: '700' },
  rowSubtitle: { fontSize: 12, marginTop: 2 },
  languageOptions: { flexDirection: 'row', alignItems: 'center' },
  languageOption: { fontSize: 14, fontWeight: 'bold' },
});