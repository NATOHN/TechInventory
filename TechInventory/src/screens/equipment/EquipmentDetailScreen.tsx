
import { View, Text, Image, StyleSheet, ScrollView, TouchableOpacity, Modal, Alert } from "react-native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useState } from "react";
// Permite generar el código QR del equipo
import QRCode from "react-native-qrcode-svg";

import type { EquipmentStackParamList } from "../../navigation/EquipmentNavigator";
import StatusBadge from "../../components/StatusBadge";
import { useTheme } from "../../context/ThemeContext";
import { useLanguage } from "../../context/LanguageContext";
import { useAppDispatch, useAppSelector } from "../../redux/hooks";
import { cambiarUbicacionEquipo } from "../../redux/equipmentSlice";

type Props = NativeStackScreenProps<
    EquipmentStackParamList,
    "EquipmentDetail"
>;


const EquipmentDetailScreen = ({ route, navigation }: Props) => {

    //Obtenemos el código enviado desde la pantalla de equipos.
    const { codigo } = route.params;

    // Buscamos en Redux el equipo que corresponde al código recibido.
    const equipoRedux = useAppSelector(
        (state) => state.equipment.equipments.find((equipo) => equipo.codigo === codigo)
    );

    // Obtenemos todos los equipos para conocer las sucursales existentes en el inventario.
    const equipos = useAppSelector((state) => state.equipment.equipments);

    // Si Redux todavía no encuentra el equipo, usamos temporalmente
    // los datos recibidos mediante la navegación.
    const equipo = equipoRedux ?? route.params;

    // Extraemos los datos que necesita la interfaz.
    const { marca, modelo, serie, sucursal, departamento, empleadoAsignado, status, foto } = equipo;

    //Obtenemos la paleta de colores actual desde ThemeContext.
    const { colors } = useTheme();

    //Obtenemos la función t desde LanguageContext
    const { t } = useLanguage();

    // Permite enviar acciones al Store de Redux.
    const dispatch = useAppDispatch();

    // Controla si el modal para cambiar la ubicación está abierto o cerrado.
    const [showLocationModal, setShowLocationModal] = useState(false);

    // Guarda temporalmente la nueva sucursal seleccionada por el usuario.
    const [selectedNewBranch, setSelectedNewBranch] = useState(sucursal);

    // Guarda temporalmente el nuevo departamento seleccionado por el usuario.
    const [selectedNewDepartment, setSelectedNewDepartment] = useState(departamento);

    // Creamos una lista de sucursales sin valores repetidos.
    const sucursalesDisponibles = [...new Set(equipos.map((equipo) => equipo.sucursal))];

    // Obtenemos solamente los departamentos que existen
    // dentro de la sucursal seleccionada.
    const departamentosDisponibles = [...new Set(
        equipos
            .filter((equipo) => equipo.sucursal === selectedNewBranch)
            .map((equipo) => equipo.departamento)
    )];


    return (
        //ScrollView
        <SafeAreaView style={[styles.safeArea, { backgroundColor: colors.background }]}>
            <ScrollView style={{ backgroundColor: colors.background }} contentContainerStyle={styles.container}>
                <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
                    <Ionicons name="arrow-back" size={22} color={colors.primary} />
                    <Text style={[styles.backText, { color: colors.primary }]}>{t("backButton")}</Text>
                </TouchableOpacity>
                <Text style={[styles.screenTitle, { color: colors.primary }]}>{t("equipmentDetailTitle")}</Text>

                {/* Tarjeta principal con la identificación rápida del equipo. */}
                <View style={[styles.summaryCard, { backgroundColor: colors.cardBackground, borderColor: colors.cardBorder }]}>
                    {/* Fotografía utilizada como referencia visual del equipo. */}
                    <Image source={foto} style={styles.summaryImage} />

                    {/* Información principal del activo. */}
                    <View style={styles.summaryContent}>
                        <View style={styles.summaryHeader}>
                            <Text style={[styles.codigo, { color: colors.primary }]}>{codigo}</Text>
                            <StatusBadge status={status} />
                        </View>
                        {/* Marca y modelo funcionan como nombre principal del equipo. */}
                        <Text style={[styles.equipmentName, { color: colors.text }]}>{`${marca} ${modelo}`}</Text>

                        {/* Mostramos la serie como dato secundario de identificación. */}
                        <Text style={[styles.summaryInfo, { color: colors.textSecondary }]}>{`${t("seriesLabel")}: ${serie}`}</Text>
                    </View>
                </View>

                {/*Información adicional del equipo*/}
                <View style={styles.detailsSection}>
                    <Text style={[styles.sectionTitle, { color: colors.text }]}>{t("equipmentInformationTitle")}</Text>

                    {/* Información de la sucursal donde se encuentra el equipo. */}
                    <View style={[styles.infoRow, { borderBottomColor: colors.border }]}>
                        <View style={[styles.infoIcon, { backgroundColor: colors.surface }]}>
                            <Ionicons name="location-outline" size={20} color={colors.primary} />
                        </View>
                        <View style={styles.infoContent}>
                            <Text style={[styles.infoLabel, { color: colors.textSecondary }]}>{t("branchLabel")}</Text>
                            <Text style={[styles.infoValue, { color: colors.text }]}>{sucursal}</Text>
                        </View>
                    </View>

                    {/* Información del departamento al que pertenece el equipo. */}
                    <View style={[styles.infoRow, { borderBottomColor: colors.border }]}>
                        <View style={[styles.infoIcon, { backgroundColor: colors.surface }]}>
                            <Ionicons name="business-outline" size={20} color={colors.primary} />
                        </View>
                        <View style={styles.infoContent}>
                            <Text style={[styles.infoLabel, { color: colors.textSecondary }]}>{t("departmentLabel")}</Text>
                            <Text style={[styles.infoValue, { color: colors.text }]}>{departamento}</Text>
                        </View>
                    </View>

                    {/* Información del empleado responsable del equipo. */}
                    <View style={[styles.infoRow, { borderBottomColor: colors.border }]}>
                        <View style={[styles.infoIcon, { backgroundColor: colors.surface }]}>
                            <Ionicons name="person-outline" size={20} color={colors.primary} />
                        </View>
                        <View style={styles.infoContent}>
                            <Text style={[styles.infoLabel, { color: colors.textSecondary }]}>{t("assignedLabel")}</Text>
                            <Text style={[styles.infoValue, { color: colors.text }]}>
                                {!empleadoAsignado || empleadoAsignado === "Sin asignar" ? t("unassigned") : empleadoAsignado}
                            </Text>
                        </View>
                    </View>
                </View>

                {/* Sección con las acciones principales que pueden realizarse sobre el equipo. */}
                <View style={styles.actionsSection}>
                    <Text style={[styles.sectionTitle, { color: colors.text }]}>{t("quickActionsTitle")}</Text>

                    {/* Primera fila de acciones. */}
                    <View style={styles.actionsRow}>
                        <TouchableOpacity
                            style={[styles.actionButton, { backgroundColor: colors.cardBackground, borderColor: colors.cardBorder }]}
                            onPress={() => console.log("Abrir mantenimiento")}
                        >
                            <Ionicons name="construct-outline" size={24} color={colors.primary} />
                            <Text style={[styles.actionText, { color: colors.text }]}>{t("maintenanceAction")}</Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                            style={[styles.actionButton, { backgroundColor: colors.cardBackground, borderColor: colors.cardBorder }]}
                            onPress={() => console.log("Abrir historial")}
                        >
                            <Ionicons name="time-outline" size={24} color={colors.primary} />
                            <Text style={[styles.actionText, { color: colors.text }]}>{t("historyAction")}</Text>
                        </TouchableOpacity>
                    </View>

                    {/* Segunda fila de acciones. */}
                    <View style={styles.actionsRow}>
                        <TouchableOpacity
                            style={[styles.actionButton, { backgroundColor: colors.cardBackground, borderColor: colors.cardBorder }]}
                            // Abre el modal para cambiar la ubicación del equipo.
                            onPress={() => {
                                setSelectedNewBranch(sucursal);
                                setSelectedNewDepartment(departamento);
                                setShowLocationModal(true);
                            }}
                        >
                            <Ionicons name="location-outline" size={24} color={colors.primary} />
                            <Text style={[styles.actionText, { color: colors.text }]}>{t("changeLocationAction")}</Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                            style={[styles.actionButton, { backgroundColor: colors.cardBackground, borderColor: colors.cardBorder }]}
                            onPress={() => console.log("Mostrar QR")}
                        >
                            <Ionicons name="qr-code-outline" size={24} color={colors.primary} />
                            <Text style={[styles.actionText, { color: colors.text }]}>{t("qrAction")}</Text>
                        </TouchableOpacity>
                    </View>
                </View>

                {/* Código QR generado utilizando el código único del equipo */}
                <View style={styles.qrContainer}>
                    <Text style={[styles.qrTitle, { color: colors.text }]}>{t("qrCodeTitle")}</Text>
                    {/* El QR guarda únicamente el código del equipo */}
                    <View style={styles.qrBox}>
                        <QRCode value={equipo.codigo} size={160} />
                    </View>
                    {/* Mostramos también el código para identificarlo visualmente */}
                    <Text style={[styles.qrCode, { color: colors.textSecondary }]}>{equipo.codigo}</Text>
                </View>
            </ScrollView>

            {/* Modal para consultar y cambiar la ubicación del equipo. */}
            <Modal visible={showLocationModal} transparent animationType="slide" onRequestClose={() => setShowLocationModal(false)}>
                <View style={styles.modalOverlay}>
                    <View style={[styles.locationModal, { backgroundColor: colors.cardBackground }]}>

                        {/* Encabezado del modal. */}
                        <View style={styles.modalHeader}>
                            <Text style={[styles.modalTitle, { color: colors.text }]}>{t("changeLocationAction")}</Text>

                            <TouchableOpacity onPress={() => setShowLocationModal(false)}>
                                <Ionicons name="close" size={26} color={colors.textSecondary} />
                            </TouchableOpacity>
                        </View>

                        {/* Mostramos la ubicación que tiene actualmente el equipo. */}
                        <Text style={[styles.modalLabel, { color: colors.textSecondary }]}>{t("currentLocationLabel")}</Text>
                        <Text style={[styles.currentLocation, { color: colors.text }]}>{`${sucursal} • ${departamento}`}</Text>

                        {/* Permitimos seleccionar la nueva sucursal utilizando las ubicaciones existentes en Redux. */}
                        <Text style={[styles.locationSectionTitle, { color: colors.text }]}>{t("newBranchLabel")}</Text>

                        <View style={styles.locationOptions}>
                            {/* Creamos una opción por cada sucursal disponible. */}
                            {sucursalesDisponibles.map((branch) => (
                                <TouchableOpacity
                                    key={branch}
                                    style={[styles.locationOption, {
                                        backgroundColor: selectedNewBranch === branch ? colors.primary : colors.surface,
                                        borderColor: selectedNewBranch === branch ? colors.primary : colors.border
                                    }]}
                                    //Al cambiar de sucursal reiniciamos el departamento para evitar conservar 
                                    // uno que no pertenezca a la nueva sucursal. 
                                    onPress={() => { setSelectedNewBranch(branch); setSelectedNewDepartment(""); }}
                                >
                                    <Text style={{ color: selectedNewBranch === branch ? colors.background : colors.textSecondary }}>
                                        {branch}
                                    </Text>
                                </TouchableOpacity>
                            ))}
                        </View>

                        {/* Permitimos seleccionar un departamento perteneciente a la nueva sucursal seleccionada. */}
                        <Text style={[styles.locationSectionTitle, { color: colors.text }]}>{t("newDepartmentLabel")}</Text>

                        <View style={styles.locationOptions}>
                            {/* Creamos una opción por cada departamento disponible. */}
                            {departamentosDisponibles.map((department) => (
                                <TouchableOpacity
                                    key={department}
                                    style={[styles.locationOption, {
                                        backgroundColor: selectedNewDepartment === department ? colors.primary : colors.surface,
                                        borderColor: selectedNewDepartment === department ? colors.primary : colors.border
                                    }]}
                                    onPress={() => setSelectedNewDepartment(department)}
                                >
                                    <Text style={{ color: selectedNewDepartment === department ? colors.background : colors.textSecondary }}>
                                        {department}
                                    </Text>
                                </TouchableOpacity>
                            ))}
                        </View>


                        {/* Guarda la nueva sucursal y departamento seleccionados. */}
                        <TouchableOpacity
                            style={[styles.saveLocationButton, { backgroundColor: colors.primary }]}
                            onPress={() => {
                                // Evitamos guardar una ubicación sin departamento.
                                if (!selectedNewDepartment) {
                                    Alert.alert(t("incompleteFieldsTitle"), t("selectDepartmentMessage"));
                                    return;
                                }

                                // Enviamos a Redux únicamente el código y la nueva ubicación.
                                dispatch(cambiarUbicacionEquipo({
                                    codigo,
                                    sucursal: selectedNewBranch,
                                    departamento: selectedNewDepartment
                                }));

                                // Cerramos el modal y confirmamos el cambio.
                                setShowLocationModal(false);
                                Alert.alert(t("locationUpdatedTitle"), t("locationUpdatedMessage"));
                            }}
                        >
                            <Ionicons name="checkmark-circle-outline" size={20} color={colors.background} />
                            <Text style={[styles.saveLocationText, { color: colors.background }]}>{t("saveLocationButton")}</Text>
                        </TouchableOpacity>

                    </View>
                </View>
            </Modal>
        </SafeAreaView>
    );
};


const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: '#fff',
    },

    container: {
        paddingHorizontal: 20,
        paddingTop: 20,
        paddingBottom: 30,
    },

    screenTitle: {
        fontSize: 26,
        fontWeight: 'bold',
        color: '#1E3A8A',
        marginBottom: 16,
    },

    info: {
        fontSize: 15,
        color: '#555',
        marginBottom: 8,
    },

    qrPlaceholder: {
        marginTop: 24,
        height: 180,
        borderWidth: 2,
        borderStyle: 'dashed',
        borderColor: '#aaa',
        borderRadius: 12,
        alignItems: 'center',
        justifyContent: 'center',
    },

    qrText: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#1E3A8A',
    },

    qrSubtext: {
        marginTop: 8,
        color: '#777',
    },

    backButton: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 16,
    },

    backText: {
        marginLeft: 6,
        fontSize: 16,
        fontWeight: '600',
        color: '#1E3A8A',
    },

    // Tarjeta que resume los datos principales del equipo.
    summaryCard: {
        flexDirection: 'row',
        alignItems: 'center',
        width: '100%',
        padding: 14,
        borderRadius: 14,
        borderWidth: 1,
        marginBottom: 20,
        elevation: 1,
    },

    // Imagen compacta para identificar visualmente el equipo.
    summaryImage: {
        width: 90,
        height: 90,
        borderRadius: 12,
        resizeMode: 'contain',
        marginRight: 14,
    },

    // Ocupa el espacio restante de la tarjeta.
    summaryContent: {
        flex: 1,
    },

    // Mantiene código y estado en una misma línea.
    summaryHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: 6,
    },

    // Código interno como identificador principal.
    codigo: {
        fontSize: 15,
        fontWeight: '700',
    },

    // Marca y modelo del equipo.
    equipmentName: {
        fontSize: 18,
        fontWeight: '700',
        marginBottom: 5,
    },

    // Información secundaria dentro de la tarjeta.
    summaryInfo: {
        fontSize: 13,
    },

    // Agrupa la información secundaria del equipo.
    detailsSection: {
        marginBottom: 24,
    },


    // Título de cada sección dentro del detalle.
    sectionTitle: {
        fontSize: 17,
        fontWeight: '700',
        marginBottom: 8,
    },

    // Fila utilizada para mostrar cada dato del equipo.
    infoRow: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 12,
        borderBottomWidth: 1,
    },

    // Contenedor visual del icono de cada dato.
    infoIcon: {
        width: 40,
        height: 40,
        borderRadius: 10,
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 12,
    },

    // Permite que los textos utilicen el espacio restante.
    infoContent: {
        flex: 1,
    },

    // Nombre del dato, por ejemplo Sucursal o Departamento.
    infoLabel: {
        fontSize: 12,
        marginBottom: 2,
    },

    // Valor real almacenado en el equipo.
    infoValue: {
        fontSize: 15,
        fontWeight: '600',
    },

    // Contenedor general de las acciones disponibles para el equipo.
    actionsSection: {
        marginBottom: 24,
    },

    // Mantiene dos acciones distribuidas en una misma fila.
    actionsRow: {
        flexDirection: 'row',
        marginBottom: 10,
    },

    // Tarjeta pequeña utilizada como botón de acción.
    actionButton: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 14,
        paddingHorizontal: 12,
        borderWidth: 1,
        borderRadius: 12,
        marginHorizontal: 4,
    },

    // Texto mostrado junto al icono de cada acción.
    actionText: {
        flex: 1,
        fontSize: 13,
        fontWeight: '600',
        marginLeft: 8,
    },

    // Fondo oscuro detrás del modal.
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.45)',
        justifyContent: 'flex-end',
    },

    // Contenedor principal del modal de ubicación.
    locationModal: {
        padding: 20,
        paddingBottom: 30,
        borderTopLeftRadius: 24,
        borderTopRightRadius: 24,
        minHeight: 260,
    },

    // Encabezado con título y botón para cerrar.
    modalHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: 20,
    },

    // Título principal del modal.
    modalTitle: {
        fontSize: 20,
        fontWeight: '700',
    },

    // Etiqueta secundaria utilizada dentro del modal.
    modalLabel: {
        fontSize: 13,
        marginBottom: 4,
    },

    // Ubicación actual del equipo.
    currentLocation: {
        fontSize: 16,
        fontWeight: '600',
    },

    // Título utilizado antes de seleccionar la nueva ubicación.
    locationSectionTitle: {
        fontSize: 15,
        fontWeight: '700',
        marginTop: 22,
        marginBottom: 10,
    },

    // Contenedor de las opciones de ubicación.
    locationOptions: {
        flexDirection: 'row',
        flexWrap: 'wrap',
    },

    // Opción individual para seleccionar una sucursal.
    locationOption: {
        paddingHorizontal: 14,
        paddingVertical: 9,
        borderRadius: 20,
        borderWidth: 1,
        marginRight: 8,
        marginBottom: 8,
    },

    // Botón principal utilizado para confirmar el cambio de ubicación.
    saveLocationButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 13,
        borderRadius: 12,
        marginTop: 20,
    },

    // Texto del botón para guardar la nueva ubicación.
    saveLocationText: {
        fontSize: 15,
        fontWeight: '700',
        marginLeft: 7,
    },

    // Contenedor principal del código QR
    qrContainer: {
        alignItems: "center",
        marginTop: 20,
        gap: 12,
    },

    // Título de la sección
    qrTitle: {
        fontSize: 18,
        fontWeight: "600",
    },

    // Fondo blanco para facilitar la lectura del QR
    qrBox: {
        backgroundColor: "#FFFFFF",
        padding: 16,
        borderRadius: 12,
    },

    // Código del equipo mostrado debajo del QR
    qrCode: {
        fontSize: 14,
        fontWeight: "500",
    },
});

export default EquipmentDetailScreen;
