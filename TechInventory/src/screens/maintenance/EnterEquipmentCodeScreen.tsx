// 1. Importaciones
import { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { CameraView, useCameraPermissions, BarcodeScanningResult } from 'expo-camera';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../context/ThemeContext';
// Permite mostrar el escáner y sus mensajes en el idioma seleccionado.
import { useLanguage } from '../../context/LanguageContext';
import { useAppSelector } from '../../redux/hooks';
import CustomInput from '../../components/CustomInput';
import CustomButton from '../../components/CustomButton';

export default function EnterEquipmentCodeScreen({ navigation }: any) {
  // 2. Obtenemos la paleta de colores actual desde ThemeContext.
  const { colors } = useTheme();

  // Obtenemos las traducciones de la aplicación.
  const { t } = useLanguage();

  // 3. Leemos los equipos registrados para validar el codigo escaneado o escrito.
  const equipments = useAppSelector((state) => state.equipment.equipments);

  // Leemos los mantenimientos para evitar abrir un segundo proceso sobre el mismo equipo.
  const maintenances = useAppSelector((state) => state.maintenance.maintenances);

  // 4. Permiso de camara del dispositivo, provisto por expo-camera.
  const [permission, requestPermission] = useCameraPermissions();

  // 5. Controla si mostramos la camara o el formulario manual.
  const [manualMode, setManualMode] = useState(false);

  // 6. Estado local del codigo escrito manualmente.
  const [codigo, setCodigo] = useState('');

  // 7. Evita procesar el mismo QR varias veces mientras la camara sigue activa.
  const [scanned, setScanned] = useState(false);

  // 8. Controla la linterna de la camara.
  const [torchOn, setTorchOn] = useState(false);

  // 9. Solicitamos el permiso de camara automaticamente al entrar a la pantalla.
  useEffect(() => {
    if (permission && !permission.granted && permission.canAskAgain) {
      requestPermission();
    }
  }, [permission]);

  // 10. Busca el codigo recibido (por camara o manual) dentro del inventario.
  const buscarYContinuar = (codigoRecibido: string) => {
    const equipo = equipments.find(
      (e) => e.codigo.toLowerCase() === codigoRecibido.trim().toLowerCase()
    );

    if (!equipo) {
      Alert.alert(
        t('maintenanceEquipmentNotFoundTitle'),
        t('maintenanceEquipmentNotFoundMessage'),
        [
          { text: 'OK', onPress: () => setScanned(false) },
        ]);
      return;
    }

    // 11. Los equipos dados de baja no pueden recibir mantenimiento.
    if (equipo.status === 'baja') {
      Alert.alert(
        t('maintenanceInactiveEquipmentTitle'),
        t('maintenanceInactiveEquipmentMessage').replace(
          '__CODIGO__',
          equipo.codigo
        ),
        [{ text: 'OK', onPress: () => setScanned(false) }]
      );
      return;
    }

    // Verificamos si este equipo ya tiene un mantenimiento actualmente En proceso.
    const mantenimientoEnProceso = maintenances.find(
      (mantenimiento) =>
        mantenimiento.codigoEquipo === equipo.codigo &&
        mantenimiento.status === 'en_proceso'
    );

    if (mantenimientoEnProceso) {
      Alert.alert(
        t('maintenanceAlreadyInProgressTitle'),
        t('maintenanceAlreadyInProgressMessage').replace(
          '__CODIGO__',
          equipo.codigo
        ),
        [
          // Permitimos cancelar y continuar escaneando.
          {
            text: t('maintenanceCancelButton'),
            style: 'cancel',
            onPress: () => setScanned(false),
          },

          // También damos acceso directo al mantenimiento que ya está abierto.
          {
            text: t('maintenanceOpenExistingButton'),
            onPress: () =>
              navigation.navigate('NewMaintenanceScreen', {
                maintenanceId: mantenimientoEnProceso.id,
              }),
          },
        ]
      );

      return;
    }

    // 12. Navegamos al formulario de nuevo mantenimiento, enviando el codigo del equipo.
    navigation.navigate('NewMaintenanceScreen', { codigoEquipo: equipo.codigo });
  };

  // 13. Callback que recibe expo-camera cada vez que detecta un codigo QR.
  const handleBarcodeScanned = (result: BarcodeScanningResult) => {
    if (scanned) return;
    setScanned(true);
    buscarYContinuar(result.data);
  };

  // 14. Envia el codigo escrito a mano hacia la misma validacion que usa la camara.
  const handleContinuarManual = () => {
    buscarYContinuar(codigo);
  };

  return (
    <View style={styles.container}>
      {/* 15. Encabezado con boton de regreso, titulo y linterna */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.title}>{t('maintenanceScannerTitle')}</Text>
        <TouchableOpacity onPress={() => setTorchOn((prev) => !prev)}>
          <Ionicons name="flash" size={22} color={torchOn ? '#FACC15' : '#fff'} />
        </TouchableOpacity>
      </View>

      {manualMode ? (
        // 16. Formulario para ingresar el codigo manualmente.
        <View style={[styles.manualBody, { backgroundColor: colors.background }]}>
          <Ionicons
            name="keypad-outline"
            size={48}
            color={colors.primary}
            style={{ alignSelf: 'center', marginBottom: 16 }}
          />

          <Text style={[styles.label, { color: colors.textSecondary }]}>
            {t('maintenanceEnterCodeLabel')}
          </Text>
          <CustomInput type="text" placeholder="EQ-0001" value={codigo} onChange={setCodigo} />

          <CustomButton title={t('maintenanceContinueButton')} onPress={handleContinuarManual} />

          <TouchableOpacity style={styles.switchModeButton} onPress={() => setManualMode(false)}>
            <Ionicons name="camera-outline" size={18} color={colors.primary} />
            <Text style={[styles.switchModeText, { color: colors.primary }]}>{t('maintenanceBackToScannerButton')}</Text>
          </TouchableOpacity>
        </View>
      ) : !permission?.granted ? (
        // 17. Mensaje mostrado mientras no se tenga permiso de camara.
        <View style={styles.permissionBody}>
          <Ionicons name="camera-outline" size={48} color="#fff" style={{ marginBottom: 16 }} />
          <Text style={styles.permissionText}>
            {t('maintenanceCameraPermissionMessage')}
          </Text>
          <CustomButton title={t('maintenanceAllowCameraButton')} onPress={requestPermission} />
          <TouchableOpacity style={styles.manualLinkButton} onPress={() => setManualMode(true)}>
            <Text style={styles.manualLinkText}> {t('maintenanceEnterCodeManuallyButton')}</Text>
          </TouchableOpacity>
        </View>
      ) : (
        // 18. Vista de la camara con el recuadro guia para centrar el QR.
        <View style={styles.cameraContainer}>
          <CameraView
            style={styles.camera}
            facing="back"
            enableTorch={torchOn}
            barcodeScannerSettings={{ barcodeTypes: ['qr'] }}
            onBarcodeScanned={handleBarcodeScanned}
          />

          {/* 19. Recuadro guia superpuesto sobre la camara */}
          <View style={styles.overlay}>
            <View style={styles.scanFrame} />
            <Text style={styles.overlayText}>{t('maintenanceScannerInstruction')}</Text>
          </View>

          {/* 20. Boton para cambiar a ingreso manual */}
          <TouchableOpacity style={styles.manualButton} onPress={() => setManualMode(true)}>
            <Ionicons name="keypad-outline" size={18} color="#fff" />
            <Text style={styles.manualButtonText}>{t('maintenanceEnterCodeManuallyButton')}</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#000' },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingTop: 50,
    paddingBottom: 16,
  },
  title: { fontSize: 17, fontWeight: 'bold', color: '#fff' },
  cameraContainer: { flex: 1 },
  camera: { flex: 1 },
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 16,
  },
  scanFrame: {
    width: 230,
    height: 230,
    borderWidth: 2,
    borderColor: '#fff',
    borderRadius: 16,
  },
  overlayText: { color: '#fff', fontSize: 14, fontWeight: '500' },
  manualButton: {
    position: 'absolute',
    bottom: 30,
    left: 24,
    right: 24,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: 'rgba(30,58,138,0.9)',
    paddingVertical: 14,
    borderRadius: 14,
  },
  manualButtonText: { color: '#fff', fontSize: 15, fontWeight: '600' },
  manualBody: { flex: 1, paddingHorizontal: 16, paddingTop: 40 },
  label: { fontSize: 13, marginBottom: 6 },
  switchModeButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    marginTop: 16,
  },
  switchModeText: { fontSize: 14, fontWeight: '600' },
  permissionBody: { flex: 1, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 32 },
  permissionText: { color: '#fff', fontSize: 15, textAlign: 'center', marginBottom: 20 },
  manualLinkButton: { marginTop: 16 },
  manualLinkText: { color: '#93C5FD', fontSize: 14, fontWeight: '600' },
});