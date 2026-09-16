// 1. Importaciones
import { useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../context/ThemeContext';
import { useLanguage } from '../../context/LanguageContext';
import { useAppSelector } from '../../redux/hooks';
import MaintenanceCard from '../../components/MaintenanceCard';
import { Maintenance } from '../../redux/maintenanceSlice';

// 2. Definimos los filtros disponibles para la lista de mantenimientos.
type FilterType = 'todos' | 'en_proceso' | 'finalizado';

export default function MaintenanceScreen({ navigation }: any) {
  // 3. Obtenemos la paleta de colores actual desde ThemeContext.
  const { colors } = useTheme();

  // 4. Obtenemos la función t desde LanguageContext para mostrar los textos traducidos.
  const { t } = useLanguage();

  // 5. Estado local que controla que filtro esta activo actualmente.
  const [filter, setFilter] = useState<FilterType>('todos');

  // 6. Leemos el arreglo completo de mantenimientos desde Redux.
  const maintenances = useAppSelector((state) => state.maintenance.maintenances);

  // 7. Filtramos los mantenimientos segun la pestana seleccionada.
  const filteredMaintenances = maintenances.filter((m: Maintenance) => {
    if (filter === 'todos') return true;
    return m.status === filter;
  });

  // 8. Definimos las pestañas visibles junto a su etiqueta traducida.
  const tabs: { key: FilterType; label: string }[] = [
    { key: 'todos', label: t('maintenanceAll') },
    { key: 'en_proceso', label: t('maintenanceInProgress') },
    { key: 'finalizado', label: t('maintenanceCompleted') },
  ];

  return (
    <SafeAreaView edges={['top', 'left', 'right']} style={[styles.safeArea, { backgroundColor: colors.background }]}>
      <View style={styles.screen}>
        <View style={[styles.container, { backgroundColor: colors.background }]}>

          {/* 9. Encabezado con solo el titulo, el boton de registrar ahora vive en el footer */}
          <View style={styles.header}>
            <Text style={[styles.title, { color: colors.primary }]}>{t('maintenanceTitle')}</Text>
          </View>

          {/* 10. Fila de pestañas para filtrar por estado */}
          <View style={styles.tabsRow}>
            {tabs.map((tab) => {
              const isActive = filter === tab.key;
              return (
                <TouchableOpacity
                  key={tab.key}
                  style={[
                    styles.tab,
                    {
                      backgroundColor: isActive ? colors.primary : colors.surface,
                      borderColor: colors.border,
                    },
                  ]}
                  onPress={() => setFilter(tab.key)}
                >
                  <Text style={[styles.tabText, { color: isActive ? 'white' : colors.text }]}>
                    {tab.label}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>

          {/* 11. Lista de mantenimientos filtrados, o mensaje vacio si no hay ninguno */}
          {filteredMaintenances.length === 0 ? (
            <View style={styles.emptyContainer}>
              <Ionicons name="build-outline" size={48} color={colors.textSecondary} />
              <Text style={[styles.emptyTitle, { color: colors.text }]}>{t('noMaintenancesTitle')}</Text>
              <Text style={[styles.emptyMessage, { color: colors.textSecondary }]}>
                {t('noMaintenancesMessage')}
              </Text>
            </View>
          ) : (
            <FlatList
              data={filteredMaintenances}
              keyExtractor={(item) => item.id}
              renderItem={({ item }) => <MaintenanceCard maintenance={item} />}
              contentContainerStyle={styles.list}
            />
          )}
        </View>

        {/* 12. Pie fijo con el boton principal, mismo estilo que en Equipos */}
        <View style={[styles.footer, { backgroundColor: colors.background, borderTopColor: colors.border }]}>
          <TouchableOpacity
            style={[styles.bottomRegisterButton, { backgroundColor: colors.primary }]}
            onPress={() => navigation.navigate('NewMaintenanceScreen')}
          >
            <Ionicons name="add" size={22} color={colors.background} />
            <Text style={[styles.bottomRegisterButtonText, { color: colors.background }]}>
              {t('newMaintenanceButton')}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1 },
  screen: { flex: 1 },
  container: { flex: 1, padding: 16 },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  title: { fontSize: 22, fontWeight: 'bold' },
  tabsRow: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 16,
  },
  tab: {
    flex: 1,
    borderWidth: 1,
    borderRadius: 8,
    paddingVertical: 8,
    alignItems: 'center',
  },
  tabText: { fontSize: 13, fontWeight: '600' },
  list: { paddingBottom: 20 },
  emptyContainer: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: 8, marginTop: 60 },
  emptyTitle: { fontSize: 16, fontWeight: '600' },
  emptyMessage: { fontSize: 13, textAlign: 'center', paddingHorizontal: 30 },
  // 13. Pie inferior fijo, mismo patron que EquipmentListScreen.
  footer: {
    paddingHorizontal: 16,
    paddingTop: 8,
    paddingBottom: 8,
    borderTopWidth: 1,
  },
  bottomRegisterButton: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    borderRadius: 14,
  },
  bottomRegisterButtonText: {
    fontSize: 16,
    fontWeight: '700',
    marginLeft: 8,
  },
});