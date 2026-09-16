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
import {
  crearMantenimiento,
  ChecklistItem,
  MaintenancePart,
  MaintenancePriority,
  MaintenanceType,
} from '../../redux/maintenanceSlice';
import CustomInput from '../../components/CustomInput';
import CustomButton from '../../components/CustomButton';

// 2. Checklist por defecto que se muestra al crear un mantenimiento nuevo.
const defaultChecklist = (): ChecklistItem[] => [
  { label: 'Limpieza interna', checked: false },
  { label: 'Revisión de hardware', checked: false },
  { label: 'Actualización de software', checked: false },
  { label: 'Pruebas de funcionamiento', checked: false },
  { label: 'Observaciones generales', checked: false },
];

// 3. Opciones disponibles para el estado final del equipo tras el mantenimiento.
const ESTADOS_FINALES = ['Operativo', 'Requiere seguimiento', 'Fuera de servicio'];

export default function NewMaintenanceScreen({ navigation, route }: any) {
  // 4. Obtenemos la paleta de colores actual desde ThemeContext.
  const { colors } = useTheme();

  // 5. Obtenemos la función t desde LanguageContext para mostrar los textos traducidos.
  const { t } = useLanguage();

  // 6. Obtenemos dispatch para poder enviar acciones a Redux.
  const dispatch = useAppDispatch();

  // 7. Leemos el codigo de equipo recibido desde la pantalla anterior.
  const { codigoEquipo } = route.params;

  // 8. Buscamos el equipo correspondiente dentro del inventario de Redux.
  const equipments = useAppSelector((state) => state.equipment.equipments);
  const equipo = equipments.find((e) => e.codigo === codigoEquipo);

  // 9. Estados locales del formulario: tipo y prioridad del mantenimiento.
  const [tipo, setTipo] = useState<MaintenanceType>('preventivo');
  const [prioridad, setPrioridad] = useState<MaintenancePriority>('media');

  // 10. Tecnico responsable (por ahora un campo simple de texto).
  const [tecnico, setTecnico] = useState('');

  // 11. Estado local de la lista de verificacion.
  const [checklist, setChecklist] = useState<ChecklistItem[]>(defaultChecklist());

  // 12. Estados locales para agregar repuestos de forma dinamica.
  const [parteNombre, setParteNombre] = useState('');
  const [parteCantidad, setParteCantidad] = useState('');
  const [repuestos, setRepuestos] = useState<MaintenancePart[]>([]);

  // 13. Estado local de la descripcion del trabajo y el estado final del equipo.
  const [descripcion, setDescripcion] = useState('');
  const [estadoFinal, setEstadoFinal] = useState('');

  // 14. Alterna el valor checked de un elemento de la lista de verificacion.
  const toggleChecklistItem = (index: number) => {
    setChecklist((prev) =>
      prev.map((item, i) => (i === index ? { ...item, checked: !item.checked } : item))
    );
  };

  // 15. Agrega un repuesto nuevo al arreglo local, si los campos son validos.
  const agregarRepuesto = () => {
    if (!parteNombre.trim() || !parteCantidad.trim()) return;
    setRepuestos((prev) => [
      ...prev,
      { nombre: parteNombre.trim(), cantidad: Number(parteCantidad) },
    ]);
    setParteNombre('');
    setParteCantidad('');
  };

  // 16. Elimina un repuesto del arreglo local segun su posicion.
  const quitarRepuesto = (index: number) => {
    setRepuestos((prev) => prev.filter((_, i) => i !== index));
  };

  // 17. Calcula cuantos elementos del checklist estan marcados, para mostrar el progreso.
  const checklistCompletado = checklist.filter((item) => item.checked).length;

  // 18. Valida los campos obligatorios antes de continuar.
  const validarCampos = () => {
    if (!tecnico.trim() || !descripcion.trim()) {
      Alert.alert(t('incompleteFieldsTitle'), t('incompleteFieldsMessage'));
      return false;
    }
    return true;
  };

  // 19. Guarda el mantenimiento dejandolo en_proceso, sin pasar a la firma.
  const handleGuardar = () => {
    if (!validarCampos()) return;

    dispatch(
      crearMantenimiento({
        id: `MT-${Date.now()}`,
        codigoEquipo,
        tecnico: tecnico.trim(),
        tipo,
        prioridad,
        checklist,
        repuestos,
        descripcion: descripcion.trim(),
        estadoFinal: estadoFinal || undefined,
        status: 'en_proceso',
        fechaInicio: new Date().toISOString(),
      })
    );

    navigation.navigate('MaintenanceScreen');
  };

  // 20. Valida los campos y navega a la pantalla de firma, sin guardar como finalizado todavia.
  const handleContinuarFirma = () => {
    if (!validarCampos()) return;

    // 21. Creamos el mantenimiento en_proceso primero, y navegamos a la firma con su id.
    const id = `MT-${Date.now()}`;

    dispatch(
      crearMantenimiento({
        id,
        codigoEquipo,
        tecnico: tecnico.trim(),
        tipo,
        prioridad,
        checklist,
        repuestos,
        descripcion: descripcion.trim(),
        estadoFinal: estadoFinal || undefined,
        status: 'en_proceso',
        fechaInicio: new Date().toISOString(),
      })
    );

    navigation.navigate('SignatureScreen', { maintenanceId: id });
  };

  return (
    <ScrollView style={[styles.container, { backgroundColor: colors.background }]}>

      {/* 22. Encabezado con boton de regreso y titulo */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color={colors.text} />
        </TouchableOpacity>
        <Text style={[styles.title, { color: colors.primary }]}>{t('newMaintenanceTitle')}</Text>
      </View>

      {/* 23. Tarjeta con la informacion del equipo identificado */}
      {equipo && (
        <View style={[styles.equipoCard, { backgroundColor: colors.surface, borderColor: colors.border }]}>
          <Ionicons name="hardware-chip-outline" size={32} color={colors.textSecondary} />
          <View style={{ flex: 1 }}>
            <Text style={[styles.equipoCodigo, { color: colors.text }]}>{equipo.codigo}</Text>
            <Text style={[styles.equipoModelo, { color: colors.text }]}>{equipo.marca} {equipo.modelo}</Text>
            <Text style={[styles.equipoSerie, { color: colors.textSecondary }]}>Serie: {equipo.serie}</Text>
          </View>
          <View style={styles.equipoBadge}>
            <Text style={styles.equipoBadgeText}>{equipo.status === 'activo' ? 'Activo' : equipo.status}</Text>
          </View>
        </View>
      )}

      {/* 24. Seccion: tipo de mantenimiento, mediante toggle */}
      <Text style={[styles.sectionLabel, { color: colors.text }]}>Tipo de mantenimiento</Text>
      <View style={styles.toggleRow}>
        {(['preventivo', 'correctivo'] as MaintenanceType[]).map((op) => (
          <TouchableOpacity
            key={op}
            style={[
              styles.toggleOption,
              {
                backgroundColor: tipo === op ? colors.primary : colors.surface,
                borderColor: colors.border,
              },
            ]}
            onPress={() => setTipo(op)}
          >
            <Text style={{ color: tipo === op ? 'white' : colors.text, fontWeight: '600' }}>
              {op === 'preventivo' ? t('maintenanceTypePreventive') : t('maintenanceTypeCorrective')}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* 25. Seccion: tecnico responsable */}
      <Text style={[styles.sectionLabel, { color: colors.text }]}>{t('maintenanceTechnicianLabel')}</Text>
      <CustomInput
        type="text"
        placeholder={t('maintenanceTechnicianLabel')}
        value={tecnico}
        onChange={setTecnico}
      />

      {/* 26. Seccion: prioridad, mediante chips */}
      <Text style={[styles.sectionLabel, { color: colors.text }]}>{t('maintenancePriorityLabel')}</Text>
      <View style={styles.chipRow}>
        {(['baja', 'media', 'alta'] as MaintenancePriority[]).map((op) => (
          <TouchableOpacity
            key={op}
            style={[
              styles.chip,
              {
                backgroundColor: prioridad === op ? colors.primary : colors.surface,
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

      {/* 27. Seccion: lista de verificacion con checkboxes y contador de progreso */}
      <View style={styles.checklistHeader}>
        <Text style={[styles.sectionLabel, { color: colors.text, marginBottom: 0 }]}>Lista de verificación</Text>
        <Text style={[styles.checklistCount, { color: colors.textSecondary }]}>
          {checklistCompletado}/{checklist.length}
        </Text>
      </View>
      <View style={[styles.checklistBox, { backgroundColor: colors.surface, borderColor: colors.border }]}>
        {checklist.map((item, index) => (
          <TouchableOpacity
            key={item.label}
            style={styles.checklistRow}
            onPress={() => toggleChecklistItem(index)}
          >
            <Ionicons
              name={item.checked ? 'checkbox' : 'square-outline'}
              size={22}
              color={item.checked ? colors.primary : colors.textSecondary}
            />
            <Text style={[styles.checklistLabel, { color: colors.text }]}>{item.label}</Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* 28. Seccion: repuestos utilizados, con agregado dinamico */}
      <Text style={[styles.sectionLabel, { color: colors.text }]}>{t('maintenancePartsTitle')}</Text>
      <View style={[styles.partsBox, { backgroundColor: colors.surface, borderColor: colors.border }]}>
        {repuestos.map((rep, index) => (
          <View key={index} style={styles.partRow}>
            <Text style={{ color: colors.text, flex: 1 }}>{rep.nombre} — {rep.cantidad} unidad(es)</Text>
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

        <TouchableOpacity
          style={[styles.addPartButton, { borderColor: colors.primary }]}
          onPress={agregarRepuesto}
        >
          <Ionicons name="add-circle-outline" size={18} color={colors.primary} />
          <Text style={{ color: colors.primary, fontWeight: '600' }}>{t('addPartButton')}</Text>
        </TouchableOpacity>
      </View>

      {/* 29. Seccion: descripcion del trabajo realizado */}
      <Text style={[styles.sectionLabel, { color: colors.text }]}>{t('maintenanceDescriptionPlaceholder')}</Text>
      <CustomInput
        type="text"
        placeholder={t('maintenanceDescriptionPlaceholder')}
        value={descripcion}
        onChange={setDescripcion}
      />

      {/* 30. Seccion: estado final del equipo, mediante chips */}
      <Text style={[styles.sectionLabel, { color: colors.text }]}>Estado final</Text>
      <View style={styles.chipRow}>
        {ESTADOS_FINALES.map((op) => (
          <TouchableOpacity
            key={op}
            style={[
              styles.chip,
              {
                backgroundColor: estadoFinal === op ? colors.primary : colors.surface,
                borderColor: colors.border,
              },
            ]}
            onPress={() => setEstadoFinal(op)}
          >
            <Text style={{ color: estadoFinal === op ? 'white' : colors.text, fontSize: 12 }}>{op}</Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* 31. Botones finales: guardar en proceso, o continuar directo a la firma */}
      <CustomButton title="Guardar" onPress={handleGuardar} variant="secondary" />
      <CustomButton title={t('finalizeMaintenanceButton') || 'Continuar a firma'} onPress={handleContinuarFirma} />

      <View style={{ height: 30 }} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16 },
  header: { flexDirection: 'row', alignItems: 'center', gap: 12, marginBottom: 16 },
  title: { fontSize: 20, fontWeight: 'bold' },
  equipoCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    borderWidth: 1,
    borderRadius: 14,
    padding: 12,
    marginBottom: 20,
  },
  equipoCodigo: { fontSize: 15, fontWeight: '700' },
  equipoModelo: { fontSize: 13 },
  equipoSerie: { fontSize: 11 },
  equipoBadge: {
    backgroundColor: '#D1FAE5',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
  },
  equipoBadgeText: { color: '#059669', fontSize: 11, fontWeight: '700' },
  sectionLabel: { fontSize: 14, fontWeight: '700', marginBottom: 8, marginTop: 16 },
  toggleRow: { flexDirection: 'row', gap: 8 },
  toggleOption: {
    flex: 1,
    borderWidth: 1,
    borderRadius: 10,
    paddingVertical: 12,
    alignItems: 'center',
  },
  chipRow: { flexDirection: 'row', gap: 8, flexWrap: 'wrap' },
  chip: { borderWidth: 1, borderRadius: 8, paddingVertical: 8, paddingHorizontal: 12 },
  checklistHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  checklistCount: { fontSize: 13 },
  checklistBox: { borderWidth: 1, borderRadius: 12, padding: 12, gap: 12 },
  checklistRow: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  checklistLabel: { fontSize: 14 },
  partsBox: { borderWidth: 1, borderRadius: 12, padding: 12, gap: 8 },
  partRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  partInputRow: { flexDirection: 'row', marginTop: 4 },
  addPartButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    borderWidth: 1,
    borderRadius: 8,
    paddingVertical: 10,
    marginTop: 4,
  },
});