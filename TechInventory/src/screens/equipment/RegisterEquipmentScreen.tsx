import { Text, ScrollView,Image,StyleSheet,Alert } from "react-native";
import { useState } from "react";
import CustomInput from "../../components/CustomInput";
import * as ImagePicker from 'expo-image-picker';
import CustomButton from "../../components/CustomButton";
import { SafeAreaView } from "react-native-safe-area-context";

const RegisterEquipmentScreen = () => {
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
            Alert.alert(
                "Campos incompletos",
                "Complete todos los campos obligatorios y seleccione una fotografía."
            );
            //este return hace que la funcion termine aqui
            return;
        }
        Alert.alert(
            "Datos validos",
            "La información del equipo fue validada correctamente."
        );
    };

    //2. Hacemos uso de nustro componente reutilizable CustomInput
    return(
        <SafeAreaView style= {styles.safeArea}>
            <ScrollView style={styles.container}>
                <Text style={styles.title}>Registrar Equipos</Text>
                <CustomInput
                    type="text"
                    placeholder="Marca"
                    value={marca}
                    onChange={setMarca}
                />
                <CustomInput
                    type="text"
                    placeholder="Modelo"
                    value={modelo}
                    onChange={setModelo}
                />
                <CustomInput
                    type="text"
                    placeholder="Serie"
                    value={serie}
                    onChange={setSerie}
                />
                <CustomInput
                    type="text"
                    placeholder="Sucursal"
                    value={sucursal}
                    onChange={setSucursal}
                />
                <CustomInput
                    type="text"
                    placeholder="Departamento"
                    value={departamento}
                    onChange={setDepartamento}
                />
                <CustomInput
                    type="text"
                    placeholder="Empleado asignado"
                    value={empleadoAsignado}
                    onChange={setEmpleadoAsignado}
                />
                <CustomButton
                    title="Seleccionar fotografía"
                    onPress={seleccionarImagen}
                    variant="secondary"
                />
                {foto && (<Image source={{uri: foto}} style={styles.previewImage}/>)}
                <CustomButton
                    title="Guardar equipo"
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
   
})

export default RegisterEquipmentScreen;