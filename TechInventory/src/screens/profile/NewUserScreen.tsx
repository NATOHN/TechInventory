// 1. Importaciones.
import { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
  ScrollView,
  Modal,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';

import { useTheme } from '../../context/ThemeContext';
import { useLanguage } from '../../context/LanguageContext';
import { useAppDispatch, useAppSelector } from '../../redux/hooks';
import { cargarUsuariosDesdeSupabase, UserRole } from '../../redux/usersSlice';

import { crearUsuarioEnSupabase } from '../../services/usuariosService';

import CustomInput from '../../components/CustomInput';
import CustomButton from '../../components/CustomButton';

export default function NewUserScreen({ navigation }: any) {
  // 2. Obtenemos colores y dispatch.
  const { colors } = useTheme();
  const { t } = useLanguage();
  const dispatch = useAppDispatch();

  // 3. Los empleados y usuarios ya provienen de Supabase mediante Redux.
  const empleados = useAppSelector((state) => state.empleados.empleados);
  const users = useAppSelector((state) => state.users.users);

  // 4. Estados del formulario.
  const [empleadoId, setEmpleadoId] = useState<number | null>(null);
  const [correo, setCorreo] = useState('');
  const [password, setPassword] = useState('');
  const [confirmarPassword, setConfirmarPassword] = useState('');
  const [rol, setRol] = useState<UserRole>('tecnico');
  const [showEmployeeModal, setShowEmployeeModal] = useState(false);
  const [guardando, setGuardando] = useState(false);

  // 5. Obtenemos el empleado seleccionado por su ID real.
  const empleadoSeleccionado = empleados.find(
    (empleado) => empleado.id === empleadoId
  );

  // 6. Solo permitimos seleccionar empleados activos que todavía
  // no estén relacionados con una cuenta de TechInventory.
  const empleadosDisponibles = empleados.filter(
    (empleado) =>
      empleado.activo &&
      !users.some((user) => user.empleadoId === empleado.id)
  );

  // 7. Validaciones locales antes de llamar al servidor.
  const validarCampos = () => {
    if (!empleadoSeleccionado) {
      Alert.alert(
        t('newUserEmployeeRequiredTitle'),
        t('newUserEmployeeRequiredMessage')
      );
      return false;
    }

    const correoNormalizado = correo.trim().toLowerCase();

    if (!correoNormalizado.includes('@')) {
      Alert.alert(
        t('newUserInvalidEmailTitle'),
        t('newUserInvalidEmailMessage')
      );
      return false;
    }

    if (
      users.some(
        (user) => user.correo.toLowerCase() === correoNormalizado
      )
    ) {
      Alert.alert(
        t('newUserExistingEmailTitle'),
        t('newUserExistingEmailMessage')
      );
      return false;
    }

    if (password.length < 8) {
      Alert.alert(
        t('newUserInvalidPasswordTitle'),
        t('newUserInvalidPasswordMessage')
      );
      return false;
    }

    if (password !== confirmarPassword) {
      Alert.alert(
        t('newUserMismatchTitle'),
        t('newUserMismatchMessage')
      );
      return false;
    }

    return true;
  };

  // 8. La contraseña se envía directamente a la Edge Function.
  // Nunca se almacena dentro de Redux ni dentro de public.usuarios.
  const handleGuardar = async () => {
    if (!validarCampos() || !empleadoSeleccionado || guardando) return;

    try {
      setGuardando(true);

      await crearUsuarioEnSupabase({
        empleadoId: empleadoSeleccionado.id,
        correo: correo.trim().toLowerCase(),
        password,
        rol,
      });

      // Después de crear la cuenta volvemos a leer los usuarios reales.
      await dispatch(cargarUsuariosDesdeSupabase()).unwrap();

      Alert.alert(
        t('newUserCreatedTitle'),
        `${t('newUserCreatedPrefix')} ${empleadoSeleccionado.nombre} ${t('newUserCreatedSuffix')}`,
        [
          {
            text: t('commonAccept'),
            onPress: () => navigation.goBack(),
          },
        ]
      );
    } catch (error) {
      console.log('Error al crear usuario:', error);

      const mensaje =
        error instanceof Error
          ? error.message
          : t('newUserErrorMessage');

      Alert.alert(t('newUserErrorTitle'), mensaje);
    } finally {
      setGuardando(false);
    }
  };

  return (
    <SafeAreaView
      edges={['top', 'left', 'right']}
      style={[styles.safeArea, { backgroundColor: colors.background }]}
    >
      <ScrollView
        style={{ backgroundColor: colors.background }}
        contentContainerStyle={styles.container}
        keyboardShouldPersistTaps="handled"
      >
        {/* 9. Encabezado. */}
        <View style={styles.header}>
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            disabled={guardando}
          >
            <Ionicons
              name="arrow-back"
              size={24}
              color={colors.text}
            />
          </TouchableOpacity>

          <Text style={[styles.title, { color: colors.primary }]}>
            {t('newUserTitle')}
          </Text>
        </View>

        {/* 10. Seleccionamos el empleado real al que pertenecerá la cuenta. */}
        <Text style={[styles.sectionLabel, { color: colors.text }]}>
          {t('newUserEmployeeLabel')}
        </Text>

        <TouchableOpacity
          style={[
            styles.selector,
            {
              backgroundColor: colors.surface,
              borderColor: colors.border,
            },
          ]}
          onPress={() => setShowEmployeeModal(true)}
          disabled={guardando}
        >
          <Text
            style={{
              color: empleadoSeleccionado
                ? colors.text
                : colors.textSecondary,
              flex: 1,
            }}
          >
            {empleadoSeleccionado?.nombre ?? t('newUserSelectEmployee')}
          </Text>

          <Ionicons
            name="chevron-down"
            size={20}
            color={colors.textSecondary}
          />
        </TouchableOpacity>

        {/* 11. Este correo será utilizado posteriormente para iniciar sesión. */}
        <Text style={[styles.sectionLabel, { color: colors.text }]}>
          {t('newUserEmailLabel')}
        </Text>

        <CustomInput
          type="email"
          placeholder={t('emailPlaceholder')}
          value={correo}
          onChange={setCorreo}
        />

        {/* 12. Contraseña temporal administrada exclusivamente por Supabase Auth. */}
        <Text style={[styles.sectionLabel, { color: colors.text }]}>
          {t('newUserTemporaryPasswordLabel')}
        </Text>

        <CustomInput
          type="password"
          placeholder={t('newUserPasswordPlaceholder')}
          value={password}
          onChange={setPassword}
        />

        {/* 13. Evitamos errores al escribir la contraseña inicial. */}
        <Text style={[styles.sectionLabel, { color: colors.text }]}>
          {t('newUserConfirmPasswordLabel')}
        </Text>

        <CustomInput
          type="password"
          placeholder={t('newUserRepeatPasswordPlaceholder')}
          value={confirmarPassword}
          onChange={setConfirmarPassword}
        />

        {/* 14. El administrador define los permisos de la nueva cuenta. */}
        <Text style={[styles.sectionLabel, { color: colors.text }]}>
          {t('newUserTypeLabel')}
        </Text>

        <View style={styles.toggleRow}>
          {(['tecnico', 'administrador'] as UserRole[]).map((op) => (
            <TouchableOpacity
              key={op}
              style={[
                styles.toggleOption,
                {
                  backgroundColor:
                    rol === op ? colors.primary : colors.surface,
                  borderColor: colors.border,
                },
              ]}
              onPress={() => setRol(op)}
              disabled={guardando}
            >
              <Text
                style={{
                  color: rol === op ? 'white' : colors.text,
                  fontWeight: '600',
                }}
              >
                {op === 'tecnico' ? t('newUserTechnician') : t('newUserAdministrator')}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* 15. Mientras el servidor trabaja evitamos múltiples registros. */}
        {guardando ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator
              size="small"
              color={colors.primary}
            />

            <Text style={{ color: colors.textSecondary }}>
              {t('newUserCreating')}
            </Text>
          </View>
        ) : (
          <CustomButton
            title={t('newUserCreateButton')}
            onPress={handleGuardar}
          />
        )}

        <View style={{ height: 30 }} />
      </ScrollView>

      {/* 16. Selector de empleados disponibles. */}
      <Modal
        visible={showEmployeeModal}
        transparent
        animationType="fade"
        onRequestClose={() => setShowEmployeeModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View
            style={[
              styles.modalContent,
              {
                backgroundColor: colors.surface,
                borderColor: colors.border,
              },
            ]}
          >
            <View style={styles.modalHeader}>
              <Text
                style={[
                  styles.modalTitle,
                  { color: colors.text },
                ]}
              >
                {t('newUserSelectEmployeeTitle')}
              </Text>

              <TouchableOpacity
                onPress={() => setShowEmployeeModal(false)}
              >
                <Ionicons
                  name="close"
                  size={24}
                  color={colors.textSecondary}
                />
              </TouchableOpacity>
            </View>

            <ScrollView style={styles.employeeList}>
              {/* 17. Cada empleado solamente puede tener una cuenta. */}
              {empleadosDisponibles.map((empleado) => (
                <TouchableOpacity
                  key={empleado.id}
                  style={[
                    styles.employeeOption,
                    { borderBottomColor: colors.border },
                  ]}
                  onPress={() => {
                    setEmpleadoId(empleado.id);
                    setShowEmployeeModal(false);
                  }}
                >
                  <Text style={{ color: colors.text }}>
                    {empleado.nombre}
                  </Text>

                  {empleadoId === empleado.id && (
                    <Ionicons
                      name="checkmark"
                      size={22}
                      color={colors.primary}
                    />
                  )}
                </TouchableOpacity>
              ))}

              {empleadosDisponibles.length === 0 && (
                <Text
                  style={[
                    styles.emptyText,
                    { color: colors.textSecondary },
                  ]}
                >
                  {t('newUserNoEmployees')}
                </Text>
              )}
            </ScrollView>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  // 18. Estilos generales de la pantalla.
  safeArea: { flex: 1 },
  container: { paddingHorizontal: 16, paddingTop: 20, paddingBottom: 30 },
  header: { flexDirection: 'row', alignItems: 'center', gap: 12, marginBottom: 16 },
  title: { fontSize: 20, fontWeight: 'bold' },
  sectionLabel: { fontSize: 14, fontWeight: '700', marginBottom: 8, marginTop: 16 },

  // 19. Selector del empleado.
  selector: {
    minHeight: 50,
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 14,
    flexDirection: 'row',
    alignItems: 'center',
  },

  // 20. Selector del rol.
  toggleRow: { flexDirection: 'row', gap: 8, marginBottom: 20 },
  toggleOption: {
    flex: 1,
    borderWidth: 1,
    borderRadius: 10,
    paddingVertical: 12,
    alignItems: 'center',
  },

  // 21. Indicador utilizado durante la creación real de la cuenta.
  loadingContainer: {
    minHeight: 48,
    flexDirection: 'row',
    gap: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },

  // 22. Modal.
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.45)',
    justifyContent: 'center',
    padding: 24,
  },
  modalContent: {
    maxHeight: '70%',
    borderWidth: 1,
    borderRadius: 16,
    padding: 16,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  modalTitle: { fontSize: 18, fontWeight: '700' },
  employeeList: { maxHeight: 360 },
  employeeOption: {
    minHeight: 48,
    borderBottomWidth: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 4,
  },
  emptyText: { textAlign: 'center', paddingVertical: 24 },
});