// 1. Importaciones.
import { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Modal,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { NativeStackScreenProps } from '@react-navigation/native-stack';

import { useTheme } from '../../context/ThemeContext';
import { useLanguage } from '../../context/LanguageContext';
import { useAppDispatch, useAppSelector } from '../../redux/hooks';
import { crearEmpleadoEnSupabase } from '../../redux/empleadosSlice';
import type { ProfileStackParamList } from '../../navigation/ProfileNavigator';

import CustomInput from '../../components/CustomInput';
import CustomButton from '../../components/CustomButton';

// 2. Tipamos la pantalla dentro del navegador de Perfil.
type Props = NativeStackScreenProps<ProfileStackParamList, 'EmployeesScreen'>;

export default function EmployeesScreen({ navigation }: Props) {
  const { colors } = useTheme();
  const { t } = useLanguage();
  const dispatch = useAppDispatch();

  // 3. Catálogos reales cargados desde Supabase mediante Redux.
  const sucursales = useAppSelector((state) => state.sucursales.sucursales);
  const departamentos = useAppSelector((state) => state.departamentos.departamentos);
  const empleados = useAppSelector((state) => state.empleados.empleados);

  // 4. Comprobamos nuevamente que el usuario actual sea administrador.
  const currentUser = useAppSelector((state) =>
    state.users.users.find((user) => user.id === state.users.currentUserId)
  );

  const esAdministrador = currentUser?.rol === 'administrador';

  // 5. Estados del formulario.
  const [nombre, setNombre] = useState('');
  const [sucursalId, setSucursalId] = useState<number | null>(null);
  const [departamentoId, setDepartamentoId] = useState<number | null>(null);
  const [showSucursalModal, setShowSucursalModal] = useState(false);
  const [showDepartamentoModal, setShowDepartamentoModal] = useState(false);
  const [guardando, setGuardando] = useState(false);

  // 6. Recuperamos las selecciones completas.
  const sucursalSeleccionada = sucursales.find(
    (sucursal) => sucursal.id === sucursalId
  );

  const departamentosDisponibles = sucursalId
    ? departamentos.filter(
        (departamento) => departamento.sucursal_id === sucursalId
      )
    : [];

  const departamentoSeleccionado = departamentosDisponibles.find(
    (departamento) => departamento.id === departamentoId
  );

  // 7. Valida y registra el empleado.
  const handleCrearEmpleado = async () => {
    if (!esAdministrador) {
      Alert.alert(
        t('employeesAccessTitle'),
        t('employeesRestrictedMessage')
      );
      return;
    }

    if (guardando) return;

    const nombreLimpio = nombre.trim().replace(/\s+/g, ' ');

    if (nombreLimpio.length < 3) {
      Alert.alert(
        t('employeesNameRequiredTitle'),
        t('employeesNameRequiredMessage')
      );
      return;
    }

    if (!sucursalId) {
      Alert.alert(
        t('employeesBranchRequiredTitle'),
        t('employeesBranchRequiredMessage')
      );
      return;
    }

    if (!departamentoSeleccionado) {
      Alert.alert(
        t('employeesDepartmentRequiredTitle'),
        t('employeesDepartmentRequiredMessage')
      );
      return;
    }

    try {
      setGuardando(true);

      const nuevoEmpleado = await dispatch(
        crearEmpleadoEnSupabase({
          nombre: nombreLimpio,
          departamentoId: departamentoSeleccionado.id,
        })
      ).unwrap();

      // Limpiamos todo solamente después de confirmar el registro.
      setNombre('');
      setSucursalId(null);
      setDepartamentoId(null);

      Alert.alert(
        t('employeesCreatedTitle'),
        `${nuevoEmpleado.nombre} ${t('employeesCreatedSuffix')}`
      );
    } catch (error) {
      console.log('Error al crear empleado:', error);

      const mensaje =
        typeof error === 'string'
          ? error
          : error instanceof Error
            ? error.message
            : t('employeesErrorMessage');

      Alert.alert(t('employeesErrorTitle'), mensaje);
    } finally {
      setGuardando(false);
    }
  };

  // 8. La pantalla completa es administrativa.
  if (!esAdministrador) {
    return (
      <SafeAreaView
        edges={['top', 'left', 'right']}
        style={[styles.safeArea, { backgroundColor: colors.background }]}
      >
        <View style={styles.accessContainer}>
          <Ionicons name="lock-closed-outline" size={40} color={colors.textSecondary} />

          <Text style={[styles.accessTitle, { color: colors.text }]}>
            {t('employeesAccessTitle')}
          </Text>

          <Text style={[styles.accessText, { color: colors.textSecondary }]}>
            {t('employeesAccessMessage')}
          </Text>

          <CustomButton title={t('employeesBackButton')} onPress={() => navigation.goBack()} />
        </View>
      </SafeAreaView>
    );
  }

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
          <TouchableOpacity onPress={() => navigation.goBack()} disabled={guardando}>
            <Ionicons name="arrow-back" size={24} color={colors.text} />
          </TouchableOpacity>

          <View>
            <Text style={[styles.title, { color: colors.primary }]}>
              {t('employeesTitle')}
            </Text>

            <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
              {t('employeesSubtitle')}
            </Text>
          </View>
        </View>

        {/* 10. Formulario de registro. */}
        <View
          style={[
            styles.formCard,
            {
              backgroundColor: colors.surface,
              borderColor: colors.border,
            },
          ]}
        >
          <View style={styles.sectionHeader}>
            <View style={[styles.iconContainer, { backgroundColor: colors.background }]}>
              <Ionicons name="person-add-outline" size={22} color={colors.primary} />
            </View>

            <View style={{ flex: 1 }}>
              <Text style={[styles.sectionTitle, { color: colors.text }]}>
                {t('employeesRegisterTitle')}
              </Text>

              <Text style={[styles.sectionDescription, { color: colors.textSecondary }]}>
                {t('employeesRegisterDescription')}
              </Text>
            </View>
          </View>

          <Text style={[styles.label, { color: colors.text }]}>
            {t('employeesFullNameLabel')}
          </Text>

          <CustomInput
            type="text"
            placeholder={t('employeesNamePlaceholder')}
            value={nombre}
            onChange={setNombre}
          />

          <Text style={[styles.label, { color: colors.text }]}>
            {t('employeesBranchLabel')}
          </Text>

          <TouchableOpacity
            style={[
              styles.selector,
              {
                backgroundColor: colors.background,
                borderColor: colors.border,
              },
            ]}
            onPress={() => setShowSucursalModal(true)}
            disabled={guardando}
          >
            <Text
              style={{
                color: sucursalSeleccionada ? colors.text : colors.textSecondary,
                flex: 1,
              }}
            >
              {sucursalSeleccionada?.nombre ?? t('employeesSelectBranch')}
            </Text>

            <Ionicons name="chevron-down" size={20} color={colors.textSecondary} />
          </TouchableOpacity>

          <Text style={[styles.label, { color: colors.text }]}>
            {t('employeesDepartmentLabel')}
          </Text>

          <TouchableOpacity
            style={[
              styles.selector,
              {
                backgroundColor: colors.background,
                borderColor: colors.border,
                opacity: sucursalId ? 1 : 0.6,
              },
            ]}
            onPress={() => {
              if (!sucursalId) {
                Alert.alert(
                  t('employeesSelectBranchFirstTitle'),
                  t('employeesSelectBranchFirstMessage')
                );
                return;
              }

              setShowDepartamentoModal(true);
            }}
            disabled={guardando}
          >
            <Text
              style={{
                color: departamentoSeleccionado
                  ? colors.text
                  : colors.textSecondary,
                flex: 1,
              }}
            >
              {departamentoSeleccionado?.nombre ?? t('employeesSelectDepartment')}
            </Text>

            <Ionicons name="chevron-down" size={20} color={colors.textSecondary} />
          </TouchableOpacity>

          {guardando ? (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="small" color={colors.primary} />

              <Text style={{ color: colors.textSecondary }}>
                {t('employeesRegistering')}
              </Text>
            </View>
          ) : (
            <CustomButton
              title={t('employeesRegisterButton')}
              onPress={handleCrearEmpleado}
            />
          )}
        </View>

        {/* 11. Listado actual de empleados. */}
        <View style={styles.listSection}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>
            {t('employeesRegisteredTitle')}
          </Text>

          <Text style={[styles.counterText, { color: colors.textSecondary }]}>
            {empleados.length} {empleados.length === 1 ? t('employeesSingular') : t('employeesPlural')}
          </Text>

          {empleados.map((empleado) => {
            const departamento = departamentos.find(
              (item) => item.id === empleado.departamento_id
            );

            const sucursal = sucursales.find(
              (item) => item.id === departamento?.sucursal_id
            );

            return (
              <View
                key={empleado.id}
                style={[
                  styles.employeeRow,
                  {
                    backgroundColor: colors.surface,
                    borderColor: colors.border,
                  },
                ]}
              >
                <View style={[styles.employeeIcon, { backgroundColor: colors.background }]}>
                  <Ionicons name="person-outline" size={20} color={colors.primary} />
                </View>

                <View style={{ flex: 1 }}>
                  <Text style={[styles.employeeName, { color: colors.text }]}>
                    {empleado.nombre}
                  </Text>

                  <Text style={[styles.employeeLocation, { color: colors.textSecondary }]}>
                    {departamento?.nombre ?? t('employeesDepartmentUnavailable')}
                    {' · '}
                    {sucursal?.nombre ?? t('employeesBranchUnavailable')}
                  </Text>
                </View>

                <Ionicons name="checkmark-circle-outline" size={21} color={colors.primary} />
              </View>
            );
          })}

          {empleados.length === 0 && (
            <View
              style={[
                styles.emptyCard,
                {
                  backgroundColor: colors.surface,
                  borderColor: colors.border,
                },
              ]}
            >
              <Ionicons name="people-outline" size={28} color={colors.textSecondary} />

              <Text style={[styles.emptyText, { color: colors.textSecondary }]}>
                {t('employeesEmpty')}
              </Text>
            </View>
          )}
        </View>

        <View style={{ height: 30 }} />
      </ScrollView>

      {/* 12. Selector de sucursal. */}
      <Modal
        visible={showSucursalModal}
        transparent
        animationType="fade"
        onRequestClose={() => setShowSucursalModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={[styles.modalCard, { backgroundColor: colors.surface }]}>
            <View style={styles.modalHeader}>
              <Text style={[styles.modalTitle, { color: colors.text }]}>
                {t('employeesSelectBranchTitle')}
              </Text>

              <TouchableOpacity onPress={() => setShowSucursalModal(false)}>
                <Ionicons name="close" size={24} color={colors.textSecondary} />
              </TouchableOpacity>
            </View>

            <ScrollView>
              {sucursales.map((sucursal) => (
                <TouchableOpacity
                  key={sucursal.id}
                  style={[styles.modalOption, { borderBottomColor: colors.border }]}
                  onPress={() => {
                    // Al cambiar de sucursal limpiamos el departamento anterior.
                    setSucursalId(sucursal.id);
                    setDepartamentoId(null);
                    setShowSucursalModal(false);
                  }}
                >
                  <Text style={[styles.modalOptionText, { color: colors.text }]}>
                    {sucursal.nombre}
                  </Text>

                  {sucursalId === sucursal.id && (
                    <Ionicons name="checkmark" size={21} color={colors.primary} />
                  )}
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        </View>
      </Modal>

      {/* 13. Solo mostramos departamentos pertenecientes a la sucursal elegida. */}
      <Modal
        visible={showDepartamentoModal}
        transparent
        animationType="fade"
        onRequestClose={() => setShowDepartamentoModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={[styles.modalCard, { backgroundColor: colors.surface }]}>
            <View style={styles.modalHeader}>
              <Text style={[styles.modalTitle, { color: colors.text }]}>
                {t('employeesSelectDepartmentTitle')}
              </Text>

              <TouchableOpacity onPress={() => setShowDepartamentoModal(false)}>
                <Ionicons name="close" size={24} color={colors.textSecondary} />
              </TouchableOpacity>
            </View>

            <ScrollView>
              {departamentosDisponibles.map((departamento) => (
                <TouchableOpacity
                  key={departamento.id}
                  style={[styles.modalOption, { borderBottomColor: colors.border }]}
                  onPress={() => {
                    setDepartamentoId(departamento.id);
                    setShowDepartamentoModal(false);
                  }}
                >
                  <Text style={[styles.modalOptionText, { color: colors.text }]}>
                    {departamento.nombre}
                  </Text>

                  {departamentoId === departamento.id && (
                    <Ionicons name="checkmark" size={21} color={colors.primary} />
                  )}
                </TouchableOpacity>
              ))}

              {departamentosDisponibles.length === 0 && (
                <Text style={[styles.emptyText, { color: colors.textSecondary }]}>
                  {t('employeesNoDepartments')}
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
  safeArea: { flex: 1 },
  container: { paddingHorizontal: 16, paddingTop: 20, paddingBottom: 30 },

  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 24,
  },

  title: { fontSize: 22, fontWeight: 'bold' },
  subtitle: { fontSize: 13, marginTop: 2 },

  formCard: {
    borderWidth: 1,
    borderRadius: 14,
    padding: 16,
    marginBottom: 28,
  },

  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 18,
  },

  iconContainer: {
    width: 42,
    height: 42,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },

  sectionTitle: { fontSize: 17, fontWeight: '700' },
  sectionDescription: { fontSize: 13, marginTop: 2 },
  label: { fontSize: 14, fontWeight: '600', marginBottom: 7 },

  selector: {
    minHeight: 50,
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 14,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 14,
  },

  loadingContainer: {
    minHeight: 48,
    flexDirection: 'row',
    gap: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },

  listSection: { marginTop: 2 },
  counterText: { fontSize: 13, marginTop: 3, marginBottom: 12 },

  employeeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderRadius: 12,
    padding: 12,
    marginBottom: 10,
  },

  employeeIcon: {
    width: 38,
    height: 38,
    borderRadius: 9,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 11,
  },

  employeeName: { fontSize: 15, fontWeight: '600' },
  employeeLocation: { fontSize: 12, marginTop: 3 },

  emptyCard: {
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderRadius: 12,
    paddingVertical: 25,
  },

  emptyText: {
    fontSize: 14,
    textAlign: 'center',
    paddingVertical: 15,
  },

  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.45)',
    justifyContent: 'center',
    paddingHorizontal: 24,
  },

  modalCard: {
    borderRadius: 14,
    padding: 18,
    maxHeight: '70%',
  },

  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
  },

  modalTitle: { fontSize: 18, fontWeight: '700' },

  modalOption: {
    minHeight: 50,
    borderBottomWidth: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },

  modalOptionText: { fontSize: 15, flex: 1 },

  accessContainer: {
    flex: 1,
    paddingHorizontal: 30,
    alignItems: 'center',
    justifyContent: 'center',
  },

  accessTitle: { fontSize: 20, fontWeight: '700', marginTop: 12 },
  accessText: { fontSize: 14, textAlign: 'center', marginTop: 6, marginBottom: 15 },
});