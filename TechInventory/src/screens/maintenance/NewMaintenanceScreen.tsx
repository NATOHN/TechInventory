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
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
// Permite abrir el menú nativo para visualizar, guardar o compartir el PDF.
import * as Sharing from 'expo-sharing';
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
// Permite cambiar automáticamente el equipo a Taller al iniciar mantenimiento.
import { enviarEquipoATallerPorMantenimiento } from '../../redux/equipmentSlice';
// Genera la constancia PDF tamaño carta del mantenimiento.
import { generateMaintenancePdf } from '../../utils/maintenancePdf';
// Genera temporalmente el consecutivo visible MT-0001, MT-0002...
// Más adelante este valor será entregado por Supabase.
import { generateNextMaintenanceCode } from '../../utils/maintenanceCode';
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
  const { t, language } = useLanguage();

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

  // Necesitamos la lista completa únicamente para calcular
  // el próximo código visible mientras seguimos trabajando localmente.
  const maintenances = useAppSelector(
    (state) => state.maintenance.maintenances
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
  const [motivoBaja, setMotivoBaja] = useState(maintenanceExistente?.motivoBaja ?? '');
  // Evita presionar varias veces el botón mientras se genera el PDF.
  const [generandoPdf, setGenerandoPdf] = useState(false);

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

    const cantidad = Number(parteCantidad);

    // La cantidad debe ser un número entero mayor que cero.
    if (!Number.isInteger(cantidad) || cantidad <= 0) {
      Alert.alert(
        t('maintenanceInvalidQuantityTitle'),
        t('maintenanceInvalidQuantityMessage')
      );
      return;
    }

    setRepuestos((prev) => [
      ...prev,
      { nombre: parteNombre.trim(), cantidad },
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

    // Técnico y descripción continúan siendo obligatorios.
    if (!tecnico.trim() || !descripcion.trim()) {
      Alert.alert(t('incompleteFieldsTitle'), t('incompleteFieldsMessage'));
      return false;
    }

    // Si el equipo queda fuera de servicio necesitamos conocer la causa.
    if (estadoFinal === 'Fuera de servicio' && !motivoBaja.trim()) {
      Alert.alert(
        'Motivo de baja requerido',
        'Describe por qué el equipo fue determinado como fuera de servicio.'
      );
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
    // El motivo solo se conserva cuando realmente corresponde a una baja.
    motivoBaja: estadoFinal === 'Fuera de servicio' ? motivoBaja.trim() : undefined,
  });

  // 23. Guarda el mantenimiento dejandolo en_proceso, sin pasar a la firma.
  // Si ya existia, actualiza sus datos; si es nuevo, lo crea (esto es "Iniciar proceso").
  // En ambos casos regresa a la lista de mantenimientos al terminar.
  const handleGuardar = () => {
    if (!validarCampos()) return;

    if (maintenanceExistente) {
      dispatch(actualizarMantenimiento({ id: maintenanceExistente.id, ...construirDatosFormulario() }));
    } else {
      // Creamos el mantenimiento y lo dejamos oficialmente En proceso.
      dispatch(
        crearMantenimiento({
          // ID técnico temporal. Supabase lo sustituirá posteriormente por un UUID.
          id: `MT-${Date.now()}`,
          codigoMantenimiento: generateNextMaintenanceCode(maintenances),

          codigoEquipo,
          ...construirDatosFormulario(),
          status: 'en_proceso',
          fechaInicio: new Date().toISOString(),
        })
      );
      // Al iniciar el mantenimiento, el equipo pasa automáticamente a Taller.
      dispatch(enviarEquipoATallerPorMantenimiento({ codigo: codigoEquipo }));
    }

    navigation.navigate('MaintenanceScreen');
  };

  // 24. Valida los campos y navega a la pantalla de firma, sin marcar el mantenimiento como finalizado todavia.
  // Si ya existia, primero guarda los cambios editados antes de ir a firmar.
  const handleContinuarFirma = () => {
    if (!validarCampos()) return;

    // Un mantenimiento En proceso necesita un resultado antes de poder finalizarse.
    if (!estadoFinal) {
      Alert.alert(
        t('maintenanceFinalStatusRequiredTitle'),
        t('maintenanceFinalStatusRequiredMessage')
      );
      return;
    }

    const id = maintenanceExistente ? maintenanceExistente.id : `MT-${Date.now()}`;


    if (maintenanceExistente) {
      dispatch(actualizarMantenimiento({ id, ...construirDatosFormulario() }));
    } else {
      dispatch(
        crearMantenimiento({
          id,
          codigoMantenimiento: generateNextMaintenanceCode(maintenances),
          codigoEquipo,
          ...construirDatosFormulario(),
          status: 'en_proceso',
          fechaInicio: new Date().toISOString(),
        })
      );
      // El equipo debe estar en Taller antes de continuar con la firma.
      dispatch(enviarEquipoATallerPorMantenimiento({ codigo: codigoEquipo }));
    }

    navigation.navigate('SignatureScreen', { maintenanceId: id });
  };

  // 25. Titulo dinamico segun el modo en el que se abrio la pantalla.
  const titulo = maintenanceExistente
    ? soloLectura
      ? 'Detalle de mantenimiento'
      : 'Editar mantenimiento'
    : t('newMaintenanceTitle');


  // Traduce visualmente el estado final sin modificar el valor guardado en Redux.
  const getEstadoFinalLabel = (estado: string) => {
    if (estado === 'Operativo') return t('maintenanceStatusOperational');
    if (estado === 'Requiere seguimiento') return t('maintenanceStatusFollowUp');
    if (estado === 'Fuera de servicio') return t('maintenanceStatusOutOfService');

    return estado;
  };

  // Traduce visualmente las tareas predefinidas del checklist.
  // El valor interno continúa siendo el original para mantener compatibilidad.
  const getChecklistLabel = (label: string) => {
    if (label === 'Limpieza interna') return t('maintenanceChecklistInternalCleaning');
    if (label === 'Revisión de hardware') return t('maintenanceChecklistHardwareReview');
    if (label === 'Actualización de software') return t('maintenanceChecklistSoftwareUpdate');
    if (label === 'Pruebas de funcionamiento') return t('maintenanceChecklistFunctionTests');
    if (label === 'Observaciones generales') return t('maintenanceChecklistGeneralObservations');

    return label;
  };

  // 26. Texto del boton de guardar: al crear un mantenimiento nuevo se llama "Iniciar proceso",
  // al editar uno existente que sigue en_proceso se llama "Guardar".
  const textoBotonGuardar = maintenanceExistente ? 'Guardar' : 'Iniciar proceso';

  // Genera la constancia PDF del mantenimiento finalizado
  // y abre el menú nativo del dispositivo para revisarla o compartirla.
  const handleGenerarPdf = async () => {
    if (!maintenanceExistente || !equipo || maintenanceExistente.status !== 'finalizado') {
      Alert.alert('PDF no disponible', 'El mantenimiento debe estar finalizado para generar la constancia.');
      return;
    }

    try {
      setGenerandoPdf(true);

      // Creamos el archivo PDF utilizando toda la información ya almacenada.
      const pdfUri = await generateMaintenancePdf(
        maintenanceExistente,
        equipo,
        language === 'en' ? 'en' : 'es'
      );

      // Comprobamos que el dispositivo permita compartir archivos.
      const sharingAvailable = await Sharing.isAvailableAsync();

      if (!sharingAvailable) {
        Alert.alert(
          'PDF generado',
          `La constancia fue generada correctamente.\n\n${pdfUri}`
        );
        return;
      }

      // Abrimos el menú nativo. Desde aquí podremos probar correo,
      // WhatsApp, Drive u otras aplicaciones instaladas.
      await Sharing.shareAsync(pdfUri, {
        mimeType: 'application/pdf',
        dialogTitle: 'Constancia de mantenimiento',
        UTI: 'com.adobe.pdf',
      });
    } catch (error) {
      console.log('Error al generar la constancia PDF:', error);

      Alert.alert(
        'Error',
        'No se pudo generar la constancia de mantenimiento.'
      );
    } finally {
      setGenerandoPdf(false);
    }
  };

  return (
    // 27. SafeAreaView evita que el contenido quede pegado a la barra de estado o los bordes del dispositivo.
    <SafeAreaView
      edges={['top', 'left', 'right']}
      style={[styles.safeArea, { backgroundColor: colors.background }]}
    >
      {/* Ajusta la pantalla cuando aparece el teclado para no cubrir los campos inferiores. */}
      <KeyboardAvoidingView
        style={styles.keyboardContainer}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={0}
      >
        <ScrollView
          style={{ backgroundColor: colors.background }}
          contentContainerStyle={styles.container}
          keyboardShouldPersistTaps="handled"
          keyboardDismissMode="on-drag"
          showsVerticalScrollIndicator={false}
        >

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
                <Text style={styles.equipoBadgeText}>
                  {equipo.status === 'activo'
                    ? t('statusActive')
                    : equipo.status === 'taller'
                      ? t('statusWorkshop')
                      : t('statusInactive')}
                </Text>
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
            <Text style={[styles.sectionLabel, { color: colors.text, marginBottom: 0 }]}> {t('maintenanceChecklistTitle')}</Text>
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
                <Text style={[styles.checklistLabel, { color: colors.text }]}>{getChecklistLabel(item.label)}</Text>
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
                    {/* La cantidad es numérica, no un número telefónico. */}
                    <TextInput
                      style={[
                        styles.partQuantityInput,
                        {
                          backgroundColor: colors.surface,
                          borderColor: colors.border,
                          color: colors.text,
                        },
                      ]}
                      placeholder={t('maintenancePartQuantityPlaceholder')}
                      placeholderTextColor={colors.textSecondary}
                      value={parteCantidad}
                      onChangeText={setParteCantidad}
                      keyboardType="number-pad"
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

          {/* El resultado final solo se define cuando el mantenimiento ya está En proceso. */}
          {maintenanceExistente?.status === 'en_proceso' && (
            <>
              {/* 37. Seccion: estado final del equipo, mediante chips */}
              <Text style={[styles.sectionLabel, { color: colors.text }]}>{t('maintenanceFinalStatusLabel')}</Text>
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
                    <Text style={{ color: estadoFinal === op ? 'white' : colors.text, fontSize: 12 }}>{getEstadoFinalLabel(op)}</Text>
                  </TouchableOpacity>
                ))}
              </View>

              {/* Si el técnico determina daño definitivo, solicitamos obligatoriamente la causa. */}
              {estadoFinal === 'Fuera de servicio' && (
                <>
                  <Text style={[styles.sectionLabel, { color: colors.text }]}>
                    {t('maintenanceDecommissionReasonLabel')} *
                  </Text>

                  <TextInput
                    style={[
                      styles.descripcionBox,
                      {
                        height: 90,
                        backgroundColor: colors.surface,
                        borderColor: colors.border,
                        color: colors.text,
                      },
                    ]}
                    placeholder={t('maintenanceDecommissionReasonPlaceholder')}
                    placeholderTextColor={colors.textSecondary}
                    value={motivoBaja}
                    onChangeText={setMotivoBaja}
                    editable={!soloLectura}
                    multiline
                    textAlignVertical="top"
                  />
                </>
              )}
            </>
          )}


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



          {/* Un mantenimiento nuevo únicamente puede iniciarse. */}
          {!soloLectura && !maintenanceExistente && (
            <CustomButton
              title={t('maintenanceStartProcessButton')}
              onPress={handleGuardar}
            />
          )}

          {/* Una vez iniciado podemos guardar avances o finalizar el mantenimiento. */}
          {!soloLectura && maintenanceExistente?.status === 'en_proceso' && (
            <>
              <CustomButton
                title={t('maintenanceSaveChangesButton')}
                onPress={handleGuardar}
                variant="secondary"
              />

              <CustomButton
                title={t('finalizeMaintenanceButton')}
                onPress={handleContinuarFirma}
              />
            </>
          )}



          {/* Un mantenimiento finalizado puede generar su constancia en PDF. */}
          {soloLectura && maintenanceExistente && (
            <CustomButton
              title={generandoPdf ? 'Generando PDF...' : t('maintenanceGeneratePdfButton')}
              onPress={handleGenerarPdf}
            />
          )}

          <View style={{ height: 30 }} />
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView >
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1 },

  // Ocupa el espacio disponible y permite reajustarlo cuando aparece el teclado.
  keyboardContainer: {
    flex: 1,
  },
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

  firmaSection: {
    marginTop: 8
  },

  firmaBox: {
    borderWidth: 1,
    borderRadius: 12,
    padding: 12,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
  },

  firmaImage: {
    width: '100%',
    height: 140
  },

  firmaFecha: {
    fontSize: 12,
    marginTop: 6,
    textAlign: 'center'
  },

  // Campo numérico utilizado exclusivamente para la cantidad del repuesto.
  partQuantityInput: {
    minHeight: 48,
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 10,
    marginBottom: 12,
    fontSize: 14,
  },
});