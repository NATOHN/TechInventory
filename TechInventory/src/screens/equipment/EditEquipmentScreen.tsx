
import { View, Text, Image, StyleSheet, TouchableOpacity, Modal, Alert, ScrollView } from "react-native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useState } from "react";
import type { ImageSourcePropType } from "react-native";
import * as ImagePicker from "expo-image-picker";

import type { EquipmentStackParamList } from "../../navigation/EquipmentNavigator";
import { useTheme } from "../../context/ThemeContext";
import { useLanguage } from "../../context/LanguageContext";
import CustomInput from "../../components/CustomInput";
// Permite consultar el equipo seleccionado directamente desde Redux.
import { useAppSelector, useAppDispatch } from "../../redux/hooks";
// Catálogo utilizado para mantener las marcas estandarizadas.
import { BRAND_OPTIONS } from "../../data/equipmentCatalogs";
// Acción utilizada para guardar los datos editables del equipo.
import { actualizarDatosEquipo } from "../../redux/equipmentSlice";



// 1. Indicamos que esta pantalla pertenece a la ruta EditEquipment.
type Props = NativeStackScreenProps<
    EquipmentStackParamList,
    "EditEquipment"
>;


const EditEquipmentScreen = ({ route, navigation }: Props) => {

    // 2. Recibimos únicamente el código del equipo seleccionado.
    const { codigo } = route.params;

    // 3. Obtenemos colores y traducciones de la aplicación.
    const { colors } = useTheme();
    const { t } = useLanguage();

    // Permite enviar la actualización del equipo hacia Redux.
    const dispatch = useAppDispatch();

    // 4. Buscamos en Redux el equipo que corresponde
    // al código recibido desde la pantalla de detalle.
    const equipo = useAppSelector(
        (state) => state.equipment.equipments.find(
            (equipo) => equipo.codigo === codigo
        )
    );


    //7. Copia editable de la marca actual del equipo.
    const [marca, setMarca] = useState(equipo?.marca ?? "");

    // Controla la apertura del selector de marcas.
    const [showBrandModal, setShowBrandModal] = useState(false);

    // 6. Creamos estados temporales con los datos actuales del equipo.
    // Estos valores podrán modificarse sin afectar Redux hasta presionar Guardar.
    const [modelo, setModelo] = useState(equipo?.modelo ?? "");
    const [serie, setSerie] = useState(equipo?.serie ?? "");
    // Guarda temporalmente la fotografía que se mostrará y podrá modificarse.
    const [foto, setFoto] = useState<ImageSourcePropType | null>(
        equipo?.foto ?? null
    );

    // Permite reemplazar la fotografía actual por una imagen de la galería.
    const seleccionarImagen = async () => {
        const resultado = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ["images"],
            allowsEditing: true,
            quality: 1,
        });

        // Si el usuario selecciona una imagen, reemplazamos
        // únicamente la fotografía temporal del formulario.
        if (!resultado.canceled) {
            setFoto({ uri: resultado.assets[0].uri });
        }
    };

    // Permite reemplazar la fotografía utilizando la cámara del dispositivo.
    const tomarFotografia = async () => {

        // Solicitamos permiso para utilizar la cámara.
        const permiso = await ImagePicker.requestCameraPermissionsAsync();

        if (!permiso.granted) {
            Alert.alert(
                t("cameraPermissionTitle"),
                t("cameraPermissionMessage")
            );
            return;
        }

        // Abrimos la cámara para capturar una nueva fotografía.
        const resultado = await ImagePicker.launchCameraAsync({
            mediaTypes: ["images"],
            allowsEditing: true,
            quality: 1,
        });

        // Si el usuario confirma la fotografía, reemplazamos
        // temporalmente la imagen actual.
        if (!resultado.canceled) {
            setFoto({ uri: resultado.assets[0].uri });
        }
    };


    // 5. Si por alguna razón Redux no encuentra el equipo,
    // mostramos un mensaje en lugar de intentar acceder a datos inexistentes.
    if (!equipo) {
        return (
            <SafeAreaView
                style={[
                    styles.safeArea,
                    { backgroundColor: colors.background }
                ]}
            >
                <Text style={{ color: colors.text }}>
                    Equipo no encontrado
                </Text>
            </SafeAreaView>
        );
    }


    // Valida y guarda únicamente los datos permitidos
    // dentro de la edición del equipo.
    const guardarCambios = () => {

        // Evitamos guardar información incompleta.
        if (!marca || !modelo.trim() || !serie.trim() || !foto) {
            Alert.alert(
                t("incompleteFieldsTitle"),
                t("incompleteFieldsMessage")
            );
            return;
        }

        // Enviamos a Redux únicamente los datos que pueden editarse.
        // Código, ubicación, empleado y estado permanecen sin cambios.
        dispatch(
            actualizarDatosEquipo({
                codigo: equipo.codigo,
                marca,
                modelo: modelo.trim(),
                serie: serie.trim(),
                foto,
            })
        );

        // Confirmamos que la actualización se realizó correctamente.
        Alert.alert(
            t("editEquipmentSuccessTitle"),
            t("editEquipmentSuccessMessage"),
            [
                {
                    text: "OK",
                    onPress: () => navigation.goBack(),
                },
            ]
        );
    };
    return (
        <SafeAreaView style={[styles.safeArea, { backgroundColor: colors.background }]}>

            <ScrollView
                showsVerticalScrollIndicator={false}
                contentContainerStyle={styles.formContainer}
            >


                {/* Permite regresar al detalle del equipo. */}
                <TouchableOpacity
                    style={styles.backButton}
                    onPress={() => navigation.goBack()}
                >
                    <Ionicons name="arrow-back" size={22} color={colors.primary} />

                    <Text style={[styles.backText, { color: colors.primary }]}>
                        {t("backButton")}
                    </Text>
                </TouchableOpacity>


                {/* Información actual del equipo que posteriormente podrá editarse. */}
                <View>
                    <Text style={[styles.title, { color: colors.text }]}>
                        {t("editEquipmentTitle")}
                    </Text>

                    {/* El código se muestra únicamente como referencia. 
                No será editable porque identifica permanentemente al equipo. */}
                    <Text style={[styles.code, { color: colors.primary }]}>
                        {equipo.codigo}
                    </Text>

                    {/* Vista previa de la fotografía actual o de la nueva seleccionada. */}
                    {foto && (
                        <Image
                            source={foto}
                            style={styles.equipmentImage}
                        />
                    )}

                    {/* Marca editable mediante valores definidos en el catálogo. */}
                    <Text style={[styles.fieldLabel, { color: colors.text }]}>
                        {t("brandPlaceholder")}
                    </Text>

                    {/* Permite tomar una nueva fotografía con la cámara. */}
                    <TouchableOpacity
                        style={[styles.photoButton, {
                            backgroundColor: colors.surface,
                            borderColor: colors.border
                        }]}
                        onPress={tomarFotografia}
                    >
                        <Ionicons name="camera-outline" size={20} color={colors.primary} />

                        <Text style={[styles.photoButtonText, { color: colors.text }]}>
                            {t("takePhotoButton")}
                        </Text>
                    </TouchableOpacity>


                    {/* Permite reemplazar la fotografía desde la galería. */}
                    <TouchableOpacity
                        style={[styles.photoButton, {
                            backgroundColor: colors.surface,
                            borderColor: colors.border
                        }]}
                        onPress={seleccionarImagen}
                    >
                        <Ionicons name="images-outline" size={20} color={colors.primary} />

                        <Text style={[styles.photoButtonText, { color: colors.text }]}>
                            {t("selectPhotoButton")}
                        </Text>
                    </TouchableOpacity>


                    <TouchableOpacity
                        style={[styles.selectField, {
                            backgroundColor: colors.surface,
                            borderColor: colors.border
                        }]}
                        onPress={() => setShowBrandModal(true)}
                    >
                        <Text style={{ color: colors.text }}>
                            {marca}
                        </Text>

                        <Ionicons
                            name="chevron-down"
                            size={20}
                            color={colors.textSecondary}
                        />
                    </TouchableOpacity>

                    {/* Modelo editable del equipo. */}
                    <Text style={[styles.fieldLabel, { color: colors.text }]}>
                        {t("modelPlaceholder")}
                    </Text>

                    <CustomInput
                        type="text"
                        placeholder={t("modelPlaceholder")}
                        value={modelo}
                        onChange={setModelo}
                    />

                    {/* Número de serie editable del equipo. */}
                    <Text style={[styles.fieldLabel, { color: colors.text }]}>
                        {t("serialPlaceholder")}
                    </Text>

                    <CustomInput
                        type="text"
                        placeholder={t("serialPlaceholder")}
                        value={serie}
                        onChange={setSerie}
                    />

                    {/* Guarda los cambios realizados sobre los datos del equipo. */}
                    <TouchableOpacity
                        style={[styles.saveButton, { backgroundColor: colors.primary }]}
                        onPress={guardarCambios}
                    >
                        <Ionicons
                            name="save-outline"
                            size={21}
                            color={colors.background}
                        />

                        <Text style={[styles.saveButtonText, { color: colors.background }]}>
                            {t("saveChangesButton")}
                        </Text>
                    </TouchableOpacity>

                </View>
            </ScrollView>

            {/* Modal para seleccionar una nueva marca del catálogo. */}
            <Modal
                visible={showBrandModal}
                transparent
                animationType="slide"
                onRequestClose={() => setShowBrandModal(false)}
            >
                <View style={styles.modalOverlay}>
                    <View style={[styles.selectionModal, {
                        backgroundColor: colors.cardBackground
                    }]}>

                        {/* Encabezado del selector de marcas. */}
                        <View style={styles.modalHeader}>
                            <Text style={[styles.modalTitle, { color: colors.text }]}>
                                {t("brandPlaceholder")}
                            </Text>

                            <TouchableOpacity onPress={() => setShowBrandModal(false)}>
                                <Ionicons
                                    name="close"
                                    size={26}
                                    color={colors.textSecondary}
                                />
                            </TouchableOpacity>
                        </View>

                        {/* Mostramos todas las marcas disponibles en el catálogo. */}
                        {BRAND_OPTIONS.map((brand) => (
                            <TouchableOpacity
                                key={brand.id}
                                style={[styles.selectionOption, {
                                    borderBottomColor: colors.border
                                }]}
                                onPress={() => {
                                    setMarca(brand.name);
                                    setShowBrandModal(false);
                                }}
                            >
                                <Text style={[styles.selectionOptionText, {
                                    color: colors.text
                                }]}>
                                    {brand.name}
                                </Text>

                                {/* Indicamos visualmente la marca seleccionada. */}
                                {marca === brand.name && (
                                    <Ionicons
                                        name="checkmark"
                                        size={22}
                                        color={colors.primary}
                                    />
                                )}
                            </TouchableOpacity>
                        ))}

                    </View>
                </View>
            </Modal>

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

    // Fotografía actual del equipo antes de comenzar la edición.
    equipmentImage: {
        width: "100%",
        height: 190,
        resizeMode: "contain",
        marginTop: 20,
        marginBottom: 20,
        borderRadius: 12,
    },

    // Información temporal utilizada para comprobar
    // que Redux está entregando los datos correctos.
    info: {
        fontSize: 16,
        marginBottom: 10,
    },

    // Nombre visible de cada dato editable.
    fieldLabel: {
        fontSize: 14,
        fontWeight: "600",
        marginBottom: 6,
        marginTop: 12,
    },

    // Valor temporal utilizado para mostrar la marca actual.
    currentValue: {
        fontSize: 15,
        paddingHorizontal: 14,
        paddingVertical: 14,
        borderWidth: 1,
        borderRadius: 10,
        marginBottom: 4,
    },

    // Campo utilizado para seleccionar valores desde un catálogo.
    selectField: {
        minHeight: 50,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        paddingHorizontal: 14,
        borderWidth: 1,
        borderRadius: 10,
        marginBottom: 4,
    },

    // Fondo detrás del selector.
    modalOverlay: {
        flex: 1,
        backgroundColor: "rgba(0,0,0,0.45)",
        justifyContent: "flex-end",
    },

    // Contenedor principal del selector.
    selectionModal: {
        padding: 20,
        paddingBottom: 30,
        borderTopLeftRadius: 24,
        borderTopRightRadius: 24,
    },

    modalHeader: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        marginBottom: 14,
    },

    modalTitle: {
        fontSize: 20,
        fontWeight: "700",
    },

    selectionOption: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        paddingVertical: 15,
        borderBottomWidth: 1,
    },

    selectionOptionText: {
        fontSize: 16,
        fontWeight: "500",
    },

    // Botones utilizados para cambiar la fotografía del equipo.
    photoButton: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        borderWidth: 1,
        borderRadius: 10,
        paddingVertical: 12,
        marginBottom: 10,
    },

    photoButtonText: {
        fontSize: 15,
        fontWeight: "600",
        marginLeft: 8,
    },

    // Contenido desplazable del formulario de edición.
    // El espacio inferior evita que los últimos controles
    // queden ocultos detrás de la navegación inferior.
    formContainer: {
        paddingBottom: 130,
    },

    // Botón principal utilizado para guardar la edición.
    saveButton: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        paddingVertical: 13,
        borderRadius: 12,
        marginTop: 18,
    },

    saveButtonText: {
        fontSize: 16,
        fontWeight: "700",
        marginLeft: 8,
    },
});


export default EditEquipmentScreen;