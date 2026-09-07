
import { View, Text,Image,StyleSheet,ScrollView,TouchableOpacity } from "react-native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import type { EquipmentStackParamList } from "../../navigation/EquipmentNavigator";
import StatusBadge from "../../components/StatusBadge";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";

import { useTheme } from "../../context/ThemeContext";

type Props = NativeStackScreenProps<
    EquipmentStackParamList,
    "EquipmentDetail"
>;


const EquipmentDetailScreen = ({route, navigation}:Props) => {
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

    //Obtenemos la paleta de colores actual desde ThemeContext.
    const { colors } = useTheme();

    return(
        //Cambie el contenedor principal a ScrollView
        <SafeAreaView style={[styles.safeArea, { backgroundColor: colors.background }]}>
            <ScrollView style={{ backgroundColor: colors.background }} contentContainerStyle={styles.container}>
                <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
                    <Ionicons name="arrow-back" size={22} color={colors.primary} />
                    <Text style={[styles.backText, { color: colors.primary }]}>Regresar</Text>
                </TouchableOpacity>
                <Text style={[styles.screenTitle, { color: colors.primary }]}>Detalle del equipo</Text>
                <Image source={foto} style={styles.image}/>
                <Text style={[styles.title, { color: colors.primary }]}>{`${marca} ${modelo}`}</Text>
                <Text style={[styles.info, { color: colors.textSecondary }]}>{`Código: ${codigo}`}</Text>
                <Text style={[styles.info, { color: colors.textSecondary }]}>{`Serie: ${serie}`}</Text>
                <Text style={[styles.info, { color: colors.textSecondary }]}>{`Sucursal: ${sucursal}`}</Text>
                <Text style={[styles.info, { color: colors.textSecondary }]}>{`Departamento: ${departamento}`}</Text>
                <Text style={[styles.info, { color: colors.textSecondary }]}>{`Asignado: ${empleadoAsignado || "Sin asignar"}`}</Text>
                <StatusBadge status={status}/>
                <View style={[styles.qrPlaceholder, {borderColor: colors.border}]}>
                    <Text style={[styles.qrText, { color: colors.primary }]}>Código QR</Text>
                    <Text style={[styles.qrSubtext, { color: colors.textSecondary }]}>Disponible en una fase posterior</Text>
                </View>
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
});

export default EquipmentDetailScreen;
