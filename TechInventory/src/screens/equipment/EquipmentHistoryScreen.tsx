
import { View, Text, Image, StyleSheet, TouchableOpacity, ScrollView } from "react-native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useState } from "react";

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

// Filtros que actualmente puede utilizar la pantalla de historial.
type HistoryFilter = "todos" | "mantenimientos" | "ubicaciones" | "baja";


const EquipmentHistoryScreen = ({ route, navigation }: Props) => {

    // 2. Recibimos únicamente el código del equipo seleccionado.
    const { codigo } = route.params;

    // 3. Obtenemos los colores del tema actual.
    const { colors } = useTheme();

    // Obtenemos las traducciones y el idioma actual de la aplicación.
    const { t, language } = useLanguage();

    // Controla qué tipo de eventos se muestran en el historial.
    const [historyFilter, setHistoryFilter] = useState<HistoryFilter>("todos");

    // 4. Buscamos en Redux el equipo correspondiente al código recibido.
    const equipo = useAppSelector(
        (state) => state.equipment.equipments.find((equipo) => equipo.codigo === codigo)
    );

    // 5. Obtenemos su historial de ubicaciones.
    // Si todavía no posee movimientos, utilizamos un arreglo vacío.
    const historialUbicaciones = equipo?.historialUbicaciones ?? [];

    // Obtenemos el historial de cambios de estado del equipo.
    // Los equipos antiguos pueden no tener este arreglo todavía.
    const historialEstados = equipo?.historialEstados ?? [];

    // Combinamos los distintos tipos de eventos para utilizarlos
    // posteriormente dentro del filtro Todos.
    const eventosTodos = [
        ...historialUbicaciones.map((movimiento) => ({
            tipo: "ubicacion" as const,
            fecha: movimiento.fecha,
            data: movimiento,
        })),

        ...historialEstados.map((evento) => ({
            tipo: "estado" as const,
            fecha: evento.fecha,
            data: evento,
        })),
    ].sort(
        (a, b) =>
            new Date(b.fecha).getTime() -
            new Date(a.fecha).getTime()
    );


    // Indica cuándo se está mostrando el historial general.
    const mostrarTodos = historyFilter === "todos";

    // Ubicaciones ahora corresponde únicamente a su propio filtro.
    const mostrarUbicaciones = historyFilter === "ubicaciones";

    // Indica si el usuario está consultando un tipo de historial
    // que todavía no posee registros conectados.
    const mostrarMantenimientos = historyFilter === "mantenimientos";
    const mostrarBajas = historyFilter === "baja";

    // Mostramos el estado actual utilizando las traducciones existentes.
    const estadoActual =
        equipo?.status === "activo"
            ? t("statusActive")
            : equipo?.status === "taller"
                ? t("statusWorkshop")
                : t("statusInactive");

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

    // Convierte el valor interno del estado en el texto traducido
    // que se mostrará dentro del historial del equipo.
    const getStatusLabel = (status: "activo" | "taller" | "baja") => {
        if (status === "activo") return t("statusActive");
        if (status === "taller") return t("statusWorkshop");

        return t("statusInactive");
    };

    return (
        <SafeAreaView style={[styles.safeArea, { backgroundColor: colors.background }]}>

            {/* Botón para regresar al detalle del equipo. */}
            <View style={styles.header}>
                <TouchableOpacity
                    style={styles.headerBackButton}
                    onPress={() => navigation.goBack()}
                >
                    <Ionicons name="arrow-back" size={22} color={colors.primary} />
                </TouchableOpacity>
                {/* Título principal de la pantalla. */}
                <Text style={[styles.headerTitle, { color: colors.primary }]}>
                    {t("equipmentHistoryTitle")}
                </Text>
            </View>


            <ScrollView
                showsVerticalScrollIndicator={false}
                contentContainerStyle={styles.container}
            >


                {/* Resumen del equipo al que pertenece el historial. */}
                {equipo && (
                    <View style={[styles.equipmentSummaryCard,
                    {
                        backgroundColor: colors.cardBackground,
                        borderColor: colors.cardBorder,
                    },
                    ]}
                    >
                        {/* Fotografía actual del equipo. */}
                        <Image source={equipo.foto} style={styles.summaryImage} />


                        {/* Información principal del equipo. */}
                        <View style={styles.summaryInfo}>

                            <View style={styles.summaryTopRow}>
                                <Text style={[styles.summaryCode, { color: colors.primary },]}>
                                    {equipo.codigo}
                                </Text>

                                {/* Estado actual del equipo. */}
                                <View style={[styles.statusBadge,
                                {
                                    backgroundColor:
                                        equipo.status === "activo"
                                            ? "#DCFCE7"
                                            : equipo.status === "taller"
                                                ? "#FEF3C7"
                                                : "#FEE2E2",
                                },
                                ]}
                                >
                                    <Text style={[styles.statusText, {
                                        color: equipo.status === "activo" ? "#15803D" :
                                            equipo.status === "taller" ? "#B45309" : "#B91C1C",
                                    },]}
                                    >
                                        {estadoActual}
                                    </Text>
                                </View>
                            </View>


                            {/* Marca y modelo actuales. */}
                            <Text style={[styles.summaryModel, { color: colors.text },]} numberOfLines={1}>
                                {equipo.marca} {equipo.modelo}
                            </Text>


                            {/* Serie del equipo. */}
                            <Text style={[styles.summarySerial, { color: colors.textSecondary },]} numberOfLines={1}>
                                {t("seriesLabel")}: {equipo.serie}
                            </Text>

                        </View>
                    </View>
                )}


                {/* Filtros disponibles para consultar los distintos tipos
                de eventos registrados en el historial del equipo. */}
                <View style={styles.historyFilters}>

                    {/* Todos */}
                    <TouchableOpacity
                        style={[
                            styles.historyFilterButton,
                            {
                                backgroundColor:
                                    historyFilter === "todos"
                                        ? colors.primary
                                        : colors.surface,
                            },
                        ]}
                        onPress={() => setHistoryFilter("todos")}
                    >
                        <Text
                            numberOfLines={1}
                            style={[
                                styles.historyFilterText,
                                {
                                    color:
                                        historyFilter === "todos"
                                            ? colors.background
                                            : colors.textSecondary,
                                },
                            ]}
                        >
                            {t("allMasculine")}
                        </Text>
                    </TouchableOpacity>


                    {/* Mantenimientos: preparado para integración futura. */}
                    {/* Historial de mantenimientos.Actualmente mostrará un estado vacío 
                    hasta integrar los datos desarrollados en el módulo de Mantenimiento. */}
                    <TouchableOpacity
                        style={[
                            styles.historyFilterButton,
                            {
                                backgroundColor:
                                    historyFilter === "mantenimientos"
                                        ? colors.primary
                                        : colors.surface,
                            },
                        ]}
                        onPress={() => setHistoryFilter("mantenimientos")}
                    >
                        <Text
                            numberOfLines={1}
                            style={[
                                styles.historyFilterText,
                                {
                                    color:
                                        historyFilter === "mantenimientos"
                                            ? colors.background
                                            : colors.textSecondary,
                                },
                            ]}
                        >
                            {t("maintenanceHistoryFilter")}
                        </Text>
                    </TouchableOpacity>


                    {/* Ubicaciones */}
                    <TouchableOpacity
                        style={[
                            styles.historyFilterButton,
                            {
                                backgroundColor:
                                    historyFilter === "ubicaciones"
                                        ? colors.primary
                                        : colors.surface,
                            },
                        ]}
                        onPress={() => setHistoryFilter("ubicaciones")}
                    >
                        <Text
                            numberOfLines={1}
                            style={[
                                styles.historyFilterText,
                                {
                                    color:
                                        historyFilter === "ubicaciones"
                                            ? colors.background
                                            : colors.textSecondary,
                                },
                            ]}
                        >
                            {t("locationsHistoryFilter")}
                        </Text>
                    </TouchableOpacity>


                    {/* Baja: visible pero pendiente de historial de estados. */}
                    {/* Eventos relacionados con baja y reactivación del equipo. */}
                    <TouchableOpacity
                        style={[
                            styles.historyFilterButton,
                            {
                                backgroundColor:
                                    historyFilter === "baja"
                                        ? colors.primary
                                        : colors.surface,
                            },
                        ]}
                        onPress={() => setHistoryFilter("baja")}
                    >
                        <Text
                            numberOfLines={1}
                            style={[
                                styles.historyFilterText,
                                {
                                    color:
                                        historyFilter === "baja"
                                            ? colors.background
                                            : colors.textSecondary,
                                },
                            ]}
                        >
                            {t("statusInactive")}
                        </Text>
                    </TouchableOpacity>

                </View>


                {/* Si no existen movimientos mostramos un mensaje informativo. */}
                {/* Mantenimientos todavía no tiene una fuente de datos conectada. */}
                {mostrarTodos ? (

                    eventosTodos.length === 0 ? (

                        // Estado vacío cuando el equipo todavía no posee ningún evento.
                        <View style={[styles.emptyCard, { backgroundColor: colors.cardBackground, borderColor: colors.cardBorder }]}>
                            <Ionicons name="time-outline" size={36} color={colors.textSecondary} />

                            <Text style={[styles.emptyTitle, { color: colors.text }]}>
                                {t("noMovementsTitle")}
                            </Text>

                            <Text style={[styles.emptyText, { color: colors.textSecondary }]}>
                                {t("noMovementsMessage")}
                            </Text>
                        </View>

                    ) : (eventosTodos.map((evento, index) => {

                        // Eventos relacionados con baja o reactivación.
                        if (evento.tipo === "estado") {
                            const cambioEstado = evento.data;

                            return (
                                <View key={`estado-${evento.fecha}-${index}`} style={styles.timelineItem}>
                                    <View style={styles.timelineIndicator}>
                                        <View
                                            style={[
                                                styles.timelineIcon,
                                                {
                                                    backgroundColor:
                                                        cambioEstado.estadoNuevo === "baja"
                                                            ? "#DC2626"
                                                            : "#16A34A",
                                                },
                                            ]}
                                        >
                                            <Ionicons
                                                name={cambioEstado.estadoNuevo === "baja" ? "archive-outline" : "refresh-outline"}
                                                size={20}
                                                color="#FFFFFF"
                                            />
                                        </View>

                                        {index < eventosTodos.length - 1 && (
                                            <View style={[styles.timelineLine, { backgroundColor: colors.border }]} />
                                        )}
                                    </View>

                                    <View style={styles.timelineContent}>
                                        <Text style={[styles.timelineDate, { color: colors.textSecondary }]}>
                                            {formatHistoryDate(cambioEstado.fecha)}
                                        </Text>

                                        <Text style={[styles.timelineTitle, { color: colors.text }]}>
                                            {cambioEstado.estadoNuevo === "baja"
                                                ? t("equipmentDeactivatedEvent")
                                                : t("equipmentReactivatedEvent")}
                                        </Text>

                                        <Text style={[styles.timelineLocation, { color: colors.textSecondary }]}>
                                            {t("statusChangeLabel")}:{" "}
                                            <Text style={{ color: colors.text, fontWeight: "600" }}>
                                                {getStatusLabel(cambioEstado.estadoAnterior)} → {getStatusLabel(cambioEstado.estadoNuevo)}
                                            </Text>
                                        </Text>

                                        {/* Información opcional del evento de estado. */}
                                        {cambioEstado.motivo && (
                                            <Text style={[styles.timelineExtraInfo, { color: colors.textSecondary }]}>
                                                {t("reasonLabel")}: <Text style={{ color: colors.text }}>{cambioEstado.motivo}</Text>
                                            </Text>
                                        )}

                                        {cambioEstado.realizadoPorNombre && (
                                            <Text style={[styles.timelineExtraInfo, { color: colors.textSecondary }]}>
                                                {t("performedByLabel")}: <Text style={{ color: colors.text, fontWeight: "600" }}>{cambioEstado.realizadoPorNombre}</Text>
                                            </Text>
                                        )}

                                    </View>
                                </View>
                            );
                        }

                        // Por ahora los demás eventos corresponden a ubicación o responsable.
                        const movimiento = evento.data;

                        const cambioUbicacion =
                            movimiento.sucursalAnterior !== movimiento.sucursalNueva ||
                            movimiento.departamentoAnterior !== movimiento.departamentoNuevo;

                        return (
                            <View key={`ubicacion-${evento.fecha}-${index}`} style={styles.timelineItem}>
                                <View style={styles.timelineIndicator}>
                                    <View style={[styles.timelineIcon, { backgroundColor: colors.primary }]}>
                                        <Ionicons
                                            name={cambioUbicacion ? "location-outline" : "person-outline"}
                                            size={20}
                                            color="#FFFFFF"
                                        />
                                    </View>

                                    {index < eventosTodos.length - 1 && (
                                        <View style={[styles.timelineLine, { backgroundColor: colors.border }]} />
                                    )}
                                </View>

                                <View style={styles.timelineContent}>
                                    <Text style={[styles.timelineDate, { color: colors.textSecondary }]}>
                                        {formatHistoryDate(movimiento.fecha)}
                                    </Text>

                                    <Text style={[styles.timelineTitle, { color: colors.text }]}>
                                        {cambioUbicacion
                                            ? t("locationChangeEvent")
                                            : t("responsibleChangeEvent")}
                                    </Text>

                                    {cambioUbicacion && (
                                        <>
                                            <Text style={[styles.timelineLocation, { color: colors.text }]}>
                                                <Text style={styles.timelineLocationLabel}>{t("historyFromLabel")}:</Text>{" "}
                                                {movimiento.sucursalAnterior} • {movimiento.departamentoAnterior}
                                            </Text>

                                            <Text style={[styles.timelineLocation, { color: colors.text }]}>
                                                <Text style={styles.timelineLocationLabel}>{t("historyToLabel")}:</Text>{" "}
                                                {movimiento.sucursalNueva} • {movimiento.departamentoNuevo}
                                            </Text>
                                        </>
                                    )}

                                    {!cambioUbicacion && (
                                        <Text style={[styles.timelineLocation, { color: colors.textSecondary }]}>
                                            {movimiento.sucursalNueva} • {movimiento.departamentoNuevo}
                                        </Text>
                                    )}

                                    {movimiento.empleadoAnterior !== undefined &&
                                        movimiento.empleadoNuevo !== undefined &&
                                        movimiento.empleadoAnterior !== movimiento.empleadoNuevo && (
                                            <Text style={[styles.timelineEmployeeChange, { color: colors.textSecondary }]}>
                                                {t("assignedLabel")}:{" "}
                                                {movimiento.empleadoAnterior || t("unassigned")}
                                                {"  →  "}
                                                <Text style={{ color: colors.text, fontWeight: "600" }}>
                                                    {movimiento.empleadoNuevo || t("unassigned")}
                                                </Text>
                                            </Text>
                                        )}

                                    {/* Mostramos quién realizó la reasignación cuando exista información del usuario. */}
                                    {movimiento.realizadoPorNombre && (
                                        <Text style={[styles.timelineExtraInfo, { color: colors.textSecondary }]}>
                                            {t("performedByLabel")}:{" "}
                                            <Text style={{ color: colors.text, fontWeight: "600" }}>
                                                {movimiento.realizadoPorNombre}
                                            </Text>
                                        </Text>
                                    )}

                                </View>
                            </View>
                        );
                    })

                    )

                ) : mostrarMantenimientos ? (
                    <View style={[styles.emptyCard, { backgroundColor: colors.cardBackground, borderColor: colors.cardBorder }]}>
                        <Ionicons name="construct-outline" size={36} color={colors.textSecondary} />

                        <Text style={[styles.emptyTitle, { color: colors.text }]}>
                            {t("noMaintenanceHistoryTitle")}
                        </Text>

                        <Text style={[styles.emptyText, { color: colors.textSecondary }]}>
                            {t("noMaintenanceHistoryMessage")}
                        </Text>
                    </View>
                ) : mostrarBajas && historialEstados.length === 0 ? (
                    /* El historial de baja/reactivación se conectará 
                    cuando almacenemos esos eventos individualmente. */
                    <View style={[styles.emptyCard, { backgroundColor: colors.cardBackground, borderColor: colors.cardBorder }]}>
                        <Ionicons name="archive-outline" size={36} color={colors.textSecondary} />

                        <Text style={[styles.emptyTitle, { color: colors.text }]}>
                            {t("noStatusHistoryTitle")}
                        </Text>

                        <Text style={[styles.emptyText, { color: colors.textSecondary }]}>
                            {t("noStatusHistoryMessage")}
                        </Text>
                    </View>
                ) : mostrarBajas ? (
                    [...historialEstados].reverse().map((evento, index) => (
                        <View
                            key={`${evento.fecha}-${index}`}
                            style={styles.timelineItem}
                        >
                            {/* Columna izquierda del evento. */}
                            <View style={styles.timelineIndicator}>
                                <View
                                    style={[
                                        styles.timelineIcon,
                                        {
                                            backgroundColor:
                                                evento.estadoNuevo === "baja"
                                                    ? "#DC2626"
                                                    : "#16A34A"
                                        }
                                    ]}
                                >
                                    <Ionicons
                                        name={
                                            evento.estadoNuevo === "baja"
                                                ? "archive-outline"
                                                : "refresh-outline"
                                        }
                                        size={20}
                                        color="#FFFFFF"
                                    />
                                </View>

                                {/* Une visualmente varios eventos de estado. */}
                                {index < historialEstados.length - 1 && (
                                    <View
                                        style={[
                                            styles.timelineLine,
                                            { backgroundColor: colors.border }
                                        ]}
                                    />
                                )}
                            </View>

                            {/* Información del cambio de estado. */}
                            <View style={styles.timelineContent}>
                                <Text style={[styles.timelineDate, { color: colors.textSecondary }]}>
                                    {formatHistoryDate(evento.fecha)}
                                </Text>

                                <Text style={[styles.timelineTitle, { color: colors.text }]}>
                                    {evento.estadoNuevo === "baja"
                                        ? t("equipmentDeactivatedEvent")
                                        : t("equipmentReactivatedEvent")}
                                </Text>

                                <Text style={[styles.timelineLocation, { color: colors.textSecondary }]}>
                                    {t("statusChangeLabel")}:{" "}
                                    <Text style={{ color: colors.text, fontWeight: "600" }}>
                                        {getStatusLabel(evento.estadoAnterior)} → {getStatusLabel(evento.estadoNuevo)}
                                    </Text>
                                </Text>

                                {/* Mostramos el motivo únicamente cuando el evento lo contiene. */}
                                {evento.motivo && (
                                    <Text style={[styles.timelineExtraInfo, { color: colors.textSecondary }]}>
                                        {t("reasonLabel")}: <Text style={{ color: colors.text }}>{evento.motivo}</Text>
                                    </Text>
                                )}

                                {/* Mostramos quién realizó la acción cuando exista información del usuario. */}
                                {evento.realizadoPorNombre && (
                                    <Text style={[styles.timelineExtraInfo, { color: colors.textSecondary }]}>
                                        {t("performedByLabel")}: <Text style={{ color: colors.text, fontWeight: "600" }}>{evento.realizadoPorNombre}</Text>
                                    </Text>
                                )}

                            </View>
                        </View>
                    ))) : mostrarUbicaciones && historialUbicaciones.length === 0 ? (
                        /* Estado vacío utilizado para Todos y Ubicaciones 
                        cuando el equipo todavía no posee movimientos. */
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

                    /* Todos y Ubicaciones muestran por ahora 
                    los movimientos reales almacenados en Redux. */
                    [...historialUbicaciones].reverse().map((movimiento, index) => {

                        // Determinamos si realmente cambió la ubicación.
                        // También existen reasignaciones donde únicamente cambia el empleado.
                        const cambioUbicacion =
                            movimiento.sucursalAnterior !== movimiento.sucursalNueva ||
                            movimiento.departamentoAnterior !== movimiento.departamentoNuevo;

                        return (
                            <View
                                key={`${movimiento.fecha}-${index}`}
                                style={styles.timelineItem}
                            >

                                {/* Columna izquierda con icono y línea vertical. */}
                                <View style={styles.timelineIndicator}>

                                    <View
                                        style={[
                                            styles.timelineIcon,
                                            { backgroundColor: colors.primary }
                                        ]}
                                    >
                                        <Ionicons
                                            name={cambioUbicacion ? "location-outline" : "person-outline"}
                                            size={20}
                                            color="#FFFFFF"
                                        />
                                    </View>

                                    {/* No mostramos la línea debajo del último movimiento. */}
                                    {index < historialUbicaciones.length - 1 && (
                                        <View
                                            style={[
                                                styles.timelineLine,
                                                { backgroundColor: colors.border }
                                            ]}
                                        />
                                    )}
                                </View>


                                {/* Información correspondiente al movimiento. */}
                                <View style={styles.timelineContent}>

                                    {/* Fecha del evento. */}
                                    <Text
                                        style={[
                                            styles.timelineDate,
                                            { color: colors.textSecondary }
                                        ]}
                                    >
                                        {formatHistoryDate(movimiento.fecha)}
                                    </Text>


                                    {/* Tipo de evento realizado. */}
                                    <Text
                                        style={[
                                            styles.timelineTitle,
                                            { color: colors.text }
                                        ]}
                                    >
                                        {cambioUbicacion
                                            ? t("locationChangeEvent")
                                            : t("responsibleChangeEvent")}
                                    </Text>

                                    {/* Ubicación anterior y nueva mostradas de forma compacta. */}
                                    {cambioUbicacion && (
                                        <>
                                            <Text style={[styles.timelineLocation, { color: colors.text }]}>
                                                <Text style={styles.timelineLocationLabel}>
                                                    {t("historyFromLabel")}:
                                                </Text>{" "}
                                                {movimiento.sucursalAnterior} • {movimiento.departamentoAnterior}
                                            </Text>

                                            <Text style={[styles.timelineLocation, { color: colors.text }]}>
                                                <Text style={styles.timelineLocationLabel}>
                                                    {t("historyToLabel")}:
                                                </Text>{" "}
                                                {movimiento.sucursalNueva} • {movimiento.departamentoNuevo}
                                            </Text>
                                        </>
                                    )}


                                    {/* Si únicamente cambió el responsable conservamos 
                                    la ubicación actual como referencia. */}
                                    {!cambioUbicacion && (
                                        <Text style={[styles.timelineLocation, { color: colors.textSecondary }]}>
                                            {movimiento.sucursalNueva} • {movimiento.departamentoNuevo}
                                        </Text>
                                    )}


                                    {/* Cambio de responsable registrado en el movimiento. */}
                                    {movimiento.empleadoAnterior !== undefined &&
                                        movimiento.empleadoNuevo !== undefined &&
                                        movimiento.empleadoAnterior !== movimiento.empleadoNuevo && (
                                            <Text style={[styles.timelineEmployeeChange, { color: colors.textSecondary }]}>
                                                {t("assignedLabel")}:{" "}
                                                {movimiento.empleadoAnterior || t("unassigned")}
                                                {"  →  "}
                                                <Text style={{ color: colors.text, fontWeight: "600" }}>
                                                    {movimiento.empleadoNuevo || t("unassigned")}
                                                </Text>
                                            </Text>
                                        )}
                                        

                                </View>

                            </View>
                        );
                    })//Fin de .Map
                )}
            </ScrollView>

        </SafeAreaView>
    );
};


const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
        paddingHorizontal: 20,
    },

    // Espacio inferior para permitir desplazamiento cómodo.
    container: {
        paddingBottom: 40,
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



    // Tarjeta compacta con la información principal del equipo.
    equipmentSummaryCard: {
        flexDirection: "row",
        alignItems: "center",
        borderWidth: 1,
        borderRadius: 14,
        padding: 10,
        marginBottom: 14,
    },

    // Fotografía pequeña mostrada dentro del resumen.
    summaryImage: {
        width: 64,
        height: 64,
        borderRadius: 10,
        resizeMode: "contain",
        marginRight: 12,
    },

    // Permite que la información utilice el espacio restante.
    summaryInfo: {
        flex: 1,
    },

    // Mantiene el código y el estado en una misma fila.
    summaryTopRow: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
    },

    summaryCode: {
        fontSize: 16,
        fontWeight: "800",
        flexShrink: 1,
    },

    summaryModel: {
        fontSize: 15,
        fontWeight: "700",
        marginTop: 5,
    },

    summarySerial: {
        fontSize: 13,
        marginTop: 4,
    },

    // Indicador compacto del estado actual.
    statusBadge: {
        paddingHorizontal: 10,
        paddingVertical: 5,
        borderRadius: 14,
        marginLeft: 8,
    },

    statusText: {
        fontSize: 12,
        fontWeight: "700",
    },

    // Contenedor horizontal de los filtros del historial.
    historyFilters: {
        flexDirection: "row",
        width: "100%",
        gap: 5,
        marginBottom: 14,
    },

    // Cada filtro utiliza el mismo espacio disponible.
    historyFilterButton: {
        flex: 1,
        minHeight: 40,
        alignItems: "center",
        justifyContent: "center",
        borderRadius: 20,
        paddingHorizontal: 6,
    },

    historyFilterText: {
        fontSize: 12,
        fontWeight: "600",
        textAlign: "center",
    },



    // Cada evento de la línea de tiempo.
    timelineItem: {
        flexDirection: "row",
        width: "100%",
    },

    // Columna izquierda que contiene el icono y la línea.
    timelineIndicator: {
        width: 46,
        alignItems: "center",
    },

    // Círculo principal de cada evento.
    timelineIcon: {
        width: 40,
        height: 40,
        borderRadius: 20,
        alignItems: "center",
        justifyContent: "center",
        zIndex: 2,
    },

    // Línea que conecta un evento con el siguiente.
    timelineLine: {
        width: 2,
        flex: 1,
        minHeight: 100,
    },

    // Información situada al lado derecho de la línea.
    timelineContent: {
        flex: 1,
        paddingLeft: 10,
        paddingBottom: 20,
    },

    timelineDate: {
        fontSize: 13,
        fontWeight: "600",
    },

    timelineTitle: {
        fontSize: 17,
        fontWeight: "700",
        marginTop: 2,
        marginBottom: 7,
    },


    // Encabezado similar al diseño de referencia.
    header: {
        flexDirection: "row",
        alignItems: "center",
        minHeight: 48,
        marginBottom: 10,
    },

    headerBackButton: {
        width: 36,
        height: 36,
        alignItems: "flex-start",
        justifyContent: "center",
    },

    headerTitle: {
        fontSize: 20,
        fontWeight: "700",
        marginLeft: 2,
    },

    // Ubicación mostrada de forma compacta dentro del evento.
    timelineLocation: {
        fontSize: 14,
        lineHeight: 21,
        marginTop: 2,
    },

    timelineLocationLabel: {
        fontWeight: "700",
    },

    // Resume el cambio de responsable en una sola línea.
    timelineEmployeeChange: {
        fontSize: 13,
        lineHeight: 20,
        marginTop: 7,
    },

    // Información adicional del evento, como motivo y usuario responsable.
    timelineExtraInfo: {
        fontSize: 13,
        lineHeight: 19,
        marginTop: 5,
    },
});


export default EquipmentHistoryScreen;