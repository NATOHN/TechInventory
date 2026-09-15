// 1. Importaciones
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../context/ThemeContext';
import { useLanguage } from '../context/LanguageContext';
import { Maintenance } from '../redux/maintenanceSlice';

// 2. Props que recibe la tarjeta: el mantenimiento completo a mostrar.
type Props = {
  maintenance: Maintenance;
  onPress?: () => void;
};

export default function MaintenanceCard({ maintenance }: Props) {
  // 3. Obtenemos la paleta de colores actual desde ThemeContext.
  const { colors } = useTheme();

  // 4. Obtenemos la función t desde LanguageContext para mostrar los textos traducidos.
  const { t } = useLanguage();

  // 5. Determinamos color y texto de la insignia de estado según el status del mantenimiento.
  const isFinalizado = maintenance.status === 'finalizado';
  const badgeColor = isFinalizado ? 'green' : 'orange';
  const badgeText = isFinalizado ? t('maintenanceCompleted') : t('maintenanceInProgress');

  // 6. Traducimos el tipo de mantenimiento (preventivo/correctivo).
  const tipoText = maintenance.tipo === 'preventivo' ? t('maintenanceTypePreventive') : t('maintenanceTypeCorrective');

  // 7. Determinamos color y texto según la prioridad del mantenimiento.
  const priorityColor =
    maintenance.prioridad === 'alta' ? 'red' :
    maintenance.prioridad === 'media' ? 'orange' :
    maintenance.prioridad === 'baja' ? 'green' : colors.textSecondary;

  const priorityText =
    maintenance.prioridad === 'alta' ? t('maintenancePriorityHigh') :
    maintenance.prioridad === 'media' ? t('maintenancePriorityMedium') :
    maintenance.prioridad === 'baja' ? t('maintenancePriorityLow') : '';

  return (
    <View style={[styles.card, { backgroundColor: colors.surface, borderColor: colors.border }]}>

      {/* 8. Fila superior: codigo del equipo + insignia de estado */}
      <View style={styles.headerRow}>
        <Text style={[styles.codigo, { color: colors.primary }]}>{maintenance.codigoEquipo}</Text>
        <View style={[styles.badge, { backgroundColor: badgeColor }]}>
          <Text style={styles.badgeText}>{badgeText.toUpperCase()}</Text>
        </View>
      </View>

      {/* 9. Descripcion del trabajo realizado o en curso */}
      <Text style={[styles.descripcion, { color: colors.text }]} numberOfLines={2}>
        {maintenance.descripcion}
      </Text>

      {/* 10. Fila inferior: tecnico, tipo de mantenimiento y prioridad */}
      <View style={styles.footerRow}>
        <View style={styles.infoItem}>
          <Ionicons name="person" size={14} color={colors.textSecondary} />
          <Text style={[styles.infoText, { color: colors.textSecondary }]}>
            {maintenance.tecnico}
          </Text>
        </View>
        <View style={styles.infoItem}>
          <Ionicons
            name={maintenance.tipo === 'preventivo' ? 'shield-checkmark' : 'build'}
            size={14}
            color={colors.textSecondary}
          />
          <Text style={[styles.infoText, { color: colors.textSecondary }]}>
            {tipoText}
          </Text>
        </View>
        {maintenance.prioridad && (
          <View style={styles.infoItem}>
            <View style={[styles.priorityDot, { backgroundColor: priorityColor }]} />
            <Text style={[styles.infoText, { color: colors.textSecondary }]}>
              {priorityText}
            </Text>
          </View>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    borderWidth: 1,
    borderRadius: 12,
    padding: 14,
    marginBottom: 10,
    gap: 6,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  codigo: {
    fontSize: 15,
    fontWeight: '700',
  },
  badge: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  badgeText: {
    color: 'white',
    fontSize: 10,
    fontWeight: 'bold',
  },
  descripcion: {
    fontSize: 13,
  },
  footerRow: {
    flexDirection: 'row',
    gap: 14,
    marginTop: 4,
  },
  infoItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  infoText: {
    fontSize: 12,
  },
  priorityDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
});