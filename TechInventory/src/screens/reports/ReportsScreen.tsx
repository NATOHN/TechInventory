// 1. Importaciones.
import { useCallback, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  Modal,
  ActivityIndicator,
} from 'react-native';

import { SafeAreaView } from 'react-native-safe-area-context';
import Svg, { Circle, G } from 'react-native-svg';
import { Ionicons } from '@expo/vector-icons';
import { useFocusEffect } from '@react-navigation/native';

import { useTheme } from '../../context/ThemeContext';

import {
  obtenerReporteDesdeSupabase,
  obtenerRangoReporte,
  ReportData,
  ReportPeriod,
} from '../../services/reportesService';

import {
  exportarReporteExcel,
} from '../../utils/reportExcel';

// 2. Configuración de las gráficas de dona.
const DONUT_SIZE = 140;
const DONUT_STROKE = 18;
const DONUT_RADIUS =
  (DONUT_SIZE - DONUT_STROKE) / 2;

const DONUT_CIRCUNFERENCIA =
  2 * Math.PI * DONUT_RADIUS;

type DonutSegment = {
  valor: number;
  color: string;
};

// 3. Gráfica de dona reutilizable.
function DonutChart({
  segments,
  centro,
  centroColor,
}: {
  segments: DonutSegment[];
  centro: string;
  centroColor: string;
}) {
  let acumulado = 0;

  return (
    <View
      style={{
        width: DONUT_SIZE,
        height: DONUT_SIZE,
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <Svg
        width={DONUT_SIZE}
        height={DONUT_SIZE}
      >
        <G
          rotation="-90"
          origin={`${DONUT_SIZE / 2}, ${DONUT_SIZE / 2}`}
        >
          {/* Fondo de la dona. */}
          <Circle
            cx={DONUT_SIZE / 2}
            cy={DONUT_SIZE / 2}
            r={DONUT_RADIUS}
            stroke="#E5E7EB"
            strokeWidth={DONUT_STROKE}
            fill="none"
          />

          {segments.map((segmento, index) => {
            const largo =
              segmento.valor *
              DONUT_CIRCUNFERENCIA;

            const offset =
              -acumulado *
              DONUT_CIRCUNFERENCIA;

            acumulado += segmento.valor;

            return (
              <Circle
                key={index}
                cx={DONUT_SIZE / 2}
                cy={DONUT_SIZE / 2}
                r={DONUT_RADIUS}
                stroke={segmento.color}
                strokeWidth={DONUT_STROKE}
                fill="none"
                strokeDasharray={`${largo} ${DONUT_CIRCUNFERENCIA}`}
                strokeDashoffset={offset}
                strokeLinecap="butt"
              />
            );
          })}
        </G>
      </Svg>

      <View style={styles.donutCentro}>
        <Text
          style={[
            styles.donutCentroTexto,
            { color: centroColor },
          ]}
        >
          {centro}
        </Text>
      </View>
    </View>
  );
}

// 4. Elemento de leyenda.
function LeyendaItem({
  color,
  texto,
  textColor,
}: {
  color: string;
  texto: string;
  textColor: string;
}) {
  return (
    <View style={styles.leyendaItem}>
      <View
        style={[
          styles.leyendaPunto,
          { backgroundColor: color },
        ]}
      />

      <Text
        style={[
          styles.leyendaTexto,
          { color: textColor },
        ]}
      >
        {texto}
      </Text>
    </View>
  );
}

export default function ReportsScreen() {
  const { colors } = useTheme();

  // 5. Por defecto mostramos información del mes actual.
  const [periodo, setPeriodo] =
    useState<ReportPeriod>('mes_actual');

  const [showPeriodModal, setShowPeriodModal] =
    useState(false);

  const [cargando, setCargando] =
    useState(true);

  const [exportando, setExportando] =
    useState(false);

  const [error, setError] =
    useState<string | null>(null);

  const [reportData, setReportData] =
    useState<ReportData>({
      equipos: [],
      mantenimientos: [],
    });

  // 6. Consulta real de Supabase.
  const cargarReporte = useCallback(async () => {
    try {
      setCargando(true);
      setError(null);

      const datos =
        await obtenerReporteDesdeSupabase(
          periodo
        );

      setReportData(datos);
    } catch (error) {
      console.log(
        'Error al cargar reportes:',
        error
      );

      setError(
        'No fue posible cargar los datos del reporte.'
      );
    } finally {
      setCargando(false);
    }
  }, [periodo]);

  // 7. Al entrar nuevamente a Reportes actualizamos los datos.
  useFocusEffect(
    useCallback(() => {
      void cargarReporte();
    }, [cargarReporte])
  );

  const activos =
    reportData.equipos.filter(
      (equipo) =>
        equipo.status === 'activo'
    );

  const totalEquipos =
    reportData.equipos.length;

  // 8. Estados visuales reales de TechInventory.
  const totalEnUso =
    activos.filter(
      (equipo) =>
        equipo.empleado !== 'Sin asignar'
    ).length;

  const totalDisponibles =
    activos.filter(
      (equipo) =>
        equipo.empleado === 'Sin asignar'
    ).length;

  const totalMantenimiento =
    reportData.equipos.filter(
      (equipo) =>
        equipo.status === 'taller'
    ).length;

  const totalBaja =
    reportData.equipos.filter(
      (equipo) =>
        equipo.status === 'baja'
    ).length;

  // 9. Gráfica de estados visuales.
  const segmentosEstado: DonutSegment[] =
    totalEquipos === 0
      ? []
      : [
          {
            valor:
              totalEnUso /
              totalEquipos,
            color: '#059669',
          },
          {
            valor:
              totalDisponibles /
              totalEquipos,
            color: '#3B82F6',
          },
          {
            valor:
              totalMantenimiento /
              totalEquipos,
            color: '#F59E0B',
          },
          {
            valor:
              totalBaja /
              totalEquipos,
            color: '#EF4444',
          },
        ];

  // 10. Mantenimientos reales del período.
  const totalMantenimientos =
    reportData.mantenimientos.length;

  const totalPreventivo =
    reportData.mantenimientos.filter(
      (mantenimiento) =>
        mantenimiento.tipo === 'preventivo'
    ).length;

  const totalCorrectivo =
    reportData.mantenimientos.filter(
      (mantenimiento) =>
        mantenimiento.tipo === 'correctivo'
    ).length;

  const segmentosTipo: DonutSegment[] =
    totalMantenimientos === 0
      ? []
      : [
          {
            valor:
              totalPreventivo /
              totalMantenimientos,
            color: '#3B82F6',
          },
          {
            valor:
              totalCorrectivo /
              totalMantenimientos,
            color: '#8B5CF6',
          },
        ];

  // 11. Equipos agrupados por sucursal.
  const equiposPorSucursal =
    reportData.equipos.reduce<
      Record<string, number>
    >((acumulado, equipo) => {
      acumulado[equipo.sucursal] =
        (acumulado[equipo.sucursal] ?? 0) +
        1;

      return acumulado;
    }, {});

  const listaSucursales =
    Object.entries(equiposPorSucursal)
      .map(([sucursal, cantidad]) => ({
        sucursal,
        cantidad,
      }))
      .sort(
        (a, b) =>
          b.cantidad - a.cantidad
      );

  const maxSucursal =
    Math.max(
      ...listaSucursales.map(
        (item) => item.cantidad
      ),
      1
    );

  const rangoActual =
    obtenerRangoReporte(periodo);

  // 12. Exporta exactamente el mismo período que
  // actualmente está visualizando el usuario.
  const handleExportar = async () => {
    if (
      reportData.equipos.length === 0 &&
      reportData.mantenimientos.length === 0
    ) {
      Alert.alert(
        'Sin información',
        'No existen datos para exportar en el período seleccionado.'
      );

      return;
    }

    try {
      setExportando(true);

      await exportarReporteExcel(
        reportData,
        periodo
      );
    } catch (error) {
      console.log(
        'Error al exportar Excel:',
        error
      );

      Alert.alert(
        'Error',
        'No fue posible generar el archivo Excel.'
      );
    } finally {
      setExportando(false);
    }
  };

  // 13. Cambia el período y cierra el selector.
  const seleccionarPeriodo = (
    nuevoPeriodo: ReportPeriod
  ) => {
    setPeriodo(nuevoPeriodo);
    setShowPeriodModal(false);
  };

  return (
    <SafeAreaView
      edges={['top', 'left', 'right']}
      style={[
        styles.safeArea,
        {
          backgroundColor:
            colors.background,
        },
      ]}
    >
      <ScrollView
        style={{
          backgroundColor:
            colors.background,
        }}
        contentContainerStyle={
          styles.container
        }
        showsVerticalScrollIndicator={false}
      >
        {/* 14. Encabezado. */}
        <View style={styles.header}>
          <Text
            style={[
              styles.title,
              { color: colors.primary },
            ]}
          >
            Reportes
          </Text>
        </View>

        {/* 15. Filtro REAL. */}
        <TouchableOpacity
          style={[
            styles.dateRangeRow,
            {
              backgroundColor:
                colors.surface,
              borderColor:
                colors.border,
            },
          ]}
          onPress={() =>
            setShowPeriodModal(true)
          }
        >
          <Ionicons
            name="calendar-outline"
            size={18}
            color={colors.primary}
          />

          <Text
            style={[
              styles.dateRangeText,
              { color: colors.text },
            ]}
          >
            {rangoActual.etiqueta}
          </Text>

          <Ionicons
            name="chevron-down"
            size={16}
            color={
              colors.textSecondary
            }
          />
        </TouchableOpacity>

        {/* Estado de consulta. */}
        {cargando && (
          <View style={styles.loadingRow}>
            <ActivityIndicator
              size="small"
              color={colors.primary}
            />

            <Text
              style={{
                color:
                  colors.textSecondary,
              }}
            >
              Actualizando reporte...
            </Text>
          </View>
        )}

        {error && (
          <Text
            style={[
              styles.errorText,
              { color: '#B91C1C' },
            ]}
          >
            {error}
          </Text>
        )}

        {/* 16. Resumen. */}
        <View style={styles.statsGrid}>
          <View
            style={[
              styles.statCard,
              {
                backgroundColor:
                  '#DBEAFE',
              },
            ]}
          >
            <Text
              style={[
                styles.statValue,
                { color: '#1E3A8A' },
              ]}
            >
              {totalEquipos}
            </Text>

            <Text
              style={[
                styles.statLabel,
                { color: '#1E3A8A' },
              ]}
            >
              Equipos registrados
            </Text>
          </View>

          <View
            style={[
              styles.statCard,
              {
                backgroundColor:
                  '#D1FAE5',
              },
            ]}
          >
            <Text
              style={[
                styles.statValue,
                { color: '#059669' },
              ]}
            >
              {totalEnUso}
            </Text>

            <Text
              style={[
                styles.statLabel,
                { color: '#059669' },
              ]}
            >
              En uso
            </Text>
          </View>

          <View
            style={[
              styles.statCard,
              {
                backgroundColor:
                  '#FEF3C7',
              },
            ]}
          >
            <Text
              style={[
                styles.statValue,
                { color: '#B45309' },
              ]}
            >
              {totalMantenimiento}
            </Text>

            <Text
              style={[
                styles.statLabel,
                { color: '#B45309' },
              ]}
            >
              Mantenimiento
            </Text>
          </View>

          <View
            style={[
              styles.statCard,
              {
                backgroundColor:
                  '#FEE2E2',
              },
            ]}
          >
            <Text
              style={[
                styles.statValue,
                { color: '#B91C1C' },
              ]}
            >
              {totalBaja}
            </Text>

            <Text
              style={[
                styles.statLabel,
                { color: '#B91C1C' },
              ]}
            >
              Dados de baja
            </Text>
          </View>
        </View>

        {/* 17. Equipos por estado. */}
        <Text
          style={[
            styles.sectionTitle,
            { color: colors.text },
          ]}
        >
          Equipos por estado
        </Text>

        <View
          style={[
            styles.chartCard,
            {
              backgroundColor:
                colors.surface,
              borderColor:
                colors.border,
            },
          ]}
        >
          {totalEquipos === 0 ? (
            <Text
              style={[
                styles.emptyText,
                {
                  color:
                    colors.textSecondary,
                },
              ]}
            >
              Sin equipos registrados
              en este período.
            </Text>
          ) : (
            <View style={styles.chartRow}>
              <DonutChart
                segments={
                  segmentosEstado
                }
                centro={String(
                  totalEquipos
                )}
                centroColor={
                  colors.text
                }
              />

              <View
                style={
                  styles.leyendaColumna
                }
              >
                <LeyendaItem
                  color="#059669"
                  texto={`En uso (${totalEnUso})`}
                  textColor={colors.text}
                />

                <LeyendaItem
                  color="#3B82F6"
                  texto={`Disponibles (${totalDisponibles})`}
                  textColor={colors.text}
                />

                <LeyendaItem
                  color="#F59E0B"
                  texto={`Mantenimiento (${totalMantenimiento})`}
                  textColor={colors.text}
                />

                <LeyendaItem
                  color="#EF4444"
                  texto={`Baja (${totalBaja})`}
                  textColor={colors.text}
                />
              </View>
            </View>
          )}
        </View>

        {/* 18. Mantenimiento por tipo. */}
        <Text
          style={[
            styles.sectionTitle,
            { color: colors.text },
          ]}
        >
          Mantenimientos por tipo
        </Text>

        <View
          style={[
            styles.chartCard,
            {
              backgroundColor:
                colors.surface,
              borderColor:
                colors.border,
            },
          ]}
        >
          {totalMantenimientos ===
          0 ? (
            <Text
              style={[
                styles.emptyText,
                {
                  color:
                    colors.textSecondary,
                },
              ]}
            >
              Sin mantenimientos
              registrados en este
              período.
            </Text>
          ) : (
            <View style={styles.chartRow}>
              <DonutChart
                segments={
                  segmentosTipo
                }
                centro={String(
                  totalMantenimientos
                )}
                centroColor={
                  colors.text
                }
              />

              <View
                style={
                  styles.leyendaColumna
                }
              >
                <LeyendaItem
                  color="#3B82F6"
                  texto={`Preventivo (${totalPreventivo})`}
                  textColor={colors.text}
                />

                <LeyendaItem
                  color="#8B5CF6"
                  texto={`Correctivo (${totalCorrectivo})`}
                  textColor={colors.text}
                />
              </View>
            </View>
          )}
        </View>

        {/* 19. Equipos por sucursal. */}
        <Text
          style={[
            styles.sectionTitle,
            { color: colors.text },
          ]}
        >
          Equipos por sucursal
        </Text>

        <View
          style={[
            styles.chartCard,
            {
              backgroundColor:
                colors.surface,
              borderColor:
                colors.border,
            },
          ]}
        >
          {listaSucursales.length ===
          0 ? (
            <Text
              style={[
                styles.emptyText,
                {
                  color:
                    colors.textSecondary,
                },
              ]}
            >
              Sin equipos registrados
              en este período.
            </Text>
          ) : (
            listaSucursales.map(
              (item) => (
                <View
                  key={item.sucursal}
                  style={styles.barRow}
                >
                  <Text
                    style={[
                      styles.barLabel,
                      {
                        color:
                          colors.text,
                      },
                    ]}
                    numberOfLines={1}
                  >
                    {item.sucursal}
                  </Text>

                  <View
                    style={
                      styles.barTrack
                    }
                  >
                    <View
                      style={[
                        styles.barFill,
                        {
                          width: `${(item.cantidad / maxSucursal) * 100}%`,
                          backgroundColor:
                            colors.primary,
                        },
                      ]}
                    />
                  </View>

                  <Text
                    style={[
                      styles.barValue,
                      {
                        color:
                          colors.textSecondary,
                      },
                    ]}
                  >
                    {item.cantidad}
                  </Text>
                </View>
              )
            )
          )}
        </View>

        {/* 20. Exportación REAL a Excel. */}
        <TouchableOpacity
          disabled={
            exportando || cargando
          }
          style={[
            styles.exportButton,
            {
              backgroundColor:
                colors.primary,
              opacity:
                exportando ||
                cargando
                  ? 0.6
                  : 1,
            },
          ]}
          onPress={handleExportar}
        >
          {exportando ? (
            <ActivityIndicator
              size="small"
              color="#FFFFFF"
            />
          ) : (
            <Ionicons
              name="download-outline"
              size={20}
              color="#FFFFFF"
            />
          )}

          <Text
            style={
              styles.exportButtonText
            }
          >
            {exportando
              ? 'Generando Excel...'
              : 'Exportar a Excel'}
          </Text>
        </TouchableOpacity>

        <View style={{ height: 30 }} />
      </ScrollView>

      {/* 21. Selector del período real del reporte. */}
      <Modal
        visible={showPeriodModal}
        transparent
        animationType="fade"
        onRequestClose={() =>
          setShowPeriodModal(false)
        }
      >
        <View
          style={
            styles.modalOverlay
          }
        >
          <View
            style={[
              styles.modalContent,
              {
                backgroundColor:
                  colors.surface,
                borderColor:
                  colors.border,
              },
            ]}
          >
            <View
              style={
                styles.modalHeader
              }
            >
              <Text
                style={[
                  styles.modalTitle,
                  { color: colors.text },
                ]}
              >
                Período del reporte
              </Text>

              <TouchableOpacity
                onPress={() =>
                  setShowPeriodModal(
                    false
                  )
                }
              >
                <Ionicons
                  name="close"
                  size={24}
                  color={
                    colors.textSecondary
                  }
                />
              </TouchableOpacity>
            </View>

            {[
              {
                value:
                  'mes_actual' as ReportPeriod,
                label: 'Este mes',
              },
              {
                value:
                  'ultimos_30' as ReportPeriod,
                label:
                  'Últimos 30 días',
              },
              {
                value:
                  'anio_actual' as ReportPeriod,
                label: 'Este año',
              },
              {
                value:
                  'todo' as ReportPeriod,
                label:
                  'Todo el historial',
              },
            ].map((opcion) => (
              <TouchableOpacity
                key={opcion.value}
                style={[
                  styles.periodOption,
                  {
                    borderBottomColor:
                      colors.border,
                  },
                ]}
                onPress={() =>
                  seleccionarPeriodo(
                    opcion.value
                  )
                }
              >
                <Text
                  style={[
                    styles.periodText,
                    {
                      color:
                        colors.text,
                    },
                  ]}
                >
                  {opcion.label}
                </Text>

                {periodo ===
                  opcion.value && (
                  <Ionicons
                    name="checkmark-circle"
                    size={21}
                    color={
                      colors.primary
                    }
                  />
                )}
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </Modal>
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
    marginBottom: 12,
  },

  title: {
    fontSize: 22,
    fontWeight: 'bold',
  },

  dateRangeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    borderWidth: 1,
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 14,
    marginBottom: 14,
  },

  dateRangeText: {
    flex: 1,
    fontSize: 13,
    fontWeight: '600',
  },

  loadingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    marginBottom: 14,
  },

  errorText: {
    fontSize: 12,
    textAlign: 'center',
    marginBottom: 14,
  },

  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    marginBottom: 24,
  },

  statCard: {
    width: '47%',
    borderRadius: 14,
    padding: 14,
    gap: 4,
  },

  statValue: {
    fontSize: 24,
    fontWeight: '800',
  },

  statLabel: {
    fontSize: 12,
    fontWeight: '600',
  },

  sectionTitle: {
    fontSize: 15,
    fontWeight: '700',
    marginBottom: 10,
    marginTop: 6,
  },

  chartCard: {
    borderWidth: 1,
    borderRadius: 14,
    padding: 16,
    marginBottom: 20,
  },

  chartRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 20,
  },

  donutCentro: {
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center',
  },

  donutCentroTexto: {
    fontSize: 22,
    fontWeight: '800',
  },

  leyendaColumna: {
    flex: 1,
    gap: 10,
  },

  leyendaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },

  leyendaPunto: {
    width: 10,
    height: 10,
    borderRadius: 5,
  },

  leyendaTexto: {
    fontSize: 13,
  },

  emptyText: {
    fontSize: 13,
    textAlign: 'center',
    paddingVertical: 20,
  },

  barRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: 12,
  },

  barLabel: {
    width: 90,
    fontSize: 12,
    fontWeight: '600',
  },

  barTrack: {
    flex: 1,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#E5E7EB',
    overflow: 'hidden',
  },

  barFill: {
    height: '100%',
    borderRadius: 5,
  },

  barValue: {
    width: 24,
    fontSize: 12,
    textAlign: 'right',
  },

  exportButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    borderRadius: 14,
    paddingVertical: 14,
    marginTop: 8,
  },

  exportButtonText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '700',
  },

  // Fondo del selector de período.
  modalOverlay: {
    flex: 1,
    backgroundColor:
      'rgba(0,0,0,0.45)',
    justifyContent: 'center',
    paddingHorizontal: 24,
  },

  modalContent: {
    borderWidth: 1,
    borderRadius: 16,
    padding: 16,
  },

  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent:
      'space-between',
    marginBottom: 8,
  },

  modalTitle: {
    fontSize: 18,
    fontWeight: '700',
  },

  periodOption: {
    minHeight: 52,
    borderBottomWidth: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent:
      'space-between',
  },

  periodText: {
    fontSize: 14,
    fontWeight: '600',
  },
});