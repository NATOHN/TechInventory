// 1. Importaciones
import { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  Image,
  TextInput,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../context/ThemeContext';
import { useLanguage } from '../../context/LanguageContext';
import { useAppDispatch, useAppSelector } from '../../redux/hooks';
import {
  crearMantenimiento,
  actualizarMantenimiento,
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

  // 7. Leemos los params: si viene maintenanceId, estamos editando/viendo uno existente.
  // Si viene codigoEquipo, estamos creando uno nuevo (flujo desde escaneo de QR).
  // Usamos ?? {} porque esta pantalla puede recibir params vacios si algo navega sin especificarlos.
  const { maintenanceId, codigoEquipo: codigoEquipoParam } = route.params ?? {};

  // 8. Si estamos editando, buscamos el mantenimiento existente dentro de Redux.
  const maintenanceExistente = useAppSelector((state) =>
    maintenanceId ? state.maintenance.maintenances.find((m) => m.id === maintenanceId) : undefined
  );

  // 9. El codigo real del equipo viene del mantenimiento existente (edicion) o de los params (creacion).
  const codigoEquipo = maintenanceExistente?.codigoEquipo ?? codigoEquipoParam;

  // 10. Buscamos el equipo correspondiente dentro del inventario de Redux.
  const equipments = useAppSelector((state) => state.equipment.equipments);
  const equipo = equipments.find((e) => e.codigo === codigoEquipo);

  // 11. Si el mantenimiento ya esta finalizado, la pantalla se abre en modo solo lectura.
  const soloLectura = maintenanceExistente?.status === 'finalizado';

  // 12. Estados locales del formulario: tipo y prioridad del mantenimiento.
  // Se precargan con los datos existentes cuando estamos editando.
  const [tipo, setTipo] = useState<MaintenanceType>(maintenanceExistente?.tipo ?? 'preventivo');
  const [prioridad, setPrioridad] = useState<MaintenancePriority>(maintenanceExistente?.prioridad ?? 'media');

  // 13. Tecnico responsable (por ahora un campo simple de texto).
  const [tecnico, setTecnico] = useState(maintenanceExistente?.tecnico ?? '');

  // 14. Estado local de la lista de verificacion.
  const [checklist, setChecklist] = useState<ChecklistItem[]>(
    maintenanceExistente?.checklist ?? defaultChecklist()
  );

  // 15. Estados locales para agregar repuestos de forma dinamica.
  const [parteNombre, setParteNombre] = useState('');
  const [parteCantidad, setParteCantidad] = useState('');
  const [repuestos, setRepuestos] = useState<MaintenancePart[]>(maintenanceExistente?.repuestos ?? []);

  // 16. Estado local de la descripcion del trabajo y el estado final del equipo.
  const [descripcion, setDescripcion] = useState(maintenanceExistente?.descripcion ?? '');
  const [estadoFinal, setEstadoFinal] = useState(maintenanceExistente?.estadoFinal ?? '');

  // 17. Alterna el valor checked de un elemento de la lista de verificacion.
  // No hace nada si la pantalla esta en modo solo lectura.
  const toggleChecklistItem = (index: number) => {
    if (soloLectura) return;
    setChecklist((prev) =>
      prev.map((item, i) => (i === index ? { ...item, checked: !item.checked } : item))
    );
  };

  // 18. Agrega un repuesto nuevo al arreglo local, si los campos son validos.
  const agregarRepuesto = () => {
    if (soloLectura) return;
    if (!parteNombre.trim() || !parteCantidad.trim()) return;
    setRepuestos((prev) => [
      ...prev,
      { nombre: parteNombre.trim(), cantidad: Number(parteCantidad) },
    ]);
    setParteNombre('');
    setParteCantidad('');
  };

  // 19. Elimina un repuesto del arreglo local segun su posicion.
  const quitarRepuesto = (index: number) => {
    if (soloLectura) return;
    setRepuestos((prev) => prev.filter((_, i) => i !== index));
  };

  // 20. Calcula cuantos elementos del checklist estan marcados, para mostrar el progreso.
  const checklistCompletado = checklist.filter((item) => item.checked).length;

  // 21. Valida los campos obligatorios antes de continuar.
  const validarCampos = () => {
    if (!tecnico.trim() || !descripcion.trim()) {
      Alert.alert(t('incompleteFieldsTitle'), t('incompleteFieldsMessage'));
      return false;
    }
    return true;
  };

  // 22. Construye el objeto de datos editables, comun para crear y actualizar.
  const construirDatosFormulario = () => ({
    tecnico: tecnico.trim(),
    tipo,
    prioridad,
    checklist,
    repuestos,
    descripcion: descripcion.trim(),
    estadoFinal: estadoFinal || undefined,
  });

  // 23. Guarda el mantenimiento dejandolo en_proceso, sin pasar a la firma.
  // Si ya existia, actualiza sus datos; si es nuevo, lo crea (esto es "Iniciar proceso").
  // En ambos casos regresa a la lista de mantenimientos al terminar.
  const handleGuardar = () => {
    if (!validarCampos()) return;

    if (maintenanceExistente) {
      dispatch(actualizarMantenimiento({ id: maintenanceExistente.id, ...construirDatosFormulario() }));
    } else {
      dispatch(
        crearMantenimiento({
          id: `MT-${Date.now()}`,
          codigoEquipo,
          ...construirDatosFormulario(),
          status: 'en_proceso',
          fechaInicio: new Date().toISOString(),
        })
      );
    }

    navigation.navigate('MaintenanceScreen');
  };

  // 24. Valida los campos y navega a la pantalla de firma, sin marcar el mantenimiento como finalizado todavia.
  // Si ya existia, primero guarda los cambios editados antes de ir a firmar.
  const handleContinuarFirma = () => {
    if (!validarCampos()) return;

    const id = maintenanceExistente ? maintenanceExistente.id : `MT-${Date.now()}`;

    if (maintenanceExistente) {
      dispatch(actualizarMantenimiento({ id, ...construirDatosFormulario() }));
    } else {
      dispatch(
        crearMantenimiento({
          id,
          codigoEquipo,
          ...construirDatosFormulario(),
          status: 'en_proceso',
          fechaInicio: new Date().toISOString(),
        })
      );
    }

    navigation.navigate('SignatureScreen', { maintenanceId: id });
  };

  // 25. Titulo dinamico segun el modo en el que se abrio la pantalla.
  const titulo = maintenanceExistente
    ? soloLectura
      ? 'Detalle de mantenimiento'
      : 'Editar mantenimiento'
    : t('newMaintenanceTitle');

  // 26. Texto del boton de guardar: al crear un mantenimiento nuevo se llama "Iniciar proceso",
  // al editar uno existente que sigue en_proceso se llama "Guardar".
  const textoBotonGuardar = maintenanceExistente ? 'Guardar' : 'Iniciar proceso';

  return (
    // 27. SafeAreaView evita que el contenido quede pegado a la barra de estado o los bordes del dispositivo.
    <SafeAreaView edges={['top', 'left', 'right']} style={[styles.safeArea, { backgroundColor: colors.background }]}>
      <ScrollView style={{ backgroundColor: colors.background }} contentContainerStyle={styles.container}>

        {/* 28. Encabezado con boton de regreso y titulo */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Ionicons name="arrow-back" size={24} color={colors.text} />
          </TouchableOpacity>
          <Text style={[styles.title, { color: colors.primary }]}>{titulo}</Text>
        </View>

        {/* 29. Tarjeta con la informacion del equipo identificado */}
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

        {/* 30. Seccion: tipo de mantenimiento, mediante toggle */}
        <Text style={[styles.sectionLabel, { color: colors.text }]}>Tipo de mantenimiento</Text>
        <View style={styles.toggleRow}>
          {(['preventivo', 'correctivo'] as MaintenanceType[]).map((op) => (
            <TouchableOpacity
              key={op}
              disabled={soloLectura}
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

        {/* 31. Seccion: tecnico responsable */}
        <Text style={[styles.sectionLabel, { color: colors.text }]}>{t('maintenanceTechnicianLabel')}</Text>
        <CustomInput
          type="text"
          placeholder={t('maintenanceTechnicianLabel')}
          value={tecnico}
          onChange={setTecnico}
        />

        {/* 32. Seccion: prioridad, mediante chips */}
        <Text style={[styles.sectionLabel, { color: colors.text }]}>{t('maintenancePriorityLabel')}</Text>
        <View style={styles.chipRow}>
          {(['baja', 'media', 'alta'] as MaintenancePriority[]).map((op) => (
            <TouchableOpacity
              key={op}
              disabled={soloLectura}
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

        {/* 33. Seccion: lista de verificacion con checkboxes y contador de progreso */}
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
              disabled={soloLectura}
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

        {/* 34. Seccion: repuestos utilizados, con agregado dinamico */}
        <Text style={[styles.sectionLabel, { color: colors.text }]}>{t('maintenancePartsTitle')}</Text>
        <View style={[styles.partsBox, { backgroundColor: colors.surface, borderColor: colors.border }]}>
          {repuestos.map((rep, index) => (
            <View key={index} style={styles.partRow}>
              <Text style={{ color: colors.text, flex: 1 }}>{rep.nombre} — {rep.cantidad} unidad(es)</Text>
              {!soloLectura && (
                <TouchableOpacity onPress={() => quitarRepuesto(index)}>
                  <Ionicons name="close-circle" size={20} color="red" />
                </TouchableOpacity>
              )}
            </View>
          ))}

          {/* 35. El formulario para agregar un repuesto nuevo no se muestra en modo solo lectura */}
          {!soloLectura && (
            <>
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
            </>
          )}
        </View>

              {/* 36. Seccion: descripcion del trabajo realizado, tipo reporte con su propio scroll interno */}
      <Text style={[styles.sectionLabel, { color: colors.text }]}>{t('maintenanceDescriptionPlaceholder')}</Text>
      <TextInput
        style={[
          styles.descripcionBox,
          { backgroundColor: colors.surface, borderColor: colors.border, color: colors.text },
        ]}
        placeholder={t('maintenanceDescriptionPlaceholder')}
        placeholderTextColor={colors.textSecondary}
        value={descripcion}
        onChangeText={setDescripcion}
        editable={!soloLectura}
        multiline
        textAlignVertical="top"
        scrollEnabled
        blurOnSubmit={false}
      />

        {/* 37. Seccion: estado final del equipo, mediante chips */}
        <Text style={[styles.sectionLabel, { color: colors.text }]}>Estado final</Text>
        <View style={styles.chipRow}>
          {ESTADOS_FINALES.map((op) => (
            <TouchableOpacity
              key={op}
              disabled={soloLectura}
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

        {/* 38. Seccion: firma del tecnico, solo visible en modo solo lectura y si el mantenimiento tiene una firma guardada */}
        {soloLectura && maintenanceExistente?.firmaBase64 && (
          <View style={styles.firmaSection}>
            <Text style={[styles.sectionLabel, { color: colors.text }]}>Firma del técnico</Text>
            <View style={[styles.firmaBox, { borderColor: colors.border }]}>
              <Image
                source={{ uri: maintenanceExistente.firmaBase64 }}
                style={styles.firmaImage}
                resizeMode="contain"
              />
            </View>
            {maintenanceExistente.fechaFinalizacion && (
              <Text style={[styles.firmaFecha, { color: colors.textSecondary }]}>
                Firmado el {new Date(maintenanceExistente.fechaFinalizacion).toLocaleDateString()}
              </Text>
            )}
          </View>
        )}

        {/* 39. Botones finales: solo se muestran cuando la pantalla permite editar */}
        {!soloLectura && (
          <>
            <CustomButton title={textoBotonGuardar} onPress={handleGuardar} variant="secondary" />
            <CustomButton title={t('finalizeMaintenanceButton') || 'Continuar a firma'} onPress={handleContinuarFirma} />
          </>
        )}

        <View style={{ height: 30 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1 },
  container: { paddingHorizontal: 16, paddingTop: 20, paddingBottom: 30 },
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
  // 40. Caja de descripcion tipo reporte: alto fijo, multilinea y con scroll interno propio,
  // que no interfiere con el scroll general de la pantalla.
  descripcionBox: {
    borderWidth: 1,
    borderRadius: 12,
    padding: 12,
    height: 120,
    fontSize: 14,
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
  firmaSection: { marginTop: 8 },
  firmaBox: {
    borderWidth: 1,
    borderRadius: 12,
    padding: 12,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
  },
  firmaImage: { width: '100%', height: 140 },
  firmaFecha: { fontSize: 12, marginTop: 6, textAlign: 'center' },
});