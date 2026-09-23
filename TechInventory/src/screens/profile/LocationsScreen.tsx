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
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { NativeStackScreenProps } from '@react-navigation/native-stack';

import { useTheme } from '../../context/ThemeContext';
// Redux permitirá registrar la sucursal en Supabase y actualizar el catálogo local.
import { useAppDispatch, useAppSelector } from '../../redux/hooks';
import { crearSucursalEnSupabase } from '../../redux/sucursalesSlice';

import CustomInput from '../../components/CustomInput';
import CustomButton from '../../components/CustomButton';
import type { ProfileStackParamList } from '../../navigation/ProfileNavigator';

// 2. Tipamos las propiedades de navegación de esta pantalla.
type Props = NativeStackScreenProps<ProfileStackParamList, 'LocationsScreen'>;

export default function LocationsScreen({ navigation }: Props) {
    // 3. Obtenemos los colores del tema actual.
    const { colors } = useTheme();

    // 4. Redux se encargará de conectar esta pantalla con Supabase.
    const dispatch = useAppDispatch();

    // 5. Recuperamos las sucursales actuales para mostrarlas y evitar nombres repetidos.
    const sucursales = useAppSelector((state) => state.sucursales.sucursales);

    // 6. Recuperamos al usuario autenticado para comprobar que sea administrador.
    const currentUser = useAppSelector((state) =>
        state.users.users.find((user) => user.id === state.users.currentUserId)
    );

    const esAdministrador = currentUser?.rol === 'administrador';

    // 7. Estados exclusivos del formulario para crear una sucursal.
    const [nombreSucursal, setNombreSucursal] = useState('');
    const [guardando, setGuardando] = useState(false);

    // 8. Valida y registra una nueva sucursal mediante Redux → servicio → Supabase.
    const handleCrearSucursal = async () => {
        // Aunque esta pantalla se abre desde una opción exclusiva de administrador,
        // volvemos a comprobar el rol antes de permitir el registro.
        if (!esAdministrador) {
            Alert.alert(
                'Acceso restringido',
                'Solo un administrador puede registrar nuevas sucursales.'
            );
            return;
        }

        if (guardando) return;

        // Eliminamos espacios innecesarios antes de validar y guardar.
        const nombreLimpio = nombreSucursal.trim().replace(/\s+/g, ' ');

        if (nombreLimpio.length < 2) {
            Alert.alert(
                'Nombre requerido',
                'Ingresa un nombre válido para la sucursal.'
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
                'Sucursal existente',
                'Ya existe una sucursal registrada con ese nombre.'
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
                'Sucursal creada',
                `${nuevaSucursal.nombre} fue registrada correctamente.`
            );
        } catch (error) {
            console.log('Error al crear sucursal:', error);

            const mensaje =
                typeof error === 'string'
                    ? error
                    : error instanceof Error
                        ? error.message
                        : 'No fue posible registrar la sucursal.';

            Alert.alert('No se pudo crear la sucursal', mensaje);
        } finally {
            setGuardando(false);
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
                            Sucursales
                        </Text>

                        <Text style={[styles.description, { color: colors.textSecondary }]}>
                            Administración de ubicaciones
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
                                    Nueva sucursal
                                </Text>

                                <Text
                                    style={[
                                        styles.sectionDescription,
                                        { color: colors.textSecondary },
                                    ]}
                                >
                                    Registra una nueva ubicación de la empresa.
                                </Text>
                            </View>
                        </View>

                        <Text style={[styles.label, { color: colors.text }]}>
                            Nombre de la sucursal
                        </Text>

                        <CustomInput
                            type="text"
                            placeholder="Ej. Sucursal San Pedro Sula"
                            value={nombreSucursal}
                            onChange={setNombreSucursal}
                        />

                        {/* Evitamos registros dobles mientras Supabase procesa la solicitud. */}
                        {guardando ? (
                            <View style={styles.loadingContainer}>
                                <ActivityIndicator size="small" color={colors.primary} />

                                <Text style={{ color: colors.textSecondary }}>
                                    Registrando sucursal...
                                </Text>
                            </View>
                        ) : (
                            <CustomButton
                                title="Crear sucursal"
                                onPress={handleCrearSucursal}
                            />
                        )}
                    </View>
                )}

                {/* El catálogo proviene directamente de Redux y se actualiza al crear. */}
                <View style={styles.listSection}>
                    <Text style={[styles.sectionTitle, { color: colors.text }]}>
                        Sucursales registradas
                    </Text>

                    <Text
                        style={[
                            styles.counterText,
                            { color: colors.textSecondary },
                        ]}
                    >
                        {sucursales.length} {sucursales.length === 1 ? 'sucursal' : 'sucursales'}
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
                                No hay sucursales registradas.
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

                <View style={{ height: 30 }} />
            </ScrollView>
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
});