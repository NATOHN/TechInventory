// 1. Importaciones
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../context/ThemeContext';
import { useLanguage } from '../../context/LanguageContext';
import { useAppSelector } from '../../redux/hooks';

// 2. Actividad de ejemplo. El proyecto todavia no tiene un registro real de eventos
// (crear un log de actividad requeriria un slice nuevo, como activityLogSlice, que
// se conectaria mejor una vez este disponible la base de datos en Supabase).
const actividadEjemplo = [
  {
    id: '1',
    icono: 'checkmark-circle' as const,
    color: '#059669',
    titulo: 'Mantenimiento completado',
    detalle: 'EQ-000124 • Hace 2 horas',
  },
  {
    id: '2',
    icono: 'add-circle' as const,
    color: '#1E3A8A',
    titulo: 'Nuevo equipo registrado',
    detalle: 'EQ-000128 • Hace 4 horas',
  },
  {
    id: '3',
    icono: 'construct' as const,
    color: '#B91C1C',
    titulo: 'Equipo enviado a taller',
    detalle: 'EQ-000097 • Hace 6 horas',
  },
];

export default function HomeTab({ navigation }: any) {
  // 3. Obtenemos la paleta de colores actual desde ThemeContext.
  const { colors } = useTheme();

  // 4. Obtenemos la función t desde LanguageContext para mostrar los textos traducidos.
  const { t } = useLanguage();

  // 5. Leemos los equipos y mantenimientos reales desde Redux para calcular los contadores.
  const equipments = useAppSelector((state) => state.equipment.equipments);
  const maintenances = useAppSelector((state) => state.maintenance.maintenances);

  // 6. Buscamos al usuario que representa la sesion actual, para mostrar su nombre.
  const currentUser = useAppSelector((state) =>
    state.users.users.find((u) => u.id === state.users.currentUserId)
  );

  // 7. Calculamos los contadores principales a partir de los equipos reales.
  const totalEquipos = equipments.length;
  const totalActivos = equipments.filter((e) => e.status === 'activo').length;
  const totalTaller = equipments.filter((e) => e.status === 'taller').length;
  const totalPendientes = maintenances.filter((m) => m.status === 'en_proceso').length;

  return (
    // 8. SafeAreaView evita que el contenido quede pegado a los bordes del dispositivo.
    <SafeAreaView edges={['top', 'left', 'right']} style={[styles.safeArea, { backgroundColor: colors.background }]}>
      <ScrollView style={{ backgroundColor: colors.background }} contentContainerStyle={styles.container}>

        {/* 9. Encabezado con saludo personalizado y campana de notificaciones */}
        <View style={styles.header}>
          <View style={styles.headerLeft}>
            <Ionicons name="person-circle" size={40} color={colors.primary} />
            <View>
              <Text style={[styles.saludo, { color: colors.text }]}>
                Hola, {currentUser?.nombreCompleto.split(' ')[0] ?? 'usuario'}
              </Text>
              <Text style={[styles.subSaludo, { color: colors.textSecondary }]}>
                Que tengas un excelente día
              </Text>
            </View>
          </View>

          {/* 10. Campana de notificaciones, aun sin funcionalidad real (ver Configuracion) */}
          <View>
            <Ionicons name="notifications-outline" size={24} color={colors.text} />
            <View style={styles.notificationDot} />
          </View>
        </View>

        {/* 11. Tarjetas de resumen: total de equipos, activos, en taller y mantenimientos pendientes */}
        <View style={styles.statsGrid}>
          <View style={[styles.statCard, { backgroundColor: '#DBEAFE' }]}>
            <Ionicons name="server" size={20} color="#1E3A8A" />
            <Text style={[styles.statLabel, { color: '#1E3A8A' }]}>Equipos</Text>
            <Text style={[styles.statValue, { color: '#1E3A8A' }]}>{totalEquipos}</Text>
          </View>

          <View style={[styles.statCard, { backgroundColor: '#D1FAE5' }]}>
            <Ionicons name="checkmark-circle" size={20} color="#059669" />
            <Text style={[styles.statLabel, { color: '#059669' }]}>Activos</Text>
            <Text style={[styles.statValue, { color: '#059669' }]}>{totalActivos}</Text>
          </View>

          <View style={[styles.statCard, { backgroundColor: '#FEE2E2' }]}>
            <Ionicons name="build" size={20} color="#B91C1C" />
            <Text style={[styles.statLabel, { color: '#B91C1C' }]}>En taller</Text>
            <Text style={[styles.statValue, { color: '#B91C1C' }]}>{totalTaller}</Text>
          </View>

          <View style={[styles.statCard, { backgroundColor: '#FEF3C7' }]}>
            <Ionicons name="time" size={20} color="#B45309" />
            <Text style={[styles.statLabel, { color: '#B45309' }]}>Mantenimientos{'\n'}pendientes</Text>
            <Text style={[styles.statValue, { color: '#B45309' }]}>{totalPendientes}</Text>
          </View>
        </View>

        {/* 12. Seccion: acciones rapidas */}
        <Text style={[styles.sectionTitle, { color: colors.text }]}>Acciones rápidas</Text>
        <View style={styles.actionsRow}>

          {/* 13. Escanear QR reutiliza el mismo escaner que usa el flujo de mantenimiento */}
          <TouchableOpacity
            style={[styles.actionButton, { backgroundColor: colors.surface, borderColor: colors.border }]}
            onPress={() => navigation.navigate('Mantenimiento', { screen: 'EnterEquipmentCodeScreen' })}
          >
            <Ionicons name="qr-code-outline" size={26} color={colors.primary} />
            <Text style={[styles.actionText, { color: colors.text }]}>Escanear QR</Text>
          </TouchableOpacity>

          {/* 14. Registrar equipo navega a la pantalla de registro dentro del Stack de Equipos */}
          <TouchableOpacity
            style={[styles.actionButtonPrimary, { backgroundColor: colors.primary }]}
            onPress={() => navigation.navigate('Equipos', { screen: 'RegisterEquipment' })}
          >
            <Ionicons name="add-circle-outline" size={26} color="#FFFFFF" />
            <Text style={styles.actionTextPrimary}>Registrar{'\n'}equipo</Text>
          </TouchableOpacity>

          {/* 15. Nuevo mantenimiento navega al mismo escaner que arranca el flujo de mantenimiento */}
          <TouchableOpacity
            style={[styles.actionButton, { backgroundColor: colors.surface, borderColor: colors.border }]}
            onPress={() => navigation.navigate('Mantenimiento', { screen: 'EnterEquipmentCodeScreen' })}
          >
            <Ionicons name="construct-outline" size={26} color={colors.primary} />
            <Text style={[styles.actionText, { color: colors.text }]}>Nuevo{'\n'}mantenimiento</Text>
          </TouchableOpacity>
        </View>

        {/* 16. Seccion: actividad reciente */}
        <View style={styles.activityHeader}>
          <Text style={[styles.sectionTitle, { color: colors.text, marginBottom: 0 }]}>Actividad reciente</Text>
          <TouchableOpacity>
            <Text style={[styles.verTodasText, { color: colors.primary }]}>Ver todas</Text>
          </TouchableOpacity>
        </View>

        {actividadEjemplo.map((item) => (
          <View
            key={item.id}
            style={[styles.activityRow, { backgroundColor: colors.surface, borderColor: colors.border }]}
          >
            <Ionicons name={item.icono} size={22} color={item.color} />
            <View style={{ flex: 1 }}>
              <Text style={[styles.activityTitulo, { color: colors.text }]}>{item.titulo}</Text>
              <Text style={[styles.activityDetalle, { color: colors.textSecondary }]}>{item.detalle}</Text>
            </View>
          </View>
        ))}

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
  headerLeft: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  saludo: { fontSize: 17, fontWeight: '700' },
  subSaludo: { fontSize: 12, marginTop: 2 },
  notificationDot: {
    position: 'absolute',
    top: -2,
    right: -2,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#EF4444',
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
    gap: 6,
  },
  statLabel: { fontSize: 13, fontWeight: '600' },
  statValue: { fontSize: 24, fontWeight: '800' },
  sectionTitle: { fontSize: 16, fontWeight: '700', marginBottom: 12 },
  actionsRow: { flexDirection: 'row', gap: 10, marginBottom: 24 },
  actionButton: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    borderWidth: 1,
    borderRadius: 14,
    paddingVertical: 16,
  },
  actionButtonPrimary: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    borderRadius: 14,
    paddingVertical: 16,
  },
  actionText: { fontSize: 12, fontWeight: '600', textAlign: 'center' },
  actionTextPrimary: { fontSize: 12, fontWeight: '600', textAlign: 'center', color: '#FFFFFF' },
  activityHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  verTodasText: { fontSize: 13, fontWeight: '600' },
  activityRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    borderWidth: 1,
    borderRadius: 12,
    padding: 12,
    marginBottom: 8,
  },
  activityTitulo: { fontSize: 13, fontWeight: '700' },
  activityDetalle: { fontSize: 11, marginTop: 2 },
});