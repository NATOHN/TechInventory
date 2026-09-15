import { Text, ScrollView, Image, StyleSheet, Alert, TouchableOpacity, Modal, View } from "react-native";
import { useState } from "react";
import * as ImagePicker from 'expo-image-picker';
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { Ionicons } from "@expo/vector-icons";

import CustomInput from "../../components/CustomInput";
import CustomButton from "../../components/CustomButton";
import { SafeAreaView } from "react-native-safe-area-context";
import type { EquipmentStackParamList } from "../../navigation/EquipmentNavigator";
import { useTheme } from "../../context/ThemeContext";
import { useLanguage } from "../../context/LanguageContext";
import { useAppDispatch, useAppSelector } from "../../redux/hooks";
import { agregarEquipo, Equipment } from "../../redux/equipmentSlice";
// Catálogo independiente de marcas disponibles.
import { BRAND_OPTIONS, BRANCH_OPTIONS, EMPLOYEE_OPTIONS } from "../../data/equipmentCatalogs";


//Creacion de Props
type Props = NativeStackScreenProps<
    EquipmentStackParamList,
    "RegisterEquipment"
>;

const RegisterEquipmentScreen = ({ navigation }: Props) => {
    //Obtenemos la paleta de colores actual desde ThemeContext.
    const { colors } = useTheme();

    const { t } = useLanguage();

    // 3. Obtenemos la función dispatch. dispatch será la encargada de enviar acciones
    // desde esta pantalla hacia Redux.
    const dispatch = useAppDispatch();

    //Obtenemos los equipos que actualmente están almacenados dentro de Redux.
    const equipos = useAppSelector((state) => state.equipment.equipments);


    //1. Creamos los estados
    const [marca, setMarca] = useState("");
    const [modelo, setModelo] = useState("");
    const [serie, setSerie] = useState("");
    const [sucursal, setSucursal] = useState("");
    const [departamento, setDepartamento] = useState("");
    const [empleadoAsignado, setEmpleadoAsignado] = useState("");
    const [foto, setFoto] = useState<string | null>(null);
    // Controla la apertura del selector de marcas.
    const [showBrandModal, setShowBrandModal] = useState(false);

    // Controla la apertura del selector de sucursales.
    const [showBranchModal, setShowBranchModal] = useState(false);

    // Controla la apertura del selector de departamentos.
    const [showDepartmentModal, setShowDepartmentModal] = useState(false);

    // Controla la apertura del selector de empleados.
    const [showEmployeeModal, setShowEmployeeModal] = useState(false);


    // Buscamos en el catálogo la sucursal seleccionada actualmente.
    const selectedBranchOption = BRANCH_OPTIONS.find((branch) => branch.name === sucursal);

    // Obtenemos únicamente los departamentos pertenecientes
    // a la sucursal seleccionada.
    const departamentosDisponibles = selectedBranchOption?.departments ?? [];

    // Buscamos el departamento seleccionado dentro de la sucursal actual.
    const selectedDepartmentOption = selectedBranchOption?.departments.find(
        (department) => department.name === departamento
    );

    // Filtramos únicamente los empleados que pertenecen
    // a la sucursal y departamento seleccionados.
    const empleadosDisponibles = EMPLOYEE_OPTIONS.filter(
        (employee) =>
            employee.branchId === selectedBranchOption?.id &&
            employee.departmentId === selectedDepartmentOption?.id
    );

    //Creamos una función para generar automáticamente el código correspondiente al próximo equipo.
    const generarCodigoEquipo = () => {

        //Tomamos la cantidad de equipos existentes y sumamos uno para obtener el siguiente número.
        const siguienteNumero = equipos.length + 1;

        // Convertimos el número a texto y agregamos ceros a la izquierda hasta completar 4 dígitos.
        const numeroFormateado = String(siguienteNumero).padStart(4, '0');

        //Construimos el código final del equipo.
        return `EQ-${numeroFormateado}`;
    };

    //Creamos una función para limpiar todos los campos después de registrar correctamente un equipo.
    const limpiarFormulario = () => {

        // 10. Regresamos cada estado a su valor inicial.
        setMarca("");
        setModelo("");
        setSerie("");
        setSucursal("");
        setDepartamento("");
        setEmpleadoAsignado("");
        setFoto(null);
    };

    //3. Creamos la funcion y la hacemos async porque abrir la galeria y esperar 
    //que el usuario seleccione la imagen eso demora
    const seleccionarImagen = async () => {
        //launchImageLibraryAsync() abre la interfaz la interfaz del sistema para seleccionar una imagen
        const resultado = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ['images'],
            allowsEditing: true,
            quality: 1,
        });
        //4. Validamos si el usuario abrio la galeria y selecciono una imagen o si abrio y cerro su galeria
        // si el usuario cancela canceled = true
        // si el usuario selecciona una imagen canceled = false
        if (!resultado.canceled) {
            setFoto(resultado.assets[0].uri);
        }
    };

    // Abre la cámara del dispositivo para tomar una fotografía del equipo.
    const tomarFotografia = async () => {

        // Solicitamos permiso para utilizar la cámara.
        const permiso = await ImagePicker.requestCameraPermissionsAsync();

        // Si el usuario no concede el permiso, detenemos el proceso.
        if (!permiso.granted) {
            Alert.alert(
                t("cameraPermissionTitle"),
                t("cameraPermissionMessage")
            );
            return;
        }

        // Abrimos la cámara.
        const resultado = await ImagePicker.launchCameraAsync({
            mediaTypes: ['images'],
            allowsEditing: true,
            quality: 1,
        });

        // Guardamos la URI de la fotografía tomada.
        if (!resultado.canceled) {
            setFoto(resultado.assets[0].uri);
        }
    };

    //Funcion para validar y guardar equipo
    const guardarEquipo = () => {
        //Validamos que marca, modelo, serie no estaen vacios
        // Si uno de ellos esta vacio el registro se detiene
        if (!marca || !modelo || !serie || !sucursal || !departamento || !foto) {
            //Si falta información mostramos una alerta
            Alert.alert(
                t("incompleteFieldsTitle"),
                t("incompleteFieldsMessage")
            );
            //este return hace que la funcion termine aqui
            return;
        }

        // 9. Construimos el objeto que representa el nuevo equipo.
        // Indicamos que debe cumplir exactamente con la estructura Equipment.
        const nuevoEquipo: Equipment = {

            // Generamos automáticamente el código del equipo.
            codigo: generarCodigoEquipo(),

            // Guardamos los datos ingresados por el usuario.
            marca: marca,
            modelo: modelo,
            serie: serie,
            sucursal: sucursal,
            departamento: departamento,

            // El empleado asignado es opcional.
            // Si el usuario no escribe ninguno, guardamos "Sin asignar".
            empleadoAsignado:
                empleadoAsignado.trim() || "Sin asignar",

            // Todo equipo recién registrado comienza
            // inicialmente con estado activo.
            status: "activo",

            // ImagePicker guarda la fotografía como una URI.
            // La convertimos al formato que utiliza Image de React Native.
            foto: { uri: foto },
        };


        // Mostramos temporalmente el nuevo equipo en consola
        // para comprobar que se está construyendo correctamente.
        console.log("Nuevo equipo preparado:", nuevoEquipo);

        // 16. Enviamos el nuevo equipo al Store de Redux, agregarEquipo es la acción creada dentro de equipmentSlice.
        dispatch(
            agregarEquipo(nuevoEquipo)
        );

        //Si falta información mostramos una alerta
        Alert.alert(
            t("validDataTitle"),
            t("validDataMessage"),
            [
                {
                    text: "OK",
                    onPress: () => {
                        limpiarFormulario();
                        navigation.goBack();
                    },
                },
            ]
        );
    };

    //2. Hacemos uso de nustro componente reutilizable CustomInput
    return (
        <SafeAreaView style={[styles.safeArea, { backgroundColor: colors.background }]}>
            <ScrollView 
                style={{ backgroundColor: colors.background }} 
                contentContainerStyle={styles.container} 
                showsVerticalScrollIndicator={false}
            >
                <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
                    <Ionicons name="arrow-back" size={22} color={colors.primary} />
                    <Text style={[styles.backText, { color: colors.primary }]}>{t("backButton")}</Text>
                </TouchableOpacity>
                <Text style={[styles.title, { color: colors.primary }]}>{t("registerEquipmentTitle")}</Text>

                {/* Selector de marca para evitar valores escritos de diferentes formas. */}
                <TouchableOpacity
                    style={[styles.selectField, { backgroundColor: colors.surface, borderColor: colors.border }]}
                    onPress={() => setShowBrandModal(true)}
                >
                    <Text style={{ color: marca ? colors.text : colors.textSecondary }}>
                        {marca || t("brandPlaceholder")}
                    </Text>
                    <Ionicons name="chevron-down" size={20} color={colors.textSecondary} />
                </TouchableOpacity>

                <CustomInput
                    type="text"
                    placeholder={t("modelPlaceholder")}
                    value={modelo}
                    onChange={setModelo}
                />
                <CustomInput
                    type="text"
                    placeholder={t("serialPlaceholder")}
                    value={serie}
                    onChange={setSerie}
                />

                {/* Selector de sucursal utilizando el catálogo independiente. */}
                <TouchableOpacity
                    style={[styles.selectField, { backgroundColor: colors.surface, borderColor: colors.border }]}
                    onPress={() => setShowBranchModal(true)}
                >
                    <Text style={{ color: sucursal ? colors.text : colors.textSecondary }}>
                        {sucursal || t("branchPlaceholder")}
                    </Text>

                    <Ionicons name="chevron-down" size={20} color={colors.textSecondary} />
                </TouchableOpacity>


                {/* Selector de departamento dependiente de la sucursal seleccionada. */}
                <TouchableOpacity
                    style={[styles.selectField, { backgroundColor: colors.surface, borderColor: colors.border, opacity: sucursal ? 1 : 0.6 }]}
                    // Solo permitimos seleccionar departamento si primero existe una sucursal.
                    onPress={() => {
                        if (!sucursal) {
                            Alert.alert(
                                t("incompleteFieldsTitle"),
                                "Seleccione primero una sucursal."
                            );
                            return;
                        }

                        setShowDepartmentModal(true);
                    }}
                >
                    <Text style={{ color: departamento ? colors.text : colors.textSecondary }}>
                        {departamento || t("departmentPlaceholder")}
                    </Text>

                    <Ionicons name="chevron-down" size={20} color={colors.textSecondary} />
                </TouchableOpacity>

                {/* Selector de empleado dependiente de la sucursal y departamento. */}
                <TouchableOpacity
                    style={[styles.selectField, {
                        backgroundColor: colors.surface,
                        borderColor: colors.border,
                        opacity: sucursal && departamento ? 1 : 0.6
                    }]}
                    // El selector solamente se habilita cuando existe
                    // una sucursal y departamento seleccionados.
                    disabled={!sucursal || !departamento}
                    onPress={() => setShowEmployeeModal(true)}
                >
                    <Text style={{
                        color: empleadoAsignado ? colors.text : colors.textSecondary
                    }}>
                        {empleadoAsignado || t("assignedEmployeePlaceholder")}
                    </Text>

                    <Ionicons
                        name="chevron-down"
                        size={20}
                        color={colors.textSecondary}
                    />
                </TouchableOpacity>

                {/* Permite tomar una fotografía directamente con la cámara. */}
                <CustomButton
                    title={t("takePhotoButton")}
                    onPress={tomarFotografia}
                    variant="secondary"
                />

                <CustomButton
                    title={t("selectPhotoButton")}
                    onPress={seleccionarImagen}
                    variant="secondary"
                />
                {foto && (<Image source={{ uri: foto }} style={styles.previewImage} />)}
                <CustomButton
                    title={t("saveEquipmentButton")}
                    onPress={guardarEquipo}
                />
            </ScrollView>

            {/* Modal para seleccionar una marca disponible en el catálogo. */}
            <Modal
                visible={showBrandModal}
                transparent
                animationType="slide"
                onRequestClose={() => setShowBrandModal(false)}
            >
                <View style={styles.modalOverlay}>
                    <View style={[styles.selectionModal, { backgroundColor: colors.cardBackground }]}>

                        {/* Encabezado del selector de marcas. */}
                        <View style={styles.modalHeader}>
                            <Text style={[styles.modalTitle, { color: colors.text }]}>
                                {t("brandPlaceholder")}
                            </Text>

                            <TouchableOpacity onPress={() => setShowBrandModal(false)}>
                                <Ionicons name="close" size={26} color={colors.textSecondary} />
                            </TouchableOpacity>
                        </View>

                        {/* Creamos una opción por cada marca registrada en el catálogo. */}
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
                                <Text style={[styles.selectionOptionText, { color: colors.text }]}>
                                    {brand.name}
                                </Text>

                                {/* Mostramos una marca visual sobre la opción seleccionada. */}
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

            {/* Modal para seleccionar una sucursal disponible en el catálogo. */}
            <Modal
                visible={showBranchModal}
                transparent
                animationType="slide"
                onRequestClose={() => setShowBranchModal(false)}
            >
                <View style={styles.modalOverlay}>
                    <View style={[styles.selectionModal, { backgroundColor: colors.cardBackground }]}>

                        {/* Encabezado del selector de sucursales. */}
                        <View style={styles.modalHeader}>
                            <Text style={[styles.modalTitle, { color: colors.text }]}>
                                {t("branchPlaceholder")}
                            </Text>

                            <TouchableOpacity onPress={() => setShowBranchModal(false)}>
                                <Ionicons name="close" size={26} color={colors.textSecondary} />
                            </TouchableOpacity>
                        </View>

                        {/* Creamos una opción por cada sucursal registrada. */}
                        {BRANCH_OPTIONS.map((branch) => (
                            <TouchableOpacity
                                key={branch.id}
                                style={[styles.selectionOption, {
                                    borderBottomColor: colors.border
                                }]}
                                onPress={() => {
                                    setSucursal(branch.name);

                                    // Reiniciamos departamento para evitar conservar uno
                                    // que pertenezca a una sucursal diferente.
                                    setDepartamento("");
                                    setEmpleadoAsignado("");
                                    setShowBranchModal(false);

                                }}
                            >
                                <Text style={[styles.selectionOptionText, { color: colors.text }]}>
                                    {branch.name}
                                </Text>

                                {/* Mostramos cuál sucursal está seleccionada actualmente. */}
                                {sucursal === branch.name && (
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

            {/* Modal para seleccionar un departamento de la sucursal elegida. */}
            <Modal
                visible={showDepartmentModal}
                transparent
                animationType="slide"
                onRequestClose={() => setShowDepartmentModal(false)}
            >
                <View style={styles.modalOverlay}>
                    <View style={[styles.selectionModal, { backgroundColor: colors.cardBackground }]}>

                        {/* Encabezado del selector de departamentos. */}
                        <View style={styles.modalHeader}>
                            <Text style={[styles.modalTitle, { color: colors.text }]}>
                                {t("departmentPlaceholder")}
                            </Text>

                            <TouchableOpacity onPress={() => setShowDepartmentModal(false)}>
                                <Ionicons name="close" size={26} color={colors.textSecondary} />
                            </TouchableOpacity>
                        </View>

                        {/* Mostramos únicamente los departamentos de la sucursal seleccionada. */}
                        {departamentosDisponibles.map((department) => (
                            <TouchableOpacity
                                key={department.id}
                                style={[styles.selectionOption, {
                                    borderBottomColor: colors.border
                                }]}
                                onPress={() => {
                                    setDepartamento(department.name);
                                    // Evitamos conservar un empleado perteneciente
                                    // a otro departamento.
                                    setEmpleadoAsignado("");
                                    setShowDepartmentModal(false);
                                }}
                            >
                                <Text style={[styles.selectionOptionText, { color: colors.text }]}>
                                    {department.name}
                                </Text>

                                {/* Indicamos visualmente el departamento seleccionado. */}
                                {departamento === department.name && (
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

            {/* Modal para seleccionar un empleado perteneciente
            a la sucursal y departamento elegidos. */}
            <Modal
                visible={showEmployeeModal}
                transparent
                animationType="slide"
                onRequestClose={() => setShowEmployeeModal(false)}
            >
                <View style={styles.modalOverlay}>
                    <View style={[styles.selectionModal, { backgroundColor: colors.cardBackground }]}>

                        {/* Encabezado del selector de empleados. */}
                        <View style={styles.modalHeader}>
                            <Text style={[styles.modalTitle, { color: colors.text }]}>
                                {t("assignedEmployeePlaceholder")}
                            </Text>

                            <TouchableOpacity onPress={() => setShowEmployeeModal(false)}>
                                <Ionicons name="close" size={26} color={colors.textSecondary} />
                            </TouchableOpacity>
                        </View>

                        {/* Permitimos registrar el equipo sin empleado asignado. */}
                        <TouchableOpacity
                            style={[styles.selectionOption, { borderBottomColor: colors.border }]}
                            onPress={() => {
                                setEmpleadoAsignado("");
                                setShowEmployeeModal(false);
                            }}
                        >
                            <Text style={[styles.selectionOptionText, { color: colors.text }]}>
                                {t("unassigned")}
                            </Text>

                            {!empleadoAsignado && (
                                <Ionicons name="checkmark" size={22} color={colors.primary} />
                            )}
                        </TouchableOpacity>

                        {/* Mostramos solamente los empleados disponibles para la ubicación seleccionada. */}
                        {empleadosDisponibles.map((employee) => (
                            <TouchableOpacity
                                key={employee.id}
                                style={[styles.selectionOption, { borderBottomColor: colors.border }]}
                                onPress={() => {
                                    setEmpleadoAsignado(employee.name);
                                    setShowEmployeeModal(false);
                                }}
                            >
                                <Text style={[styles.selectionOptionText, { color: colors.text }]}>
                                    {employee.name}
                                </Text>

                                {empleadoAsignado === employee.name && (
                                    <Ionicons name="checkmark" size={22} color={colors.primary} />
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
        backgroundColor: '#fff',
    },

    container: {
        paddingHorizontal: 20,
        paddingTop: 20,
        paddingBottom: 130,
    },

    title: {
        fontSize: 28,
        fontWeight: 'bold',
        color: '#1E3A8A',
        marginBottom: 24,
        textAlign: 'center',
    },

    previewImage: {
        width: '100%',
        height: 200,
        borderRadius: 12,
        marginTop: 12,
        resizeMode: 'contain',
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

    // Campo utilizado para seleccionar valores desde los catálogos.
    selectField: {
        minHeight: 50,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        paddingHorizontal: 14,
        borderWidth: 1,
        borderRadius: 10,
        marginBottom: 12,
    },

    // Fondo oscuro detrás del selector.
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

    // Encabezado del selector.
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

    // Cada elemento disponible dentro del catálogo.
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

})

export default RegisterEquipmentScreen;