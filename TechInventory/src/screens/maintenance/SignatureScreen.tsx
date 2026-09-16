// 1. Importaciones
import { useRef, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import ViewShot from 'react-native-view-shot';
import { useTheme } from '../../context/ThemeContext';
import { useAppDispatch } from '../../redux/hooks';
import { finalizarMantenimiento } from '../../redux/maintenanceSlice';
import SignaturePad, { SignaturePadRef } from '../../components/SignaturePad';
import CustomButton from '../../components/CustomButton';

export default function SignatureScreen({ navigation, route }: any) {
  // 2. Obtenemos la paleta de colores actual desde ThemeContext.
  const { colors } = useTheme();

  // 3. Obtenemos dispatch para poder enviar acciones a Redux.
  const dispatch = useAppDispatch();

  // 4. Leemos el id del mantenimiento que se va a finalizar con esta firma.
  const { maintenanceId } = route.params;

  // 5. Referencia al SignaturePad, para poder limpiarlo y consultar si esta vacio.
  const signatureRef = useRef<SignaturePadRef>(null);

  // 6. Referencia al ViewShot que envuelve el lienzo, para poder capturarlo como imagen.
  const viewShotRef = useRef<ViewShot>(null);

  // 7. Controla que no se pueda confirmar dos veces mientras se procesa la captura.
  const [guardando, setGuardando] = useState(false);

  // 8. Limpia el lienzo de firma para volver a empezar.
  const handleLimpiar = () => {
    signatureRef.current?.clear();
  };

  // 9. Captura la firma como imagen PNG y finaliza el mantenimiento en Redux.
  const handleConfirmar = async () => {
    if (signatureRef.current?.isEmpty()) {
      Alert.alert('Firma requerida', 'Debes firmar antes de continuar.');
      return;
    }

    try {
      setGuardando(true);

      // 10. Capturamos el lienzo actual como una imagen en formato data-uri (base64 embebido).
      const uri = await viewShotRef.current?.capture?.();

      if (!uri) {
        Alert.alert('Error', 'No se pudo capturar la firma. Intenta de nuevo.');
        setGuardando(false);
        return;
      }

      // 11. Finalizamos el mantenimiento, guardando la firma capturada.
      dispatch(finalizarMantenimiento({ id: maintenanceId, firmaBase64: uri }));

      // 12. Regresamos a la lista de mantenimientos, ya con el registro finalizado.
      navigation.navigate('MaintenanceScreen');
    } catch (error) {
      Alert.alert('Error', 'Ocurrió un problema al guardar la firma.');
      setGuardando(false);
    }
  };

  return (
    // 13. SafeAreaView evita que el contenido quede pegado a los bordes del dispositivo.
    <SafeAreaView edges={['top', 'left', 'right']} style={[styles.safeArea, { backgroundColor: colors.background }]}>
      <ScrollView style={{ backgroundColor: colors.background }} contentContainerStyle={styles.container}>

        {/* 14. Encabezado con boton de regreso y titulo */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Ionicons name="arrow-back" size={24} color={colors.text} />
          </TouchableOpacity>
          <Text style={[styles.title, { color: colors.primary }]}>Firma del técnico</Text>
        </View>

        <Text style={[styles.instructions, { color: colors.textSecondary }]}>
          Firma dentro del recuadro para confirmar que el mantenimiento fue realizado.
        </Text>

        {/* 15. ViewShot envuelve el lienzo para poder capturarlo como imagen al confirmar */}
        <ViewShot
          ref={viewShotRef}
          options={{ format: 'png', quality: 0.9, result: 'data-uri' }}
          style={styles.viewShot}
        >
          <SignaturePad ref={signatureRef} />
        </ViewShot>

        {/* 16. Botones de accion: limpiar el lienzo o confirmar la firma */}
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
  viewShot: { marginBottom: 16 },
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