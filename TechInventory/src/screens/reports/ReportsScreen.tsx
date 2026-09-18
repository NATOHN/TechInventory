// 1. Importaciones
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Svg, { Circle, G } from 'react-native-svg';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../context/ThemeContext';
import { useAppSelector } from '../../redux/hooks';

// 2. Tamaño y grosor estandar para todas las donas de esta pantalla.
const DONUT_SIZE = 140;
const DONUT_STROKE = 18;
const DONUT_RADIUS = (DONUT_SIZE - DONUT_STROKE) / 2;
const DONUT_CIRCUNFERENCIA = 2 * Math.PI * DONUT_RADIUS;

// 3. Un segmento de dona: cuanto ocupa (0 a 1) y de que color se dibuja.
type DonutSegment = { valor: number; color: string };

// 4. Dibuja una dona SVG a partir de una lista de segmentos ya calculados como proporciones.
function DonutChart({ segments, centro, centroColor }: { segments: DonutSegment[]; centro: string; centroColor: string }) {
  // 5. Vamos acumulando cuanto de la circunferencia ya se dibujo, para saber donde empieza el siguiente segmento.
  let acumulado = 0;

  return (
    <View style={{ width: DONUT_SIZE, height: DONUT_SIZE, alignItems: 'center', justifyContent: 'center' }}>
      <Svg width={DONUT_SIZE} height={DONUT_SIZE}>
        <G rotation="-90" origin={`${DONUT_SIZE / 2}, ${DONUT_SIZE / 2}`}>
          {/* 6. Circulo base gris, visible si algun segmento no llega al 100% */}
          <Circle
            cx={DONUT_SIZE / 2}
            cy={DONUT_SIZE / 2}
            r={DONUT_RADIUS}
            stroke="#E5E7EB"
            strokeWidth={DONUT_STROKE}
            fill="none"
          />
          {/* 7. Un Circle por segmento, usando strokeDasharray para simular la porcion de dona */}
          {segments.map((seg, index) => {
            const largoSegmento = seg.valor * DONUT_CIRCUNFERENCIA;
            const offset = -acumulado * DONUT_CIRCUNFERENCIA;
            acumulado += seg.valor;

            return (
              <Circle
                key={index}
                cx={DONUT_SIZE / 2}
                cy={DONUT_SIZE / 2}
                r={DONUT_RADIUS}
                stroke={seg.color}
                strokeWidth={DONUT_STROKE}
                fill="none"
                strokeDasharray={`${largoSegmento} ${DONUT_CIRCUNFERENCIA}`}
                strokeDashoffset={offset}
                strokeLinecap="butt"
              />
            );
          })}
        </G>
      </Svg>
      {/* 8. Numero central superpuesto sobre la dona */}
      <View style={styles.donutCentro}>
        <Text style={[styles.donutCentroTexto, { color: centroColor }]}>{centro}</Text>
      </View>
    </View>
  );
}

// 9. Fila de leyenda: un punto de color junto al texto que describe ese segmento.
function LeyendaItem({ color, texto }: { color: string; texto: string }) {
  return (
    <View style={styles.leyendaItem}>
      <View style={[styles.leyendaPunto, { backgroundColor: color }]} />
      <Text style={styles.leyendaTexto}>{texto}</Text>
    </View>
  );
}

export default function ReportsScreen() {
  // 10. Obtenemos la paleta de colores actual desde ThemeContext.
  const { colors } = useTheme();

  // 11. Leemos los equipos y mantenimientos reales desde Redux.
  const equipments = useAppSelector((state) => state.equipment.equipments);
  const maintenances = useAppSelector((state) => state.maintenance.maintenances);

  // 12. Calculamos los totales generales de equipos.
  const totalEquipos = equipments.length;
  const totalActivos = equipments.filter((e) => e.status === 'activo').length;
  const totalTaller = equipments.filter((e) => e.status === 'taller').length;
  const totalBaja = equipments.filter((e) => e.status === 'baja').length;

  // 13. Construimos los segmentos de la dona "Equipos por estado".
  const segmentosEstado: DonutSegment[] = totalEquipos === 0 ? [] : [
    { valor: totalActivos / totalEquipos, color: '#059669' },
    { valor: totalTaller / totalEquipos, color: '#F59E0B' },
    { valor: totalBaja / totalEquipos, color: '#EF4444' },
  ];

  // 14. Calculamos los totales de mantenimientos por tipo.
  const totalMantenimientos = maintenances.length;
  const totalPreventivo = maintenances.filter((m) => m.tipo === 'preventivo').length;
  const totalCorrectivo = maintenances.filter((m) => m.tipo === 'correctivo').length;

  // 15. Construimos los segmentos de la dona "Mantenimientos por tipo".
  const segmentosTipo: DonutSegment[] = totalMantenimientos === 0 ? [] : [
    { valor: totalPreventivo / totalMantenimientos, color: '#3B82F6' },
    { valor: totalCorrectivo / totalMantenimientos, color: '#8B5CF6' },
  ];

  // 16. Agrupamos los equipos por sucursal, contando cuantos hay en cada una.
  const equiposPorSucursal = equipments.reduce<Record<string, number>>((acc, e) => {
    acc[e.sucursal] = (acc[e.sucursal] ?? 0) + 1;
    return acc;
  }, {});

  // 17. Convertimos el objeto en un arreglo ordenado de mayor a menor, para dibujar las barras.
  const listaSucursales = Object.entries(equiposPorSucursal)
    .map(([sucursal, cantidad]) => ({ sucursal, cantidad }))
    .sort((a, b) => b.cantidad - a.cantidad);

  // 18. Calculamos el maximo para poder escalar el ancho de cada barra proporcionalmente.
  const maxSucursal = Math.max(...listaSucursales.map((s) => s.cantidad), 1);

  // 19. Muestra un aviso mientras la exportacion real no esta implementada.
  const handleExportar = () => {
    Alert.alert('Próximamente', 'La exportación de reportes estará disponible en una futura actualización.');
  };

  return (
    <SafeAreaView edges={['top', 'left', 'right']} style={[styles.safeArea, { backgroundColor: colors.background }]}>
      <ScrollView style={{ backgroundColor: colors.background }} contentContainerStyle={styles.container}>

        {/* 20. Encabezado con titulo y rango de fechas (decorativo, sin filtrado real todavia) */}
        <View style={styles.header}>
          <Text style={[styles.title, { color: colors.primary }]}>Reportes</Text>
        </View>

        <TouchableOpacity
          style={[styles.dateRangeRow, { backgroundColor: colors.surface, borderColor: colors.border }]}
          onPress={() => Alert.alert('Próximamente', 'El filtrado por rango de fechas estará disponible en una futura actualización.')}
        >
          <Ionicons name="calendar-outline" size={18} color={colors.primary} />
          <Text style={[styles.dateRangeText, { color: colors.text }]}>
            01 abr. 2025 - 30 abr. 2025
          </Text>
          <Ionicons name="chevron-down" size={16} color={colors.textSecondary} />
        </TouchableOpacity>

        {/* 21. Tarjetas de resumen general */}
        <View style={styles.statsGrid}>
          <View style={[styles.statCard, { backgroundColor: '#DBEAFE' }]}>
            <Text style={[styles.statValue, { color: '#1E3A8A' }]}>{totalEquipos}</Text>
            <Text style={[styles.statLabel, { color: '#1E3A8A' }]}>Equipos totales</Text>
          </View>
          <View style={[styles.statCard, { backgroundColor: '#D1FAE5' }]}>
            <Text style={[styles.statValue, { color: '#059669' }]}>{totalActivos}</Text>
            <Text style={[styles.statLabel, { color: '#059669' }]}>Activos</Text>
          </View>
          <View style={[styles.statCard, { backgroundColor: '#FEF3C7' }]}>
            <Text style={[styles.statValue, { color: '#B45309' }]}>{totalTaller}</Text>
            <Text style={[styles.statLabel, { color: '#B45309' }]}>En taller</Text>
          </View>
          <View style={[styles.statCard, { backgroundColor: '#FEE2E2' }]}>
            <Text style={[styles.statValue, { color: '#B91C1C' }]}>{totalBaja}</Text>
            <Text style={[styles.statLabel, { color: '#B91C1C' }]}>Dados de baja</Text>
          </View>
        </View>

        {/* 22. Grafica: Equipos por estado */}
        <Text style={[styles.sectionTitle, { color: colors.text }]}>Equipos por estado</Text>
        <View style={[styles.chartCard, { backgroundColor: colors.surface, borderColor: colors.border }]}>
          {totalEquipos === 0 ? (
            <Text style={[styles.emptyText, { color: colors.textSecondary }]}>Sin equipos registrados todavía.</Text>
          ) : (
            <View style={styles.chartRow}>
              <DonutChart segments={segmentosEstado} centro={String(totalEquipos)} centroColor={colors.text} />
              <View style={styles.leyendaColumna}>
                <LeyendaItem color="#059669" texto={`Activos (${totalActivos})`} />
                <LeyendaItem color="#F59E0B" texto={`En taller (${totalTaller})`} />
                <LeyendaItem color="#EF4444" texto={`Baja (${totalBaja})`} />
              </View>
            </View>
          )}
        </View>

        {/* 23. Grafica: Mantenimientos por tipo */}
        <Text style={[styles.sectionTitle, { color: colors.text }]}>Mantenimientos por tipo</Text>
        <View style={[styles.chartCard, { backgroundColor: colors.surface, borderColor: colors.border }]}>
          {totalMantenimientos === 0 ? (
            <Text style={[styles.emptyText, { color: colors.textSecondary }]}>Sin mantenimientos registrados todavía.</Text>
          ) : (
            <View style={styles.chartRow}>
              <DonutChart segments={segmentosTipo} centro={String(totalMantenimientos)} centroColor={colors.text} />
              <View style={styles.leyendaColumna}>
                <LeyendaItem color="#3B82F6" texto={`Preventivo (${totalPreventivo})`} />
                <LeyendaItem color="#8B5CF6" texto={`Correctivo (${totalCorrectivo})`} />
              </View>
            </View>
          )}
        </View>

        {/* 24. Grafica: Equipos por sucursal, en barras horizontales */}
        <Text style={[styles.sectionTitle, { color: colors.text }]}>Equipos por sucursal</Text>
        <View style={[styles.chartCard, { backgroundColor: colors.surface, borderColor: colors.border }]}>
          {listaSucursales.length === 0 ? (
            <Text style={[styles.emptyText, { color: colors.textSecondary }]}>Sin equipos registrados todavía.</Text>
          ) : (
            listaSucursales.map((item) => (
              <View key={item.sucursal} style={styles.barRow}>
                <Text style={[styles.barLabel, { color: colors.text }]} numberOfLines={1}>{item.sucursal}</Text>
                <View style={styles.barTrack}>
                  <View
                    style={[
                      styles.barFill,
                      { width: `${(item.cantidad / maxSucursal) * 100}%`, backgroundColor: colors.primary },
                    ]}
                  />
                </View>
                <Text style={[styles.barValue, { color: colors.textSecondary }]}>{item.cantidad}</Text>
              </View>
            ))
          )}
        </View>

        {/* 25. Boton para exportar el reporte, aun sin funcionalidad real */}
        <TouchableOpacity
          style={[styles.exportButton, { backgroundColor: colors.primary }]}
          onPress={handleExportar}
        >
          <Ionicons name="download-outline" size={20} color="#FFFFFF" />
          <Text style={styles.exportButtonText}>Exportar reporte</Text>
        </TouchableOpacity>

        <View style={{ height: 30 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1 },
  container: { paddingHorizontal: 16, paddingTop: 20, paddingBottom: 30 },
  header: { marginBottom: 12 },
  title: { fontSize: 22, fontWeight: 'bold' },
  dateRangeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    borderWidth: 1,
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 14,
    marginBottom: 20,
  },
  dateRangeText: { flex: 1, fontSize: 13, fontWeight: '600' },
  statsGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10, marginBottom: 24 },
  statCard: { width: '47%', borderRadius: 14, padding: 14, gap: 4 },
  statValue: { fontSize: 24, fontWeight: '800' },
  statLabel: { fontSize: 12, fontWeight: '600' },
  sectionTitle: { fontSize: 15, fontWeight: '700', marginBottom: 10, marginTop: 6 },
  chartCard: { borderWidth: 1, borderRadius: 14, padding: 16, marginBottom: 20 },
  chartRow: { flexDirection: 'row', alignItems: 'center', gap: 20 },
  donutCentro: { position: 'absolute', alignItems: 'center', justifyContent: 'center' },
  donutCentroTexto: { fontSize: 22, fontWeight: '800' },
  leyendaColumna: { flex: 1, gap: 10 },
  leyendaItem: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  leyendaPunto: { width: 10, height: 10, borderRadius: 5 },
  leyendaTexto: { fontSize: 13, color: '#374151' },
  emptyText: { fontSize: 13, textAlign: 'center', paddingVertical: 20 },
  barRow: { flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: 12 },
  barLabel: { width: 90, fontSize: 12, fontWeight: '600' },
  barTrack: { flex: 1, height: 10, borderRadius: 5, backgroundColor: '#E5E7EB', overflow: 'hidden' },
  barFill: { height: '100%', borderRadius: 5 },
  barValue: { width: 24, fontSize: 12, textAlign: 'right' },
  exportButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    borderRadius: 14,
    paddingVertical: 14,
    marginTop: 8,
  },
  exportButtonText: { color: '#FFFFFF', fontSize: 15, fontWeight: '700' },
});