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

//Creacion de Props
type Props = NativeStackScreenProps<
    EquipmentStackParamList,
    "RegisterEquipment"
>;

const RegisterEquipmentScreen = ({navigation}:Props) => {
    //Obtenemos la paleta de colores actual desde ThemeContext.
    const { colors } = useTheme();

    const { t } = useLanguage();

    //1. Creamos los estados
    const [marca, setMarca] = useState("");
    const [modelo, setModelo] = useState("");
    const [serie, setSerie] = useState("");
    const [sucursal, setSucursal] = useState("");
    const [departamento, setDepartamento] = useState("");
    const [empleadoAsignado, setEmpleadoAsignado] = useState("");
    const [foto, setFoto] = useState<string | null>(null);

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

        //Si falta información mostramos una alerta
        Alert.alert(
            t("validDataTitle"),
            t("validDataMessage")
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