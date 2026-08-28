
import { View, Text,Image,StyleSheet,ScrollView } from "react-native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import type { EquipmentStackParamList } from "../../navigation/EquipmentNavigator";
import StatusBadge from "../../components/StatusBadge";

type Props = NativeStackScreenProps<
    EquipmentStackParamList,
    "EquipmentDetail"
>;


const EquipmentDetailScreen = ({route}:Props) => {
    const {
        codigo,
        marca,
        modelo,
        serie,
        sucursal,
        departamento,
        empleadoAsignado,
        status,
        foto
    } = route.params;

    return(
        //Cambie el contenedor principal a ScrollView
        <ScrollView contentContainerStyle={styles.container}>
            <Text style={styles.screenTitle}>Detalle del equipo</Text>
            <Image source={foto} style={styles.image}/>
            <Text style={styles.title}>{`${marca} ${modelo}`}</Text>
            <Text style={styles.info}>{`Código: ${codigo}`}</Text>
            <Text style={styles.info}>{`Serie: ${serie}`}</Text>
            <Text style={styles.info}>{`Sucursal: ${sucursal}`}</Text>
            <Text style={styles.info}>{`Departamento: ${departamento}`}</Text>
            <Text style={styles.info}>{`Asignado: ${empleadoAsignado || "Sin asignar"}`}</Text>
            <StatusBadge status={status}/>
            <View style={styles.qrPlaceholder}>
                <Text style={styles.qrText}>Código QR</Text>
                <Text style={styles.qrSubtext}>Disponible en una fase posterior</Text>
            </View>
        </ScrollView>
    );
};


const styles = StyleSheet.create({
    container: {
        padding: 20,
    },

    screenTitle: {
        fontSize: 26,
        fontWeight: 'bold',
        color: '#1E3A8A',
        marginBottom: 16,
    },
    image: {
        width: '100%',
        height: 220,
        borderRadius: 12,
        resizeMode: 'contain',
        marginBottom: 20,
    },

    title: {
        fontSize: 24,
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
});

export default EquipmentDetailScreen;
