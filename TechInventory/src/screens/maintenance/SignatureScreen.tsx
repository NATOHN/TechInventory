// 1. Importaciones
import { useRef, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import ViewShot from 'react-native-view-shot';
// Permite compartir automáticamente la constancia después de firmar.
import * as Sharing from 'expo-sharing';



import { useTheme } from '../../context/ThemeContext';
// Permite mostrar la constancia en el idioma seleccionado por el usuario.
import { useLanguage } from '../../context/LanguageContext';
import { useAppDispatch, useAppSelector } from '../../redux/hooks';
import { finalizarMantenimiento } from '../../redux/maintenanceSlice';
// Permite devolver el equipo a Activo cuando termina correctamente el mantenimiento.
import { activarEquipoTrasMantenimiento, cambiarUbicacionEquipo, darDeBajaEquipoPorMantenimiento, } from '../../redux/equipmentSlice';
// Genera la constancia PDF utilizando la información final del mantenimiento.
import { generateMaintenancePdf } from '../../utils/maintenancePdf';
import SignaturePad, { SignaturePadRef } from '../../components/SignaturePad';
import CustomButton from '../../components/CustomButton';

export default function SignatureScreen({ navigation, route }: any) {
  // 2. Obtenemos la paleta de colores actual desde ThemeContext.
  const { colors } = useTheme();

  // Obtenemos las traducciones de la aplicación.
  const { t, language } = useLanguage();

  // 3. Obtenemos dispatch para poder enviar acciones a Redux.
  const dispatch = useAppDispatch();

  // 4. Leemos el id del mantenimiento que se va a finalizar con esta firma.
  const { maintenanceId } = route.params;

  // Buscamos el mantenimiento que se está finalizando.
  const maintenance = useAppSelector((state) =>
    state.maintenance.maintenances.find((item) => item.id === maintenanceId)
  );

  // Buscamos el equipo relacionado para saber quién debe firmar la conformidad.
  const equipo = useAppSelector((state) =>
    maintenance
      ? state.equipment.equipments.find(
        (item) => item.codigo === maintenance.codigoEquipo
      )
      : undefined
  );

  // Consultamos si el mismo equipo tiene otro mantenimiento todavía En proceso.
  const tieneOtroMantenimientoEnProceso = useAppSelector((state) =>
    maintenance
      ? state.maintenance.maintenances.some(
        (item) =>
          item.codigoEquipo === maintenance.codigoEquipo &&
          item.status === 'en_proceso' &&
          item.id !== maintenanceId
      )
      : false
  );

  // 5. Referencia al SignaturePad, para poder limpiarlo y consultar si esta vacio.
  const signatureRef = useRef<SignaturePadRef>(null);

  // 6. Referencia al ViewShot que envuelve el lienzo, para poder capturarlo como imagen.
  const viewShotRef = useRef<ViewShot>(null);

  // 7. Controla que no se pueda confirmar dos veces mientras se procesa la captura.
  const [guardando, setGuardando] = useState(false);

  // Traduce visualmente el resultado final sin modificar el valor guardado.
  const getEstadoFinalLabel = (estado?: string) => {
    if (!estado) return t('maintenanceNotSpecified');
    if (estado === 'Operativo') return t('maintenanceStatusOperational');
    if (estado === 'Requiere seguimiento') return t('maintenanceStatusFollowUp');
    if (estado === 'Fuera de servicio') return t('maintenanceStatusOutOfService');

    return estado;
  };

  // Traduce visualmente las tareas predefinidas del mantenimiento.
  const getChecklistLabel = (label: string) => {
    if (label === 'Limpieza interna') return t('maintenanceChecklistInternalCleaning');
    if (label === 'Revisión de hardware') return t('maintenanceChecklistHardwareReview');
    if (label === 'Actualización de software') return t('maintenanceChecklistSoftwareUpdate');
    if (label === 'Pruebas de funcionamiento') return t('maintenanceChecklistFunctionTests');
    if (label === 'Observaciones generales') return t('maintenanceChecklistGeneralObservations');

    return label;
  };

  // 8. Limpia el lienzo de firma para volver a empezar.
  const handleLimpiar = () => {
    signatureRef.current?.clear();
  };

  // 9. Captura la firma como imagen PNG y finaliza el mantenimiento en Redux.
  const handleConfirmar = async () => {
    if (signatureRef.current?.isEmpty()) {
      Alert.alert(
        t('maintenanceSignatureRequiredTitle'),
        t('maintenanceSignatureRequiredMessage')
      );
      return;
    }

    // Necesitamos ambos registros para poder finalizar y generar la constancia.
    if (!maintenance || !equipo) {
      Alert.alert('Error', t('maintenanceSignatureSaveError'));
      return;
    }

    try {
      setGuardando(true);

      // Esperamos brevemente para asegurar que el último trazo se haya renderizado.
      await new Promise((resolve) => setTimeout(resolve, 150));

      // Capturamos la firma como imagen base64.
      const uri = await viewShotRef.current?.capture?.();

      if (!uri) {
        Alert.alert('Error', t('maintenanceSignatureCaptureError'));
        setGuardando(false);
        return;
      }

      // Conservamos los mismos datos tanto para Redux como para el PDF.
      const firmadoPorNombre = equipo.empleadoAsignado || 'Sin asignar';
      const fechaFinalizacion = new Date().toISOString();

      // Finalizamos el mantenimiento y almacenamos la firma.
      dispatch(
        finalizarMantenimiento({
          id: maintenanceId,
          firmaBase64: uri,
          firmadoPorNombre,
        })
      );

      // Si existe daño definitivo, el equipo pasa a Baja.
      if (maintenance.estadoFinal === 'Fuera de servicio') {
        // Conservamos sucursal y departamento; únicamente quitamos la asignación.
        // El cambio queda registrado en el historial del equipo.
        if (equipo.empleadoAsignado && equipo.empleadoAsignado !== 'Sin asignar') {
          dispatch(
            cambiarUbicacionEquipo({
              codigo: equipo.codigo,
              sucursal: equipo.sucursal,
              departamento: equipo.departamento,
              empleadoAsignado: 'Sin asignar',
            })
          );
        }

        dispatch(
          darDeBajaEquipoPorMantenimiento({
            codigo: maintenance.codigoEquipo,
            motivo:
              maintenance.motivoBaja?.trim() ||
              'Daño definitivo detectado durante mantenimiento',
          })
        );
      }

      // En una finalización normal, el equipo vuelve de Taller a Activo.
      else if (!tieneOtroMantenimientoEnProceso) {
        dispatch(
          activarEquipoTrasMantenimiento({
            codigo: maintenance.codigoEquipo,
          })
        );
      }

      // Creamos una copia ya finalizada para generar el PDF inmediatamente.
      // No esperamos al siguiente render de Redux porque ya tenemos todos los datos necesarios.
      const mantenimientoFinalizado = {
        ...maintenance,
        status: 'finalizado' as const,
        firmaBase64: uri,
        firmadoPorNombre,
        fechaFinalizacion,
        fechaFirma: fechaFinalizacion,
      };

      let pdfUri: string;

      try {
        // Generamos automáticamente la constancia después de registrar la firma.
        pdfUri = await generateMaintenancePdf(
          mantenimientoFinalizado,
          equipo,
          language === 'en' ? 'en' : 'es'
        );
      } catch (pdfError) {
        console.log('Error al generar automáticamente la constancia:', pdfError);
        setGuardando(false);

        // El mantenimiento ya quedó finalizado; solamente falló el PDF.
        Alert.alert(
          t('maintenancePdfGenerationErrorTitle'),
          t('maintenancePdfGenerationErrorMessage'),
          [
            {
              text: t('maintenanceCloseButton'),
              onPress: () => navigation.navigate('MaintenanceScreen'),
            },
          ],
          { cancelable: false }
        );

        return;
      }

      // Revisamos si el dispositivo permite compartir archivos.
      const sharingAvailable = await Sharing.isAvailableAsync().catch(() => false);

      setGuardando(false);

      // Acción común utilizada tanto por Cerrar como después de Compartir.
      const cerrarYRegresar = () => {
        navigation.navigate('MaintenanceScreen');
      };

      // Si el dispositivo no permite compartir, igualmente dejamos cerrar normalmente.
      if (!sharingAvailable) {
        Alert.alert(
          t('maintenanceFinishedTitle'),
          t('maintenancePdfReadyMessage'),
          [
            {
              text: t('maintenanceCloseButton'),
              onPress: cerrarYRegresar,
            },
          ],
          { cancelable: false }
        );

        return;
      }

      // El PDF ya existe: el usuario decide compartirlo o simplemente cerrar.
      Alert.alert(
        t('maintenanceFinishedTitle'),
        t('maintenancePdfReadyMessage'),
        [
          {
            text: t('maintenanceCloseButton'),
            style: 'cancel',
            onPress: cerrarYRegresar,
          },
          {
            text: t('maintenanceShareCertificateButton'),
            onPress: async () => {
              try {
                await Sharing.shareAsync(pdfUri, {
                  mimeType: 'application/pdf',
                  dialogTitle: t('maintenanceCertificateTitle'),
                  UTI: 'com.adobe.pdf',
                });
              } catch (shareError) {
                console.log('Error al compartir la constancia:', shareError);
              } finally {
                // Compartido o cancelado el menú nativo, regresamos a Mantenimiento.
                cerrarYRegresar();
              }
            },
          },
        ],
        { cancelable: false }
      );
    } catch (error) {
      console.log('Error al finalizar el mantenimiento:', error);
      setGuardando(false);
      Alert.alert('Error', t('maintenanceSignatureSaveError'));
    }
  };

  return (
    // 14. SafeAreaView evita que el contenido quede pegado a los bordes del dispositivo.
    <SafeAreaView edges={['top', 'left', 'right']} style={[styles.safeArea, { backgroundColor: colors.background }]}>
      <ScrollView style={{ backgroundColor: colors.background }} contentContainerStyle={styles.container}>

        {/* 15. Encabezado con boton de regreso y titulo */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Ionicons name="arrow-back" size={24} color={colors.text} />
          </TouchableOpacity>
          {/* La firma corresponde al empleado responsable del equipo. */}
          <Text style={[styles.title, { color: colors.primary }]}>{t('maintenanceCertificateTitle')}</Text>
        </View>

        <Text style={[styles.instructions, { color: colors.textSecondary }]}>
          {t('maintenanceCertificateInstructions')}
        </Text>

        {/* Resumen de la constancia que el empleado revisará antes de firmar. */}
        {maintenance && equipo && (
          <View
            style={[
              styles.summaryCard,
              {
                backgroundColor: colors.surface,
                borderColor: colors.border,
              },
            ]}
          >
            <Text style={[styles.summaryTitle, { color: colors.text }]}>
              {t('maintenanceInfoTitle')}
            </Text>

            {/* Identificación del equipo. */}
            <View style={styles.summaryRow}>
              <Text style={[styles.summaryLabel, { color: colors.textSecondary }]}>{t('maintenanceEquipmentLabel')}</Text>
              <Text style={[styles.summaryValue, { color: colors.text }]}>
                {equipo.codigo}
              </Text>
            </View>

            <View style={styles.summaryRow}>
              <Text style={[styles.summaryLabel, { color: colors.textSecondary }]}>{t('maintenanceBrandModelLabel')}</Text>
              <Text style={[styles.summaryValue, { color: colors.text }]}>
                {equipo.marca} {equipo.modelo}
              </Text>
            </View>

            <View style={styles.summaryRow}>
              <Text style={[styles.summaryLabel, { color: colors.textSecondary }]}>{t('seriesLabel')}</Text>
              <Text style={[styles.summaryValue, { color: colors.text }]}>
                {equipo.serie}
              </Text>
            </View>

            {/* Información técnica del trabajo realizado. */}
            <View style={styles.summaryDivider} />

            <View style={styles.summaryRow}>
              <Text style={[styles.summaryLabel, { color: colors.textSecondary }]}>{t('maintenanceTypeLabel')}</Text>
              <Text style={[styles.summaryValue, { color: colors.text }]}>
                {maintenance.tipo === 'preventivo'
                  ? t('maintenanceTypePreventive')
                  : t('maintenanceTypeCorrective')
                }
              </Text>
            </View>

            <View style={styles.summaryRow}>
              <Text style={[styles.summaryLabel, { color: colors.textSecondary }]}>{t('maintenanceTechnicianLabel')}</Text>
              <Text style={[styles.summaryValue, { color: colors.text }]}>
                {maintenance.tecnico}
              </Text>
            </View>

            <View style={styles.summaryRow}>
              <Text style={[styles.summaryLabel, { color: colors.textSecondary }]}>{t('maintenanceResultLabel')}</Text>
              <Text style={[styles.summaryValue, { color: colors.text }]}>
                {getEstadoFinalLabel(maintenance.estadoFinal)}
              </Text>
            </View>

            {/* Descripción registrada por el técnico. */}
            <Text style={[styles.summarySectionLabel, { color: colors.textSecondary }]}>
              {t('maintenanceWorkPerformedLabel')}
            </Text>
            <Text style={[styles.summaryDescription, { color: colors.text }]}>
              {maintenance.descripcion}
            </Text>

            {/* Tareas que realmente fueron marcadas como realizadas. */}
            <Text style={[styles.summarySectionLabel, { color: colors.textSecondary }]}>
              {t('maintenanceCompletedTasksLabel')}
            </Text>

            {maintenance.checklist.filter((item) => item.checked).length > 0 ? (
              maintenance.checklist
                .filter((item) => item.checked)
                .map((item, index) => (
                  <View key={`${item.label}-${index}`} style={styles.summaryListItem}>
                    <Ionicons name="checkmark-circle-outline" size={17} color={colors.primary} />
                    <Text style={[styles.summaryListText, { color: colors.text }]}>
                      {getChecklistLabel(item.label)}
                    </Text>
                  </View>
                ))
            ) : (
              <Text style={[styles.summaryEmpty, { color: colors.textSecondary }]}>
                {t('maintenanceNoTasks')}
              </Text>
            )}

            {/* Repuestos utilizados durante el mantenimiento. */}
            <Text style={[styles.summarySectionLabel, { color: colors.textSecondary }]}>
              {t('maintenancePartsUsedLabel')}
            </Text>

            {maintenance.repuestos.length > 0 ? (
              maintenance.repuestos.map((repuesto, index) => (
                <View key={`${repuesto.nombre}-${index}`} style={styles.summaryListItem}>
                  <Ionicons name="hardware-chip-outline" size={17} color={colors.primary} />
                  <Text style={[styles.summaryListText, { color: colors.text }]}>
                    {repuesto.nombre} · {t('maintenanceQuantityLabel')}: {repuesto.cantidad}
                  </Text>
                </View>
              ))
            ) : (
              <Text style={[styles.summaryEmpty, { color: colors.textSecondary }]}>
                {t('maintenanceNoParts')}
              </Text>
            )}

            {/* El motivo también forma parte de la constancia si terminó en baja. */}
            {maintenance.estadoFinal === 'Fuera de servicio' && maintenance.motivoBaja && (
              <>
                <Text style={[styles.summarySectionLabel, { color: colors.textSecondary }]}>
                  {t('maintenanceDecommissionReasonLabel')}
                </Text>

                <Text style={[styles.summaryDescription, { color: colors.text }]}>
                  {maintenance.motivoBaja}
                </Text>
              </>
            )}
          </View>
        )}

        {/* Mostramos el responsable actual del equipo antes de solicitar la firma. */}
        <View
          style={[
            styles.employeeCard,
            {
              backgroundColor: colors.surface,
              borderColor: colors.border,
            },
          ]}
        >
          <View style={styles.employeeIcon}>
            <Ionicons name="person-outline" size={20} color={colors.primary} />
          </View>

          <View style={{ flex: 1 }}>
            <Text style={[styles.employeeLabel, { color: colors.textSecondary }]}>
              {t('maintenanceSignatureRequiredFrom')}
            </Text>

            <Text style={[styles.employeeName, { color: colors.text }]}>
              {equipo?.empleadoAsignado || t('maintenanceUnassignedEmployee')}
            </Text>
          </View>
        </View>

        {/* 16. ViewShot envuelve el lienzo para poder capturarlo como imagen al confirmar */}
        <ViewShot
          ref={viewShotRef}
          options={{ format: 'png', quality: 0.9, result: 'data-uri' }}
          style={styles.viewShot}
        >
          <SignaturePad ref={signatureRef} />
        </ViewShot>

        {/* 17. Botones de accion: limpiar el lienzo o confirmar la firma */}
        <View style={styles.buttonsRow}>
          <TouchableOpacity
            style={[styles.clearButton, { borderColor: colors.border }]}
            onPress={handleLimpiar}
          >
            <Ionicons name="refresh-outline" size={18} color={colors.text} />
            <Text style={[styles.clearButtonText, { color: colors.text }]}>{t('maintenanceClearSignatureButton')}</Text>
          </TouchableOpacity>
        </View>

        <CustomButton
          title={
            guardando
              ? t('maintenanceSavingSignatureButton')
              : t('maintenanceConfirmSignatureButton')
          }
          onPress={handleConfirmar}
        />

        <View style={{ height: 30 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1
  },

  container: {
    paddingHorizontal: 16,
    paddingTop: 20,
    paddingBottom: 30
  },

  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 12
  },

  title: {
    fontSize: 20,
    fontWeight: 'bold'
  },

  instructions: {
    fontSize: 13,
    marginBottom: 16
  },

  // Tarjeta que identifica al empleado responsable de firmar.
  employeeCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    borderWidth: 1,
    borderRadius: 12,
    padding: 14,
    marginBottom: 16,
  },

  employeeIcon: {
    width: 38,
    height: 38,
    alignItems: 'center',
    justifyContent: 'center',
  },

  employeeLabel: {
    fontSize: 12,
    marginBottom: 2
  },

  employeeName: {
    fontSize: 15,
    fontWeight: '700'
  },

  employeeEquipment: {
    fontSize: 12,
    marginTop: 3
  },

  viewShot: {
    marginBottom: 16
  },

  buttonsRow: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginBottom: 12
  },

  clearButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    borderWidth: 1,
    borderRadius: 10,
    paddingVertical: 8,
    paddingHorizontal: 14,
  },

  clearButtonText: {
    fontSize: 13,
    fontWeight: '600'
  },

  // Tarjeta que resume todo lo realizado antes de solicitar la firma.
  summaryCard: {
    borderWidth: 1,
    borderRadius: 14,
    padding: 16,
    marginBottom: 16,
  },

  summaryTitle: {
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 14
  },

  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 16,
    marginBottom: 9,
  },

  summaryLabel: {
    fontSize: 12,
    flex: 1
  },

  summaryValue: {
    fontSize: 13,
    fontWeight: '600',
    flex: 1.4,
    textAlign: 'right',
  },

  summaryDivider: {
    height: 1,
    backgroundColor: '#D1D5DB',
    marginVertical: 8,
  },

  summarySectionLabel: {
    fontSize: 12,
    fontWeight: '600',
    marginTop: 12,
    marginBottom: 5,
  },

  summaryDescription: {
    fontSize: 13,
    lineHeight: 19
  },

  summaryListItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 7,
    marginBottom: 5,
  },

  summaryListText: {
    flex: 1,
    fontSize: 13
  },

  summaryEmpty: {
    fontSize: 12,
    fontStyle: 'italic'
  },

});