// 1. Importaciones
import { useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
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
    <View style={[styles.container, { backgroundColor: colors.background }]}>

      {/* 9. Encabezado con titulo y boton para crear un nuevo mantenimiento */}
      <View style={styles.header}>
        <Text style={[styles.title, { color: colors.primary }]}>{t('maintenanceTitle')}</Text>
        <TouchableOpacity
          style={[styles.newButton, { backgroundColor: colors.primary }]}
          onPress={() => navigation.navigate('NewMaintenanceScreen')}
        >
          <Ionicons name="add" size={20} color="white" />
        </TouchableOpacity>
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
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16 },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  title: { fontSize: 22, fontWeight: 'bold' },
  newButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
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
});