
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from "react-native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";

import type { EquipmentStackParamList } from "../../navigation/EquipmentNavigator";
import { useTheme } from "../../context/ThemeContext";
// Permite consultar el equipo y su historial directamente desde Redux.
import { useAppSelector } from "../../redux/hooks";
import { useLanguage } from "../../context/LanguageContext";


// 1. Indicamos que esta pantalla pertenece a la ruta EquipmentHistory.
type Props = NativeStackScreenProps<
    EquipmentStackParamList,
    "EquipmentHistory"
>;


const EquipmentHistoryScreen = ({ route, navigation }: Props) => {

    // 2. Recibimos únicamente el código del equipo seleccionado.
    const { codigo } = route.params;

    // 3. Obtenemos los colores del tema actual.
    const { colors } = useTheme();

    // Obtenemos las traducciones y el idioma actual de la aplicación.
    const { t, language } = useLanguage();

    // 4. Buscamos en Redux el equipo correspondiente al código recibido.
    const equipo = useAppSelector(
        (state) => state.equipment.equipments.find((equipo) => equipo.codigo === codigo)
    );

    // 5. Obtenemos su historial de ubicaciones.
    // Si todavía no posee movimientos, utilizamos un arreglo vacío.
    const historialUbicaciones = equipo?.historialUbicaciones ?? [];

    // Convierte la fecha almacenada en formato ISO a un formato
    // más fácil de leer según el idioma actual de la aplicación.
    const formatHistoryDate = (fecha: string) => {
        const locale = language === "en" ? "en-US" : "es-HN";

        return new Date(fecha).toLocaleString(locale, {
            day: "2-digit",
            month: "short",
            year: "numeric",
            hour: "2-digit",
            minute: "2-digit",
        });
    };

    return (
        <SafeAreaView style={[styles.safeArea, { backgroundColor: colors.background }]}>

            {/* Botón para regresar al detalle del equipo. */}
            <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
                <Ionicons name="arrow-back" size={22} color={colors.primary} />
                <Text style={[styles.backText, { color: colors.primary }]}>
                     {t("backButton")}
                </Text>
            </TouchableOpacity>


            <ScrollView
                showsVerticalScrollIndicator={false}
                contentContainerStyle={styles.container}
            >
                {/* Información principal del historial consultado. */}
                <Text style={[styles.title, { color: colors.text }]}>
                    {t("equipmentHistoryTitle")}
                </Text>

                <Text style={[styles.code, { color: colors.primary }]}>
                    {codigo}
                </Text>

                <Text style={[styles.historyCount, { color: colors.textSecondary }]}>
                    {t("registeredMovements")} {historialUbicaciones.length}
                </Text>


                {/* Si no existen movimientos mostramos un mensaje informativo. */}
                {historialUbicaciones.length === 0 ? (
                    <View style={[styles.emptyCard, {
                        backgroundColor: colors.cardBackground,
                        borderColor: colors.cardBorder
                    }]}>
                        <Ionicons
                            name="time-outline"
                            size={36}
                            color={colors.textSecondary}
                        />

                        <Text style={[styles.emptyTitle, { color: colors.text }]}>
                            {t("noMovementsTitle")}
                        </Text>

                        <Text style={[styles.emptyText, { color: colors.textSecondary }]}>
                            {t("noMovementsMessage")}
                        </Text>
                    </View>
                ) : (

                    // Creamos una copia del historial y mostramos primero
                    // los movimientos más recientes.
                    [...historialUbicaciones].reverse().map((movimiento, index) => (

                        <View
                            key={`${movimiento.fecha}-${index}`}
                            style={[styles.historyCard, {
                                backgroundColor: colors.cardBackground,
                                borderColor: colors.cardBorder
                            }]}
                        >
                            {/* Fecha en la que se realizó el movimiento. */}
                            <View style={styles.historyHeader}>
                                <Ionicons
                                    name="location-outline"
                                    size={21}
                                    color={colors.primary}
                                />

                                <Text style={[styles.historyDate, { color: colors.textSecondary }]}>
                                    {formatHistoryDate(movimiento.fecha)}
                                </Text>
                            </View>


                            {/* Ubicación anterior del equipo. */}
                            <View style={styles.locationBlock}>
                                <Text style={[styles.locationLabel, { color: colors.textSecondary }]}>
                                    {t("previousLocation")}
                                </Text>

                                <Text style={[styles.locationValue, { color: colors.text }]}>
                                    {movimiento.sucursalAnterior}
                                </Text>

                                <Text style={[styles.departmentValue, { color: colors.textSecondary }]}>
                                    {movimiento.departamentoAnterior}
                                </Text>
                            </View>


                            {/* Indicamos visualmente el movimiento hacia la nueva ubicación. */}
                            <View style={styles.arrowContainer}>
                                <Ionicons
                                    name="arrow-down"
                                    size={22}
                                    color={colors.primary}
                                />
                            </View>


                            {/* Nueva ubicación asignada al equipo. */}
                            <View style={styles.locationBlock}>
                                <Text style={[styles.locationLabel, { color: colors.textSecondary }]}>
                                    {t("newLocation")}
                                </Text>

                                <Text style={[styles.locationValue, { color: colors.text }]}>
                                    {movimiento.sucursalNueva}
                                </Text>

                                <Text style={[styles.departmentValue, { color: colors.textSecondary }]}>
                                    {movimiento.departamentoNuevo}
                                </Text>
                            </View>

                        </View>
                    ))
                )}
            </ScrollView>

        </SafeAreaView>
    );
};


const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
        paddingHorizontal: 20,
        paddingTop: 20,
    },

    backButton: {
        flexDirection: "row",
        alignItems: "center",
        marginBottom: 24,
    },

    backText: {
        marginLeft: 6,
        fontSize: 16,
        fontWeight: "600",
    },

    title: {
        fontSize: 26,
        fontWeight: "700",
    },

    code: {
        fontSize: 16,
        fontWeight: "700",
        marginTop: 8,
    },

    // Cantidad de movimientos almacenados para el equipo.
    historyCount: {
        fontSize: 15,
        marginTop: 10,
    },

    // Espacio inferior para permitir desplazamiento cómodo.
    container: {
        paddingBottom: 30,
    },

    // Tarjeta utilizada para cada cambio de ubicación.
    historyCard: {
        borderWidth: 1,
        borderRadius: 14,
        padding: 16,
        marginTop: 16,
    },

    // Encabezado con icono y fecha del movimiento.
    historyHeader: {
        flexDirection: "row",
        alignItems: "center",
        marginBottom: 16,
    },

    historyDate: {
        fontSize: 13,
        marginLeft: 7,
    },

    // Agrupa la sucursal y departamento de cada ubicación.
    locationBlock: {
        paddingHorizontal: 4,
    },

    locationLabel: {
        fontSize: 12,
        marginBottom: 4,
    },

    locationValue: {
        fontSize: 16,
        fontWeight: "700",
    },

    departmentValue: {
        fontSize: 14,
        marginTop: 3,
    },

    // Centra la flecha entre la ubicación anterior y la nueva.
    arrowContainer: {
        alignItems: "center",
        paddingVertical: 10,
    },

    // Estado mostrado cuando el equipo todavía no tiene historial.
    emptyCard: {
        alignItems: "center",
        borderWidth: 1,
        borderRadius: 14,
        padding: 24,
        marginTop: 24,
    },

    emptyTitle: {
        fontSize: 17,
        fontWeight: "700",
        marginTop: 12,
    },

    emptyText: {
        fontSize: 14,
        textAlign: "center",
        lineHeight: 20,
        marginTop: 6,
    },
});


export default EquipmentHistoryScreen;