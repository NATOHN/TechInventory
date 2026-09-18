// 1. Importaciones
import { useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
// Selector de fecha compatible con Expo.
import DateTimePicker from '@react-native-community/datetimepicker';

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
  const { t, language } = useLanguage();

  // 5. Estado local que controla que filtro esta activo actualmente.
  const [filter, setFilter] = useState<FilterType>('todos');

  // Controla si mostramos u ocultamos el panel del filtro por fecha.
  const [showDateFilter, setShowDateFilter] = useState(false);

  // Fechas seleccionadas. Por ahora todavía no afectan la lista.
  const [fechaDesde, setFechaDesde] = useState<Date | null>(null);
  const [fechaHasta, setFechaHasta] = useState<Date | null>(null);

  // Indica qué calendario está abierto actualmente.
  const [pickerActivo, setPickerActivo] = useState<'desde' | 'hasta' | null>(null);

  // Convierte la fecha seleccionada a un formato legible según el idioma.
  const formatFilterDate = (fecha: Date | null) => {
    if (!fecha) return t('maintenanceDateSelect');

    return fecha.toLocaleDateString(
      language === 'en' ? 'en-US' : 'es-HN',
      {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
      }
    );
  };

  // Elimina únicamente el rango de fechas seleccionado.
  const limpiarFiltroFechas = () => {
    setFechaDesde(null);
    setFechaHasta(null);
    setPickerActivo(null);
  };


  // 6. Leemos el arreglo completo de mantenimientos desde Redux.
  const maintenances = useAppSelector((state) => state.maintenance.maintenances);


  // Indica si un mantenimiento se encuentra dentro del rango de fechas seleccionado.
  const estaDentroDelRango = (m: Maintenance) => {
    const fechaMantenimiento =
      m.status === 'finalizado'
        ? m.fechaFinalizacion ?? m.fechaInicio
        : m.fechaInicio;

    const fechaRegistro = new Date(fechaMantenimiento);

    // Desde incluye el día completo a partir de las 00:00.
    if (fechaDesde) {
      const desde = new Date(fechaDesde);
      desde.setHours(0, 0, 0, 0);

      if (fechaRegistro < desde) return false;
    }

    // Hasta incluye el día completo hasta las 23:59:59.
    if (fechaHasta) {
      const hasta = new Date(fechaHasta);
      hasta.setHours(23, 59, 59, 999);

      if (fechaRegistro > hasta) return false;
    }

    return true;
  };


  // 7. Filtramos los mantenimientos segun la pestana seleccionada.
  const filteredMaintenances = maintenances
    .filter((m: Maintenance) => {
      if (!estaDentroDelRango(m)) return false;

      if (filter === 'todos') return true;
      return m.status === filter;
    })
    .sort((a, b) => {
      // Mostramos primero los mantenimientos más recientes.
      const fechaA =
        a.status === 'finalizado'
          ? a.fechaFinalizacion ?? a.fechaInicio
          : a.fechaInicio;

      const fechaB =
        b.status === 'finalizado'
          ? b.fechaFinalizacion ?? b.fechaInicio
          : b.fechaInicio;

      return new Date(fechaB).getTime() - new Date(fechaA).getTime();
    });


  // Contadores visibles para conocer rápidamente el estado del trabajo técnico.

  // Los contadores también respetan el rango de fechas seleccionado.
  const maintenancesDentroDelRango = maintenances.filter(estaDentroDelRango);
  
  const maintenanceCounts = {
    todos: maintenancesDentroDelRango.length,

    en_proceso: maintenancesDentroDelRango.filter(
      (maintenance) => maintenance.status === 'en_proceso'
    ).length,

    finalizado: maintenancesDentroDelRango.filter(
      (maintenance) => maintenance.status === 'finalizado'
    ).length,
  };

  // 8. Definimos las pestañas visibles junto a su etiqueta traducida.
  const tabs: { key: FilterType; label: string; count: number }[] = [
    {
      key: 'todos',
      label: t('maintenanceAll'),
      count: maintenanceCounts.todos,
    },

    {
      key: 'en_proceso',
      label: t('maintenanceInProgress'),
      count: maintenanceCounts.en_proceso,
    },

    {
      key: 'finalizado',
      label: t('maintenanceCompleted'),
      count: maintenanceCounts.finalizado,
    },

  ];

  // Mensaje vacío según la pestaña seleccionada.
  const emptyState =
    filter === 'en_proceso'
      ? {
        title: t('noMaintenancesInProgressTitle'),
        message: t('noMaintenancesInProgressMessage'),
      }
      : filter === 'finalizado'
        ? {
          title: t('noMaintenancesCompletedTitle'),
          message: t('noMaintenancesCompletedMessage'),
        }
        : {
          title: t('noMaintenancesAllTitle'),
          message: t('noMaintenancesAllMessage'),
        };

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
                    {tab.label}({tab.count})
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>

          {/* Botón que muestra u oculta el rango de fechas. */}
          <TouchableOpacity
            style={[
              styles.dateFilterButton,
              {
                backgroundColor: colors.surface,
                borderColor: colors.border,
              },
            ]}
            onPress={() => setShowDateFilter((prev) => !prev)}
          >
            <Ionicons name="calendar-outline" size={18} color={colors.primary} />

            <Text style={[styles.dateFilterButtonText, { color: colors.primary }]}>
              {t('maintenanceDateFilterButton')}
            </Text>

            <Ionicons
              name={showDateFilter ? 'chevron-up' : 'chevron-down'}
              size={18}
              color={colors.primary}
            />
          </TouchableOpacity>

          {/* Panel para seleccionar el rango de fechas. */}
          {showDateFilter && (
            <View style={styles.dateRangeRow}>
              <TouchableOpacity
                style={[
                  styles.dateField,
                  {
                    backgroundColor: colors.surface,
                    borderColor: colors.border,
                  },
                ]}
                onPress={() => setPickerActivo('desde')}
              >
                <Text style={[styles.dateLabel, { color: colors.textSecondary }]}>
                  {t('maintenanceDateFrom')}
                </Text>

                <Text style={[styles.dateValue, { color: colors.text }]}>
                  {formatFilterDate(fechaDesde)}
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[
                  styles.dateField,
                  {
                    backgroundColor: colors.surface,
                    borderColor: colors.border,
                  },
                ]}
                onPress={() => setPickerActivo('hasta')}
              >
                <Text style={[styles.dateLabel, { color: colors.textSecondary }]}>
                  {t('maintenanceDateTo')}
                </Text>

                <Text style={[styles.dateValue, { color: colors.text }]}>
                  {formatFilterDate(fechaHasta)}
                </Text>
              </TouchableOpacity>
            </View>
          )}

          {/* Solo mostramos Limpiar filtros cuando ya existe alguna fecha seleccionada. */}
          {showDateFilter && (fechaDesde || fechaHasta) && (
            <TouchableOpacity
              style={styles.clearDateFilterButton}
              onPress={limpiarFiltroFechas}
            >
              <Ionicons
                name="close-circle-outline"
                size={17}
                color={colors.primary}
              />

              <Text style={[styles.clearDateFilterText, { color: colors.primary }]}>
                {t('clearFiltersButton')}
              </Text>
            </TouchableOpacity>
          )}

          {/* Selector nativo utilizado para Desde y Hasta. */}
          {pickerActivo && (
            <DateTimePicker

              value={
                pickerActivo === 'desde'
                  ? fechaDesde ?? new Date()
                  : fechaHasta ?? new Date()
              }
              mode="date"
              display="default"

              // Si elegimos Desde, no permitimos pasar de la fecha Hasta ya seleccionada.
              maximumDate={
                pickerActivo === 'desde' && fechaHasta
                  ? fechaHasta
                  : undefined
              }

              // Si elegimos Hasta, no permitimos escoger una fecha anterior a Desde.
              minimumDate={
                pickerActivo === 'hasta' && fechaDesde
                  ? fechaDesde
                  : undefined
              }

              onChange={(event, selectedDate) => {
                // Cerramos el calendario después de seleccionar o cancelar.
                setPickerActivo(null);

                if (!selectedDate) return;

                if (pickerActivo === 'desde') {
                  setFechaDesde(selectedDate);
                } else {
                  setFechaHasta(selectedDate);
                }
              }}
            />
          )}

          {/* 11. Lista de mantenimientos filtrados, o mensaje vacio si no hay ninguno */}
          {filteredMaintenances.length === 0 ? (
            <View style={styles.emptyContainer}>
              <Ionicons name="build-outline" size={48} color={colors.textSecondary} />
              <Text style={[styles.emptyTitle, { color: colors.text }]}>{emptyState.title}</Text>
              <Text style={[styles.emptyMessage, { color: colors.textSecondary }]}>
                {emptyState.message}
              </Text>
            </View>
          ) : (
            <FlatList
              data={filteredMaintenances}
              keyExtractor={(item) => item.id}
              renderItem={({ item }) => (
                // 12. Al tocar la tarjeta, abrimos el mismo formulario en modo edicion/solo lectura,
                // enviando el id del mantenimiento existente en lugar de un codigoEquipo nuevo.
                <MaintenanceCard
                  maintenance={item}
                  onPress={() => navigation.navigate('NewMaintenanceScreen', { maintenanceId: item.id })}
                />
              )}
              contentContainerStyle={styles.list}
            />
          )}
        </View>

        {/* 13. Pie fijo con el boton principal, mismo estilo que en Equipos */}
        <View style={[styles.footer, { backgroundColor: colors.background, borderTopColor: colors.border }]}>
          <TouchableOpacity
            style={[styles.bottomRegisterButton, { backgroundColor: colors.primary }]}
            // 14. El registro de un mantenimiento nuevo siempre pasa primero por identificar el equipo
            // (escaneando el QR o ingresando el codigo manualmente), nunca abre el formulario directo.
            onPress={() => navigation.navigate('EnterEquipmentCodeScreen')}
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

  // Botón compacto para mostrar u ocultar el filtro por fechas.
  dateFilterButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    borderWidth: 1,
    borderRadius: 10,
    paddingVertical: 10,
    marginBottom: 12,
  },

  dateFilterButtonText: {
    fontSize: 14,
    fontWeight: '600',
  },

  // Mantiene Desde y Hasta en una sola fila.
  dateRangeRow: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 16,
  },

  dateField: {
    flex: 1,
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 10,
  },

  dateLabel: {
    fontSize: 11,
    marginBottom: 4,
  },

  dateValue: {
    fontSize: 13,
    fontWeight: '600',
  },

  // Acción para quitar rápidamente el rango de fechas.
  clearDateFilterButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 5,
    marginBottom: 14,
  },

  clearDateFilterText: {
    fontSize: 13,
    fontWeight: '600',
  },

  list: { paddingBottom: 20 },
  emptyContainer: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: 8, marginTop: 60 },
  emptyTitle: { fontSize: 16, fontWeight: '600' },
  emptyMessage: { fontSize: 13, textAlign: 'center', paddingHorizontal: 30 },
  // 15. Pie inferior fijo, mismo patron que EquipmentListScreen.
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