// 1. Importaciones
import { useRef, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert, ScrollView, InteractionManager } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { captureRef } from 'react-native-view-shot';
import { useTheme } from '../../context/ThemeContext';
import { useAppDispatch, useAppSelector } from '../../redux/hooks';
import { finalizarMantenimiento } from '../../redux/maintenanceSlice';
import { agregarNotificacion } from '../../redux/notificationsSlice';
import SignaturePad, { SignaturePadRef } from '../../components/SignaturePad';
import CustomButton from '../../components/CustomButton';

export default function SignatureScreen({ navigation, route }: any) {
  // 2. Obtenemos la paleta de colores actual desde ThemeContext.
  const { colors } = useTheme();

  // 3. Obtenemos dispatch para poder enviar acciones a Redux.
  const dispatch = useAppDispatch();

  // 4. Leemos el id del mantenimiento que se va a finalizar con esta firma.
  const { maintenanceId } = route.params;

  // 5. Buscamos el mantenimiento para poder obtener su codigo de equipo al notificar.
  const maintenance = useAppSelector((state) =>
    state.maintenance.maintenances.find((m) => m.id === maintenanceId)
  );

  // 6. Referencia al SignaturePad, para poder limpiarlo y consultar si esta vacio.
  const signatureRef = useRef<SignaturePadRef>(null);

  // 7. Referencia al View plano que envuelve el lienzo. Usamos captureRef() sobre esta vista
  // directamente en vez del componente <ViewShot>, que en algunos dispositivos Android
  // no logra capturar correctamente vistas que contienen SVG nativo (queda en blanco).
  const captureAreaRef = useRef<View>(null);

  // 8. Controla que no se pueda confirmar dos veces mientras se procesa la captura.
  const [guardando, setGuardando] = useState(false);

  // 9. Limpia el lienzo de firma para volver a empezar.
  const handleLimpiar = () => {
    signatureRef.current?.clear();
  };

  // 10. Captura la firma como imagen PNG y finaliza el mantenimiento en Redux.
  const handleConfirmar = async () => {
    if (signatureRef.current?.isEmpty()) {
      Alert.alert('Firma requerida', 'Debes firmar antes de continuar.');
      return;
    }

    try {
      setGuardando(true);

      // 11. Esperamos a que termine cualquier animacion/interaccion pendiente,
      // y agregamos un pequeño margen extra, antes de capturar la vista.
      await new Promise<void>((resolve) => {
        InteractionManager.runAfterInteractions(() => {
          setTimeout(resolve, 200);
        });
      });

      // 12. Capturamos el View directamente con captureRef, en vez de un componente ViewShot.
      const uri = await captureRef(captureAreaRef, {
        format: 'png',
        quality: 0.9,
        result: 'data-uri',
      });

      if (!uri) {
        Alert.alert('Error', 'No se pudo capturar la firma. Intenta de nuevo.');
        setGuardando(false);
        return;
      }

      // 13. Finalizamos el mantenimiento, guardando la firma capturada.
      dispatch(finalizarMantenimiento({ id: maintenanceId, firmaBase64: uri }));

      // 14. Notificamos que el mantenimiento fue finalizado.
      if (maintenance) {
        dispatch(
          agregarNotificacion({
            id: `NTF-${Date.now()}`,
            tipo: 'fin',
            mensaje: `Se finalizó el mantenimiento del equipo ${maintenance.codigoEquipo}`,
            codigoEquipo: maintenance.codigoEquipo,
            leida: false,
            fecha: new Date().toISOString(),
          })
        );
      }

      // 15. Regresamos a la lista de mantenimientos, ya con el registro finalizado.
      navigation.navigate('MaintenanceScreen');
    } catch (error) {
      console.log('Error al capturar la firma:', error);
      Alert.alert('Error', 'Ocurrió un problema al guardar la firma.');
      setGuardando(false);
    }
  };

  return (
    // 16. SafeAreaView evita que el contenido quede pegado a los bordes del dispositivo.
    <SafeAreaView edges={['top', 'left', 'right']} style={[styles.safeArea, { backgroundColor: colors.background }]}>
      <ScrollView style={{ backgroundColor: colors.background }} contentContainerStyle={styles.container}>

        {/* 17. Encabezado con boton de regreso y titulo */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Ionicons name="arrow-back" size={24} color={colors.text} />
          </TouchableOpacity>
          <Text style={[styles.title, { color: colors.primary }]}>Firma del técnico</Text>
        </View>

        <Text style={[styles.instructions, { color: colors.textSecondary }]}>
          Firma dentro del recuadro para confirmar que el mantenimiento fue realizado.
        </Text>

        {/* 18. View plano (no ViewShot) que envuelve el lienzo; se captura con captureRef() */}
        <View ref={captureAreaRef} collapsable={false} style={styles.captureArea}>
          <SignaturePad ref={signatureRef} />
        </View>

        {/* 19. Botones de accion: limpiar el lienzo o confirmar la firma */}
        <View style={styles.buttonsRow}>
          <TouchableOpacity
            style={[styles.clearButton, { borderColor: colors.border }]}
            onPress={handleLimpiar}
          >
            <Ionicons name="refresh-outline" size={18} color={colors.text} />
            <Text style={[styles.clearButtonText, { color: colors.text }]}>Limpiar</Text>
          </TouchableOpacity>
        </View>

        <CustomButton
          title={guardando ? 'Guardando...' : 'Confirmar firma'}
          onPress={handleConfirmar}
        />

        <View style={{ height: 30 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1 },
  container: { paddingHorizontal: 16, paddingTop: 20, paddingBottom: 30 },
  header: { flexDirection: 'row', alignItems: 'center', gap: 12, marginBottom: 12 },
  title: { fontSize: 20, fontWeight: 'bold' },
  instructions: { fontSize: 13, marginBottom: 16 },
  captureArea: { marginBottom: 16, backgroundColor: '#FFFFFF' },
  buttonsRow: { flexDirection: 'row', justifyContent: 'flex-end', marginBottom: 12 },
  clearButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    borderWidth: 1,
    borderRadius: 10,
    paddingVertical: 8,
    paddingHorizontal: 14,
  },
  clearButtonText: { fontSize: 13, fontWeight: '600' },
});