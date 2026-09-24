// 1. Importaciones
import { useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    ScrollView,
    Alert,
    ActivityIndicator,
    Modal,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { NativeStackScreenProps } from '@react-navigation/native-stack';

import { useTheme } from '../../context/ThemeContext';
import { useLanguage } from '../../context/LanguageContext';
// Redux permitirá registrar la sucursal en Supabase y actualizar el catálogo local.
import { useAppDispatch, useAppSelector } from '../../redux/hooks';
import { crearSucursalEnSupabase } from '../../redux/sucursalesSlice';

// Permite registrar departamentos y actualizar inmediatamente su catálogo.
import { crearDepartamentoEnSupabase } from '../../redux/departamentosSlice';

import CustomInput from '../../components/CustomInput';
import CustomButton from '../../components/CustomButton';
import type { ProfileStackParamList } from '../../navigation/ProfileNavigator';

// 2. Tipamos las propiedades de navegación de esta pantalla.
type Props = NativeStackScreenProps<ProfileStackParamList, 'LocationsScreen'>;

export default function LocationsScreen({ navigation }: Props) {
    // 3. Obtenemos los colores del tema actual.
    const { colors } = useTheme();
    const { t } = useLanguage();

    // 4. Redux se encargará de conectar esta pantalla con Supabase.
    const dispatch = useAppDispatch();

    // 5. Recuperamos las sucursales actuales para mostrarlas y evitar nombres repetidos.
    const sucursales = useAppSelector((state) => state.sucursales.sucursales);

    // Catálogo actual de departamentos cargado desde Supabase.
    const departamentos = useAppSelector(
        (state) => state.departamentos.departamentos
    );

    // 6. Recuperamos al usuario autenticado para comprobar que sea administrador.
    const currentUser = useAppSelector((state) =>
        state.users.users.find((user) => user.id === state.users.currentUserId)
    );

    const esAdministrador = currentUser?.rol === 'administrador';

    // 7. Estados exclusivos del formulario para crear una sucursal.
    const [nombreSucursal, setNombreSucursal] = useState('');
    const [guardando, setGuardando] = useState(false);

    // Estados utilizados únicamente para registrar departamentos.
    const [nombreDepartamento, setNombreDepartamento] = useState('');
    const [sucursalDepartamentoId, setSucursalDepartamentoId] = useState<number | null>(null);
    const [mostrarSucursalesModal, setMostrarSucursalesModal] = useState(false);
    const [guardandoDepartamento, setGuardandoDepartamento] = useState(false);

    // Recuperamos la sucursal completa para mostrar su nombre en el selector.
    const sucursalDepartamento = sucursales.find(
        (sucursal) => sucursal.id === sucursalDepartamentoId
    );

    // 8. Valida y registra una nueva sucursal mediante Redux → servicio → Supabase.
    const handleCrearSucursal = async () => {
        // Aunque esta pantalla se abre desde una opción exclusiva de administrador,
        // volvemos a comprobar el rol antes de permitir el registro.
        if (!esAdministrador) {
            Alert.alert(
                t('locationsRestrictedTitle'),
                t('locationsBranchRestrictedMessage')
            );
            return;
        }

        if (guardando) return;

        // Eliminamos espacios innecesarios antes de validar y guardar.
        const nombreLimpio = nombreSucursal.trim().replace(/\s+/g, ' ');

        if (nombreLimpio.length < 2) {
            Alert.alert(
                t('locationsNameRequiredTitle'),
                t('locationsBranchNameMessage')
            );
            return;
        }

        // Evitamos registrar nuevamente una sucursal que ya existe en Redux.
        const sucursalExistente = sucursales.some(
            (sucursal) =>
                sucursal.nombre.trim().toLowerCase() === nombreLimpio.toLowerCase()
        );

        if (sucursalExistente) {
            Alert.alert(
                t('locationsBranchExistingTitle'),
                t('locationsBranchExistingMessage')
            );
            return;
        }

        try {
            setGuardando(true);

            // El thunk registra en Supabase y agrega el resultado al catálogo de Redux.
            const nuevaSucursal = await dispatch(
                crearSucursalEnSupabase(nombreLimpio)
            ).unwrap();

            // Limpiamos el formulario únicamente cuando Supabase respondió correctamente.
            setNombreSucursal('');

            Alert.alert(
                t('locationsBranchCreatedTitle'),
                `${nuevaSucursal.nombre} ${t('locationsRegisteredSuffix')}`
            );
        } catch (error) {
            console.log('Error al crear sucursal:', error);

            const mensaje =
                typeof error === 'string'
                    ? error
                    : error instanceof Error
                        ? error.message
                        : t('locationsBranchErrorMessage');

            Alert.alert(t('locationsBranchErrorTitle'), mensaje);
        } finally {
            setGuardando(false);
        }
    };

    // Registra un departamento y lo relaciona con la sucursal seleccionada.
    const handleCrearDepartamento = async () => {
        // Mantenemos una segunda protección en la interfaz además de RLS.
        if (!esAdministrador) {
            Alert.alert(
                t('locationsRestrictedTitle'),
                t('locationsDepartmentRestrictedMessage')
            );
            return;
        }

        if (guardandoDepartamento) return;

        const nombreLimpio = nombreDepartamento.trim().replace(/\s+/g, ' ');

        if (!sucursalDepartamentoId) {
            Alert.alert(
                t('locationsDepartmentRequiredTitle'),
                t('locationsDepartmentRequiredMessage')
            );
            return;
        }

        if (nombreLimpio.length < 2) {
            Alert.alert(
                t('locationsNameRequiredTitle'),
                t('locationsDepartmentNameMessage')
            );
            return;
        }

        // Permitimos nombres iguales en sucursales diferentes,
        // pero evitamos repetir el mismo departamento dentro de una misma sucursal.
        const departamentoExistente = departamentos.some(
            (departamento) =>
                departamento.sucursal_id === sucursalDepartamentoId &&
                departamento.nombre.trim().toLowerCase() === nombreLimpio.toLowerCase()
        );

        if (departamentoExistente) {
            Alert.alert(
                t('locationsDepartmentExistingTitle'),
                t('locationsDepartmentExistingMessage')
            );
            return;
        }

        try {
            setGuardandoDepartamento(true);

            const nuevoDepartamento = await dispatch(
                crearDepartamentoEnSupabase({
                    nombre: nombreLimpio,
                    sucursalId: sucursalDepartamentoId,
                })
            ).unwrap();

            // Limpiamos el formulario solamente después de guardar correctamente.
            setNombreDepartamento('');
            setSucursalDepartamentoId(null);

            Alert.alert(
                t('locationsDepartmentCreatedTitle'),
                `${nuevoDepartamento.nombre} ${t('locationsRegisteredSuffix')}`
            );
        } catch (error) {
            console.log('Error al crear departamento:', error);

            const mensaje =
                typeof error === 'string'
                    ? error
                    : error instanceof Error
                        ? error.message
                        : t('locationsDepartmentErrorMessage');

            Alert.alert(t('locationsDepartmentErrorTitle'), mensaje);
        } finally {
            setGuardandoDepartamento(false);
        }
    };

    return (
        <SafeAreaView edges={['top', 'left', 'right']} style={[styles.safeArea, { backgroundColor: colors.background }]}>
            <ScrollView
                style={{ backgroundColor: colors.background }}
                contentContainerStyle={styles.container}
                keyboardShouldPersistTaps="handled"
            >
                {/* Encabezado de administración de ubicaciones. */}
                <View style={styles.header}>
                    <TouchableOpacity onPress={() => navigation.goBack()} disabled={guardando}>
                        <Ionicons name="arrow-back" size={24} color={colors.text} />
                    </TouchableOpacity>

                    <View>
                        <Text style={[styles.title, { color: colors.primary }]}>
                            {t('locationsTitle')}
                        </Text>

                        <Text style={[styles.description, { color: colors.textSecondary }]}>
                            {t('locationsSubtitle')}
                        </Text>
                    </View>
                </View>

                {/* Formulario disponible únicamente para administradores. */}
                {esAdministrador && (
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
                            <View
                                style={[
                                    styles.iconContainer,
                                    { backgroundColor: colors.background },
                                ]}
                            >
                                <Ionicons
                                    name="business-outline"
                                    size={22}
                                    color={colors.primary}
                                />
                            </View>

                            <View style={styles.sectionHeaderText}>
                                <Text style={[styles.sectionTitle, { color: colors.text }]}>
                                    {t('locationsNewBranchTitle')}
                                </Text>

                                <Text
                                    style={[
                                        styles.sectionDescription,
                                        { color: colors.textSecondary },
                                    ]}
                                >
                                    {t('locationsNewBranchDescription')}
                                </Text>
                            </View>
                        </View>

                        <Text style={[styles.label, { color: colors.text }]}>
                            {t('locationsBranchNameLabel')}
                        </Text>

                        <CustomInput
                            type="text"
                            placeholder={t('locationsBranchPlaceholder')}
                            value={nombreSucursal}
                            onChange={setNombreSucursal}
                        />

                        {/* Evitamos registros dobles mientras Supabase procesa la solicitud. */}
                        {guardando ? (
                            <View style={styles.loadingContainer}>
                                <ActivityIndicator size="small" color={colors.primary} />

                                <Text style={{ color: colors.textSecondary }}>
                                    {t('locationsRegisteringBranch')}
                                </Text>
                            </View>
                        ) : (
                            <CustomButton
                                title={t('locationsCreateBranchButton')}
                                onPress={handleCrearSucursal}
                            />
                        )}
                    </View>
                )}

                {/* El catálogo proviene directamente de Redux y se actualiza al crear. */}
                <View style={styles.listSection}>
                    <Text style={[styles.sectionTitle, { color: colors.text }]}>
                        {t('locationsRegisteredBranches')}
                    </Text>

                    <Text
                        style={[
                            styles.counterText,
                            { color: colors.textSecondary },
                        ]}
                    >
                        {sucursales.length} {sucursales.length === 1 ? t('locationsBranchSingular') : t('locationsBranchPlural')}
                    </Text>

                    {sucursales.length === 0 ? (
                        <View
                            style={[
                                styles.emptyCard,
                                {
                                    backgroundColor: colors.surface,
                                    borderColor: colors.border,
                                },
                            ]}
                        >
                            <Ionicons
                                name="business-outline"
                                size={28}
                                color={colors.textSecondary}
                            />

                            <Text
                                style={[
                                    styles.emptyText,
                                    { color: colors.textSecondary },
                                ]}
                            >
                                {t('locationsNoBranches')}
                            </Text>
                        </View>
                    ) : (
                        sucursales.map((sucursal) => (
                            <View
                                key={sucursal.id}
                                style={[
                                    styles.sucursalRow,
                                    {
                                        backgroundColor: colors.surface,
                                        borderColor: colors.border,
                                    },
                                ]}
                            >
                                <View
                                    style={[
                                        styles.sucursalIcon,
                                        { backgroundColor: colors.background },
                                    ]}
                                >
                                    <Ionicons
                                        name="location-outline"
                                        size={20}
                                        color={colors.primary}
                                    />
                                </View>

                                <Text
                                    style={[
                                        styles.sucursalNombre,
                                        { color: colors.text },
                                    ]}
                                >
                                    {sucursal.nombre}
                                </Text>

                                <Ionicons
                                    name="checkmark-circle-outline"
                                    size={21}
                                    color={colors.primary}
                                />
                            </View>
                        ))
                    )}
                </View>

                {/* Formulario para registrar departamentos relacionados con una sucursal. */}
                {esAdministrador && (
                    <View
                        style={[
                            styles.formCard,
                            {
                                backgroundColor: colors.surface,
                                borderColor: colors.border,
                                marginTop: 20,
                            },
                        ]}
                    >
                        <View style={styles.sectionHeader}>
                            <View
                                style={[
                                    styles.iconContainer,
                                    { backgroundColor: colors.background },
                                ]}
                            >
                                <Ionicons
                                    name="layers-outline"
                                    size={22}
                                    color={colors.primary}
                                />
                            </View>

                            <View style={styles.sectionHeaderText}>
                                <Text style={[styles.sectionTitle, { color: colors.text }]}>
                                    {t('locationsNewDepartmentTitle')}
                                </Text>

                                <Text
                                    style={[
                                        styles.sectionDescription,
                                        { color: colors.textSecondary },
                                    ]}
                                >
                                    {t('locationsNewDepartmentDescription')}
                                </Text>
                            </View>
                        </View>

                        <Text style={[styles.label, { color: colors.text }]}>
                            {t('locationsBranchLabel')}
                        </Text>

                        {/* Selector de sucursal basado en el catálogo real de Redux. */}
                        <TouchableOpacity
                            style={[
                                styles.selectField,
                                {
                                    backgroundColor: colors.background,
                                    borderColor: colors.border,
                                },
                            ]}
                            onPress={() => setMostrarSucursalesModal(true)}
                            disabled={guardandoDepartamento}
                        >
                            <Text
                                style={{
                                    color: sucursalDepartamento
                                        ? colors.text
                                        : colors.textSecondary,
                                }}
                            >
                                {sucursalDepartamento?.nombre ?? t('locationsSelectBranch')}
                            </Text>

                            <Ionicons
                                name="chevron-down"
                                size={20}
                                color={colors.textSecondary}
                            />
                        </TouchableOpacity>

                        <Text style={[styles.label, { color: colors.text }]}>
                            {t('locationsDepartmentLabel')}
                        </Text>

                        <CustomInput
                            type="text"
                            placeholder={t('locationsDepartmentPlaceholder')}
                            value={nombreDepartamento}
                            onChange={setNombreDepartamento}
                        />

                        {guardandoDepartamento ? (
                            <View style={styles.loadingContainer}>
                                <ActivityIndicator size="small" color={colors.primary} />

                                <Text style={{ color: colors.textSecondary }}>
                                    {t('locationsRegisteringDepartment')}
                                </Text>
                            </View>
                        ) : (
                            <CustomButton
                                title={t('locationsCreateDepartmentButton')}
                                onPress={handleCrearDepartamento}
                            />
                        )}
                    </View>
                )}

                {/* Listado actualizado automáticamente desde Redux. */}
                <View style={[styles.listSection, { marginTop: 8 }]}>
                    <Text style={[styles.sectionTitle, { color: colors.text }]}>
                        {t('locationsRegisteredDepartments')}
                    </Text>

                    <Text
                        style={[
                            styles.counterText,
                            { color: colors.textSecondary },
                        ]}
                    >
                        {departamentos.length}{' '}
                        {departamentos.length === 1 ? t('locationsDepartmentSingular') : t('locationsDepartmentPlural')}
                    </Text>

                    {departamentos.length === 0 ? (
                        <View
                            style={[
                                styles.emptyCard,
                                {
                                    backgroundColor: colors.surface,
                                    borderColor: colors.border,
                                },
                            ]}
                        >
                            <Ionicons
                                name="layers-outline"
                                size={28}
                                color={colors.textSecondary}
                            />

                            <Text
                                style={[
                                    styles.emptyText,
                                    { color: colors.textSecondary },
                                ]}
                            >
                                {t('locationsNoDepartments')}
                            </Text>
                        </View>
                    ) : (
                        departamentos.map((departamento) => {
                            // Obtenemos el nombre de la sucursal relacionada mediante su ID.
                            const sucursalRelacionada = sucursales.find(
                                (sucursal) => sucursal.id === departamento.sucursal_id
                            );

                            return (
                                <View
                                    key={departamento.id}
                                    style={[
                                        styles.sucursalRow,
                                        {
                                            backgroundColor: colors.surface,
                                            borderColor: colors.border,
                                        },
                                    ]}
                                >
                                    <View
                                        style={[
                                            styles.sucursalIcon,
                                            { backgroundColor: colors.background },
                                        ]}
                                    >
                                        <Ionicons
                                            name="layers-outline"
                                            size={20}
                                            color={colors.primary}
                                        />
                                    </View>

                                    <View style={{ flex: 1 }}>
                                        <Text
                                            style={[
                                                styles.sucursalNombre,
                                                { color: colors.text },
                                            ]}
                                        >
                                            {departamento.nombre}
                                        </Text>

                                        <Text
                                            style={[
                                                styles.departmentBranch,
                                                { color: colors.textSecondary },
                                            ]}
                                        >
                                            {sucursalRelacionada?.nombre ?? t('locationsBranchUnavailable')}
                                        </Text>
                                    </View>

                                    <Ionicons
                                        name="checkmark-circle-outline"
                                        size={21}
                                        color={colors.primary}
                                    />
                                </View>
                            );
                        })
                    )}
                </View>

                <View style={{ height: 30 }} />
            </ScrollView>

            {/* Selector de sucursal para relacionar el nuevo departamento. */}
            <Modal
                visible={mostrarSucursalesModal}
                transparent
                animationType="fade"
                onRequestClose={() => setMostrarSucursalesModal(false)}
            >
                <View style={styles.modalOverlay}>
                    <View
                        style={[
                            styles.modalCard,
                            { backgroundColor: colors.surface },
                        ]}
                    >
                        <View style={styles.modalHeader}>
                            <Text style={[styles.modalTitle, { color: colors.text }]}>
                                {t('locationsSelectBranchTitle')}
                            </Text>

                            <TouchableOpacity
                                onPress={() => setMostrarSucursalesModal(false)}
                            >
                                <Ionicons
                                    name="close"
                                    size={24}
                                    color={colors.textSecondary}
                                />
                            </TouchableOpacity>
                        </View>

                        {sucursales.length === 0 ? (
                            <Text
                                style={[
                                    styles.modalEmptyText,
                                    { color: colors.textSecondary },
                                ]}
                            >
                                {t('locationsRegisterBranchFirst')}
                            </Text>
                        ) : (
                            sucursales.map((sucursal) => (
                                <TouchableOpacity
                                    key={sucursal.id}
                                    style={[
                                        styles.modalOption,
                                        { borderBottomColor: colors.border },
                                    ]}
                                    onPress={() => {
                                        setSucursalDepartamentoId(sucursal.id);
                                        setMostrarSucursalesModal(false);
                                    }}
                                >
                                    <Text
                                        style={[
                                            styles.modalOptionText,
                                            { color: colors.text },
                                        ]}
                                    >
                                        {sucursal.nombre}
                                    </Text>

                                    {sucursalDepartamentoId === sucursal.id && (
                                        <Ionicons
                                            name="checkmark"
                                            size={21}
                                            color={colors.primary}
                                        />
                                    )}
                                </TouchableOpacity>
                            ))
                        )}
                    </View>
                </View>
            </Modal>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    safeArea: { flex: 1 },
    container: { paddingHorizontal: 16, paddingTop: 20 },

    header: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
        marginBottom: 24,
    },

    title: { fontSize: 22, fontWeight: 'bold' },
    description: { fontSize: 13, marginTop: 2 },

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

    sectionHeaderText: { flex: 1 },
    sectionTitle: { fontSize: 17, fontWeight: '700' },
    sectionDescription: { fontSize: 13, marginTop: 2 },

    label: {
        fontSize: 14,
        fontWeight: '600',
        marginBottom: 7,
    },

    loadingContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 8,
        paddingVertical: 16,
    },

    listSection: { marginTop: 2 },
    counterText: { fontSize: 13, marginTop: 3, marginBottom: 12 },

    sucursalRow: {
        flexDirection: 'row',
        alignItems: 'center',
        borderWidth: 1,
        borderRadius: 12,
        padding: 12,
        marginBottom: 10,
    },

    sucursalIcon: {
        width: 38,
        height: 38,
        borderRadius: 9,
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 11,
    },

    sucursalNombre: {
        flex: 1,
        fontSize: 15,
        fontWeight: '600',
    },

    emptyCard: {
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 1,
        borderRadius: 12,
        paddingVertical: 25,
    },

    emptyText: {
        fontSize: 14,
        marginTop: 8,
    },

    selectField: {
        minHeight: 50,
        borderWidth: 1,
        borderRadius: 10,
        paddingHorizontal: 14,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: 14,
    },

    departmentBranch: {
        fontSize: 12,
        marginTop: 3,
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

    modalTitle: {
        fontSize: 18,
        fontWeight: '700',
    },

    modalOption: {
        minHeight: 50,
        borderBottomWidth: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },

    modalOptionText: {
        fontSize: 15,
        flex: 1,
    },

    modalEmptyText: {
        textAlign: 'center',
        paddingVertical: 20,
        fontSize: 14,
    },
});