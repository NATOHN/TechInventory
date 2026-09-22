// 1. Importaciones
import { useCallback, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Modal, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
// Permite refrescar los datos de Supabase cada vez que regresamos al Home.
import { useFocusEffect } from '@react-navigation/native';
import { useTheme } from '../../context/ThemeContext';
import { useLanguage } from '../../context/LanguageContext';
import { useAppDispatch, useAppSelector } from '../../redux/hooks';
import { marcarTodasLeidas } from '../../redux/notificationsSlice';
// Indicadores reales utilizados por el Dashboard.
import { cargarAnalyticsDesdeSupabase } from '../../redux/analyticsSlice';
import type { ActividadAnalyticsTipo } from '../../services/analyticsService';

// 2. Define la apariencia de cada actividad,
// pero los eventos y fechas provienen realmente de Supabase.
const getActividadVisual = (tipo: ActividadAnalyticsTipo) => {
  if (tipo === 'equipo_registrado') {
    return {
      icono: 'add-circle' as const,
      color: '#1E3A8A',
      titulo: 'Nuevo equipo registrado',
    };
  }

  if (tipo === 'mantenimiento_finalizado') {
    return {
      icono: 'checkmark-circle' as const,
      color: '#059669',
      titulo: 'Mantenimiento completado',
    };
  }

  return {
    icono: 'construct' as const,
    color: '#B45309',
    titulo: 'Mantenimiento iniciado',
  };
};

// 3. Presenta la fecha real almacenada en Supabase.
// Por ahora usamos fecha y hora exactas para evitar tiempos relativos incorrectos.
const formatearFechaActividad = (fecha: string) =>
  new Date(fecha).toLocaleString();

export default function HomeTab({ navigation }: any) {
  // 3. Obtenemos la paleta de colores actual desde ThemeContext.
  const { colors } = useTheme();

  // 4. Obtenemos la función t desde LanguageContext para mostrar los textos traducidos.
  const { t } = useLanguage();

  // 5. Obtenemos dispatch para poder enviar acciones a Redux.
  const dispatch = useAppDispatch();

  

  // 7. Leemos las notificaciones reales, generadas al iniciar y finalizar mantenimientos.
  const notifications = useAppSelector((state) => state.notifications.notifications);
  const notificacionesNoLeidas = notifications.filter((n) => !n.leida).length;

  // 8. Buscamos al usuario que representa la sesion actual, para mostrar su nombre.
  const currentUser = useAppSelector((state) =>
    state.users.users.find((u) => u.id === state.users.currentUserId)
  );

  // Leemos exclusivamente los indicadores recuperados desde Supabase.
const {
  data: analytics,
  cargando: cargandoAnalytics,
  error: errorAnalytics,
} = useAppSelector((state) => state.analytics);

// Cada vez que el usuario entra o regresa al Home,
// actualizamos los indicadores directamente desde PostgreSQL.
useFocusEffect(
  useCallback(() => {
    void dispatch(cargarAnalyticsDesdeSupabase());
  }, [dispatch])
);

// Los nombres locales permiten conservar el JSX actual sin cambiar el diseño.
const totalEquipos = analytics.equipos.total;
const totalActivos = analytics.equipos.disponibles;
const totalEnUso = analytics.equipos.enUso;
const totalPendientes = analytics.mantenimientos.enProceso;

  // 9. Controla si el modal de notificaciones esta visible.
  const [showNotifications, setShowNotifications] = useState(false);

 

  // 11. Abre el modal de notificaciones y marca todas como leidas, quitando el indicador rojo.
  const handleAbrirNotificaciones = () => {
    setShowNotifications(true);
    dispatch(marcarTodasLeidas());
  };

  return (
    // 12. SafeAreaView evita que el contenido quede pegado a los bordes del dispositivo.
    <SafeAreaView edges={['top', 'left', 'right']} style={[styles.safeArea, { backgroundColor: colors.background }]}>
      <ScrollView style={{ backgroundColor: colors.background }} contentContainerStyle={styles.container}>

                {/* 13. Encabezado con saludo personalizado y campana de notificaciones */}
        <View style={styles.header}>
          <View style={styles.headerLeft}>
            {currentUser?.fotoPerfil ? (
              <Image source={{ uri: currentUser.fotoPerfil }} style={styles.avatarImage} />
            ) : (
              <Ionicons name="person-circle" size={40} color={colors.primary} />
            )}
            <View>
              <Text style={[styles.saludo, { color: colors.text }]}>
                Hola, {currentUser?.nombreCompleto.split(' ')[0] ?? 'usuario'}
              </Text>
              <Text style={[styles.subSaludo, { color: colors.textSecondary }]}>
                Que tengas un excelente día
              </Text>
            </View>
          </View>

          {/* 14. Campana de notificaciones: abre el modal con el historial real de eventos */}
          <TouchableOpacity onPress={handleAbrirNotificaciones}>
            <Ionicons name="notifications-outline" size={24} color={colors.text} />
            {notificacionesNoLeidas > 0 && <View style={styles.notificationDot} />}
          </TouchableOpacity>
        </View>

        {/* Estado de la consulta real a Supabase.
No sustituye el contenido del Home para evitar bloquear la interfaz. */}
{cargandoAnalytics && (
  <Text
    style={{
      color: colors.textSecondary,
      fontSize: 12,
      marginBottom: 10,
    }}
  >
    Actualizando indicadores...
  </Text>
)}

{errorAnalytics && (
  <Text
    style={{
      color: '#B91C1C',
      fontSize: 12,
      marginBottom: 10,
    }}
  >
    No se pudieron actualizar los indicadores.
  </Text>
)}

        {/* 15. Tarjetas de resumen: total de equipos, activos, en taller y mantenimientos pendientes */}
        <View style={styles.statsGrid}>
          <View style={[styles.statCard, { backgroundColor: '#DBEAFE' }]}>
            <Ionicons name="server" size={20} color="#1E3A8A" />
            <Text style={[styles.statLabel, { color: '#1E3A8A' }]}>Equipos</Text>
            <Text style={[styles.statValue, { color: '#1E3A8A' }]}>{totalEquipos}</Text>
          </View>

          <View style={[styles.statCard, { backgroundColor: '#D1FAE5' }]}>
            <Ionicons name="checkmark-circle" size={20} color="#059669" />
            <Text style={[styles.statLabel, { color: '#059669' }]}>Disponibles</Text>
            <Text style={[styles.statValue, { color: '#059669' }]}>{totalActivos}</Text>
          </View>

          <View style={[styles.statCard, { backgroundColor: '#FEE2E2' }]}>
            <Ionicons name="build" size={20} color="#B91C1C" />
            <Text style={[styles.statLabel, { color: '#B91C1C' }]}>En Uso</Text>
            <Text style={[styles.statValue, { color: '#B91C1C' }]}>{totalEnUso}</Text>
          </View>

          <View style={[styles.statCard, { backgroundColor: '#FEF3C7' }]}>
            <Ionicons name="time" size={20} color="#B45309" />
            <Text style={[styles.statLabel, { color: '#B45309' }]}>Mantenimientos</Text>
            <Text style={[styles.statValue, { color: '#B45309' }]}>{totalPendientes}</Text>
          </View>
        </View>

        {/* 16. Seccion: acciones rapidas */}
        <Text style={[styles.sectionTitle, { color: colors.text }]}>Acciones rápidas</Text>
        <View style={styles.actionsRow}>

          {/* 17. Mantenimiento lleva directo a la pestaña de Mantenimiento (lista de mantenimientos) */}
          <TouchableOpacity
            style={[styles.actionButton, { backgroundColor: colors.surface, borderColor: colors.border }]}
            onPress={() => navigation.navigate('Mantenimiento')}
          >
            <Ionicons name="list-outline" size={26} color={colors.primary} />
            <Text style={[styles.actionText, { color: colors.text }]}>Mantenimiento</Text>
          </TouchableOpacity>

          {/* 18. Registrar equipo navega a la pantalla de registro dentro del Stack de Equipos */}
          <TouchableOpacity
            style={[styles.actionButtonPrimary, { backgroundColor: colors.primary }]}
            onPress={() => navigation.navigate('Equipos', { screen: 'RegisterEquipment' })}
          >
            <Ionicons name="add-circle-outline" size={26} color="#FFFFFF" />
            <Text style={styles.actionTextPrimary}>Registrar{'\n'}equipo</Text>
          </TouchableOpacity>

          {/* 19. Nuevo mantenimiento navega al escaner que arranca el flujo de mantenimiento */}
          <TouchableOpacity
            style={[styles.actionButton, { backgroundColor: colors.surface, borderColor: colors.border }]}
            onPress={() => navigation.navigate('Mantenimiento', { screen: 'EnterEquipmentCodeScreen' })}
          >
            <Ionicons name="construct-outline" size={26} color={colors.primary} />
            <Text style={[styles.actionText, { color: colors.text }]}>Nuevo{'\n'}mantenimiento</Text>
          </TouchableOpacity>
        </View>

        {/* 20. Seccion: actividad reciente */}
        <View style={styles.activityHeader}>
          <Text style={[styles.sectionTitle, { color: colors.text, marginBottom: 0 }]}>Actividad reciente</Text>
         {/* Mostramos que se trata de los eventos más recientes sin ofrecer
una acción que todavía no existe. */}
<Text
  style={[
    styles.verTodasText,
    { color: colors.textSecondary },
  ]}
>
  Últimos 5
</Text>
        </View>

        {/* La actividad reciente ahora proviene de equipos y mantenimientos
almacenados realmente en Supabase. */}
{analytics.actividadReciente.length === 0 ? (
  <Text
    style={{
      color: colors.textSecondary,
      fontSize: 13,
      textAlign: 'center',
      paddingVertical: 18,
    }}
  >
    No hay actividad registrada todavía.
  </Text>
) : (
  analytics.actividadReciente.map((item) => {
    const visual = getActividadVisual(item.tipo);

    return (
      <View
        key={item.id}
        style={[
          styles.activityRow,
          {
            backgroundColor: colors.surface,
            borderColor: colors.border,
          },
        ]}
      >
        <Ionicons
          name={visual.icono}
          size={22}
          color={visual.color}
        />

        <View style={{ flex: 1 }}>
          <Text
            style={[
              styles.activityTitulo,
              { color: colors.text },
            ]}
          >
            {visual.titulo}
          </Text>

          <Text
            style={[
              styles.activityDetalle,
              { color: colors.textSecondary },
            ]}
          >
            {item.codigoEquipo} • {formatearFechaActividad(item.fecha)}
          </Text>
        </View>
      </View>
    );
  })
)}

        <View style={{ height: 30 }} />
      </ScrollView>

      {/* 21. Modal con el historial real de notificaciones (inicio y fin de mantenimientos) */}
      <Modal visible={showNotifications} transparent animationType="slide" onRequestClose={() => setShowNotifications(false)}>
        <View style={styles.modalOverlay}>
          <View style={[styles.modalContent, { backgroundColor: colors.cardBackground ?? colors.surface }]}>

            <View style={styles.modalHeader}>
              <Text style={[styles.modalTitle, { color: colors.text }]}>Notificaciones</Text>
              <TouchableOpacity onPress={() => setShowNotifications(false)}>
                <Ionicons name="close" size={26} color={colors.textSecondary} />
              </TouchableOpacity>
            </View>

            {notifications.length === 0 ? (
              <Text style={[styles.modalEmptyText, { color: colors.textSecondary }]}>
                No hay notificaciones todavía.
              </Text>
            ) : (
              <ScrollView style={styles.modalList}>
                {notifications.map((n) => (
                  <View
                    key={n.id}
                    style={[styles.notifRow, { borderColor: colors.border }]}
                  >
                    <Ionicons
                      name={n.tipo === 'inicio' ? 'play-circle' : 'checkmark-circle'}
                      size={20}
                      color={n.tipo === 'inicio' ? '#F59E0B' : '#059669'}
                    />
                    <View style={{ flex: 1 }}>
                      <Text style={[styles.notifTexto, { color: colors.text }]}>{n.mensaje}</Text>
                      <Text style={[styles.notifFecha, { color: colors.textSecondary }]}>
                        {new Date(n.fecha).toLocaleString()}
                      </Text>
                    </View>
                  </View>
                ))}
              </ScrollView>
            )}
          </View>
        </View>
      </Modal>
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
  avatarImage: { width: 40, height: 40, borderRadius: 20 },
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
  // 22. Estilos del modal de notificaciones.
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.45)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    padding: 20,
    paddingBottom: 30,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    maxHeight: '70%',
    minHeight: 200,
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  modalTitle: { fontSize: 20, fontWeight: '700' },
  modalEmptyText: { fontSize: 14, textAlign: 'center', paddingVertical: 30 },
  modalList: { maxHeight: 400 },
  notifRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 10,
    paddingVertical: 12,
    borderBottomWidth: 1,
  },
  notifTexto: { fontSize: 14, fontWeight: '600' },
  notifFecha: { fontSize: 11, marginTop: 2 },
});