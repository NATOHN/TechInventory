// 1. Importaciones
import { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../context/ThemeContext';
import { useLanguage } from '../../context/LanguageContext';
import { useAppDispatch, useAppSelector } from '../../redux/hooks';
import { crearMantenimiento, MaintenancePart, MaintenancePriority, MaintenanceType } from '../../redux/maintenanceSlice';
import CustomInput from '../../components/CustomInput';
import CustomButton from '../../components/CustomButton';

export default function NewMaintenanceScreen({ navigation }: any) {
  const { colors } = useTheme();
  const { t } = useLanguage();
  const dispatch = useAppDispatch();
  const equipments = useAppSelector((state) => state.equipment.equipments);

  const [codigoEquipo, setCodigoEquipo] = useState('');
  const [tecnico, setTecnico] = useState('');
  const [tipo, setTipo] = useState<MaintenanceType>('preventivo');
  const [prioridad, setPrioridad] = useState<MaintenancePriority>('media');
  const [descripcion, setDescripcion] = useState('');

  const [parteNombre, setParteNombre] = useState('');
  const [parteCantidad, setParteCantidad] = useState('');
  const [repuestos, setRepuestos] = useState<MaintenancePart[]>([]);

  const agregarRepuesto = () => {
    if (!parteNombre.trim() || !parteCantidad.trim()) return;
    setRepuestos((prev) => [
      ...prev,
      { nombre: parteNombre.trim(), cantidad: Number(parteCantidad) },
    ]);
    setParteNombre('');
    setParteCantidad('');
  };

  const quitarRepuesto = (index: number) => {
    setRepuestos((prev) => prev.filter((_, i) => i !== index));
  };

  const handleGuardar = () => {
    if (!codigoEquipo.trim() || !tecnico.trim() || !descripcion.trim()) {
      Alert.alert(t('incompleteFieldsTitle'), t('incompleteFieldsMessage'));
      return;
    }

    dispatch(
      crearMantenimiento({
        id: `MT-${Date.now()}`,
        codigoEquipo: codigoEquipo.trim(),
        tecnico: tecnico.trim(),
        tipo,
        prioridad,
        descripcion: descripcion.trim(),
        repuestos,
        status: 'en_proceso',
        fechaInicio: new Date().toISOString(),
      })
    );

    navigation.goBack();
  };

  return (
    <ScrollView style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color={colors.text} />
        </TouchableOpacity>
        <Text style={[styles.title, { color: colors.primary }]}>{t('newMaintenanceTitle')}</Text>
      </View>

      <View style={[styles.section, { backgroundColor: colors.surface, borderColor: colors.border }]}>
        <Text style={[styles.sectionTitle, { color: colors.text }]}>{t('equipmentInformationTitle')}</Text>

        <Text style={[styles.label, { color: colors.textSecondary }]}>Código del equipo (EQ-xxxxx)</Text>
        <CustomInput
          type="text"
          placeholder="EQ-0001"
          value={codigoEquipo}
          onChange={setCodigoEquipo}
        />

        <Text style={[styles.label, { color: colors.textSecondary }]}>{t('maintenanceTechnicianLabel')}</Text>
        <CustomInput
          type="text"
          placeholder={t('maintenanceTechnicianLabel')}
          value={tecnico}
          onChange={setTecnico}
        />
      </View>

      <View style={[styles.section, { backgroundColor: colors.surface, borderColor: colors.border }]}>
        <Text style={[styles.sectionTitle, { color: colors.text }]}>Tipo y prioridad</Text>

        <View style={styles.chipRow}>
          {(['preventivo', 'correctivo'] as MaintenanceType[]).map((op) => (
            <TouchableOpacity
              key={op}
              style={[
                styles.chip,
                {
                  backgroundColor: tipo === op ? colors.primary : colors.background,
                  borderColor: colors.border,
                },
              ]}
              onPress={() => setTipo(op)}
            >
              <Text style={{ color: tipo === op ? 'white' : colors.text, fontSize: 12 }}>
                {op === 'preventivo' ? t('maintenanceTypePreventive') : t('maintenanceTypeCorrective')}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        <View style={styles.chipRow}>
          {(['baja', 'media', 'alta'] as MaintenancePriority[]).map((op) => (
            <TouchableOpacity
              key={op}
              style={[
                styles.chip,
                {
                  backgroundColor: prioridad === op ? colors.primary : colors.background,
                  borderColor: colors.border,
                },
              ]}
              onPress={() => setPrioridad(op)}
            >
              <Text style={{ color: prioridad === op ? 'white' : colors.text, fontSize: 12 }}>
                {op === 'baja' ? t('maintenancePriorityLow') : op === 'media' ? t('maintenancePriorityMedium') : t('maintenancePriorityHigh')}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      <View style={[styles.section, { backgroundColor: colors.surface, borderColor: colors.border }]}>
        <Text style={[styles.sectionTitle, { color: colors.text }]}>Descripción del trabajo</Text>
        <CustomInput
          type="text"
          placeholder={t('maintenanceDescriptionPlaceholder')}
          value={descripcion}
          onChange={setDescripcion}
        />
      </View>

      <View style={[styles.section, { backgroundColor: colors.surface, borderColor: colors.border }]}>
        <Text style={[styles.sectionTitle, { color: colors.text }]}>{t('maintenancePartsTitle')}</Text>

        {repuestos.map((rep, index) => (
          <View key={index} style={styles.partRow}>
            <Text style={{ color: colors.text, flex: 1 }}>{rep.nombre} x{rep.cantidad}</Text>
            <TouchableOpacity onPress={() => quitarRepuesto(index)}>
              <Ionicons name="close-circle" size={20} color="red" />
            </TouchableOpacity>
          </View>
        ))}

        <View style={styles.partInputRow}>
          <View style={{ flex: 2 }}>
            <CustomInput
              type="text"
              placeholder={t('maintenancePartNamePlaceholder')}
              value={parteNombre}
              onChange={setParteNombre}
            />
          </View>
          <View style={{ flex: 1, marginLeft: 8 }}>
            <CustomInput
              type="phone"
              placeholder={t('maintenancePartQuantityPlaceholder')}
              value={parteCantidad}
              onChange={setParteCantidad}
            />
          </View>
        </View>

        <CustomButton title={t('addPartButton')} onPress={agregarRepuesto} variant="secondary" />
      </View>

      <CustomButton title={t('saveMaintenanceButton')} onPress={handleGuardar} />
      <View style={{ height: 30 }} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16 },
  header: { flexDirection: 'row', alignItems: 'center', gap: 12, marginBottom: 20 },
  title: { fontSize: 20, fontWeight: 'bold' },
  section: { borderWidth: 1, borderRadius: 12, padding: 14, marginBottom: 16, gap: 8 },
  sectionTitle: { fontSize: 15, fontWeight: '700', marginBottom: 4 },
  label: { fontSize: 12, marginBottom: -4 },
  chipRow: { flexDirection: 'row', gap: 8, marginBottom: 8 },
  chip: { borderWidth: 1, borderRadius: 8, paddingVertical: 8, paddingHorizontal: 12 },
  partRow: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 6 },
  partInputRow: { flexDirection: 'row', marginBottom: 8 },
});