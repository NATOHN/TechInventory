import { Text, ScrollView,Image,StyleSheet,Alert,TouchableOpacity } from "react-native";
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
import {useAppDispatch, useAppSelector} from "../../redux/hooks";
import { agregarEquipo, Equipment } from "../../redux/equipmentSlice";


//Creacion de Props
type Props = NativeStackScreenProps<
    EquipmentStackParamList,
    "RegisterEquipment"
>;

const RegisterEquipmentScreen = ({navigation}:Props) => {
    //Obtenemos la paleta de colores actual desde ThemeContext.
    const { colors } = useTheme();

    const { t } = useLanguage();

    // 3. Obtenemos la función dispatch. dispatch será la encargada de enviar acciones
    // desde esta pantalla hacia Redux.
    const dispatch = useAppDispatch();

    //Obtenemos los equipos que actualmente están almacenados dentro de Redux.
    const equipos = useAppSelector( (state) => state.equipment.equipments);


    //1. Creamos los estados
    const [marca, setMarca] = useState("");
    const [modelo, setModelo] = useState("");
    const [serie, setSerie] = useState("");
    const [sucursal, setSucursal] = useState("");
    const [departamento, setDepartamento] = useState("");
    const [empleadoAsignado, setEmpleadoAsignado] = useState("");
    const [foto, setFoto] = useState<string | null>(null);

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
    return(
        <SafeAreaView style= {[styles.safeArea, { backgroundColor: colors.background }]}>
            <ScrollView style={[styles.container, { backgroundColor: colors.background }]}>
                <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
                    <Ionicons name="arrow-back" size={22} color={colors.primary} />
                    <Text style={[styles.backText, { color: colors.primary }]}>{t("backButton")}</Text>
                </TouchableOpacity>
                <Text style={[styles.title, { color: colors.primary }]}>{t("registerEquipmentTitle")}</Text>
                <CustomInput
                    type="text"
                    placeholder={t("brandPlaceholder")}
                    value={marca}
                    onChange={setMarca}
                />
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
                <CustomInput
                    type="text"
                    placeholder={t("branchPlaceholder")}
                    value={sucursal}
                    onChange={setSucursal}
                />
                <CustomInput
                    type="text"
                    placeholder={t("departmentPlaceholder")}
                    value={departamento}
                    onChange={setDepartamento}
                />
                <CustomInput
                    type="text"
                    placeholder={t("assignedEmployeePlaceholder")}
                    value={empleadoAsignado}
                    onChange={setEmpleadoAsignado}
                />
                <CustomButton
                    title={t("selectPhotoButton")}
                    onPress={seleccionarImagen}
                    variant="secondary"
                />
                {foto && (<Image source={{uri: foto}} style={styles.previewImage}/>)}
                <CustomButton
                    title={t("saveEquipmentButton")}
                    onPress={guardarEquipo}
                />
            </ScrollView>
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
    
})

export default RegisterEquipmentScreen;