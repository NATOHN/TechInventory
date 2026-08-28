import { Text, ScrollView, StyleSheet} from "react-native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import EquipmentCard from "../../components/EquipmentCard";
import CustomButton from "../../components/CustomButton";
import { EquipmentStackParamList } from "../../navigation/EquipmentNavigator";
import { SafeAreaView } from "react-native-safe-area-context";


const equipos = [
    {
        codigo: "EQ-0001",
        marca: "Dell",
        modelo: "Inspiron 3530",
        serie: "ABC123456",
        sucursal: "Tegucigalpa",
        departamento: "Administración",
        empleadoAsignado: "Carlos López",
        status: "activo" as const,
        foto: require("../../img/dell.png"),
    },
    {
            codigo: "EQ-0002",
            marca: "HP",
            modelo: "ProDesk 400 G9",
            serie: "N/A",
            sucursal: "San Pedro Sula",
            departamento: "Contabilidad",
            empleadoAsignado: "Sin asignar",
            status: "taller" as const,
            foto: require("../../img/hp-prodesk-400-g9.png"),
    },

        {
            codigo: "EQ-0003",
            marca: "DELL",
            modelo: "Inspiron 5555",
            serie: "AB554FG",
            sucursal: "San Pedro Sula",
            departamento: "Vetas",
            empleadoAsignado: "Josue Meza",
            status: "baja" as const,
            foto: require("../../img/dell-5555.jpg"),
    }

];

type Props = NativeStackScreenProps<
    EquipmentStackParamList,
    "EquipmentList"
>;


const EquipmentListScreen = ({navigation}:Props) =>{
    return(
        <SafeAreaView>
            <ScrollView contentContainerStyle={styles.container}>
                <Text style={styles.title}>Equipos registrados</Text>
                
                <CustomButton 
                    title="Registrar equipo" 
                    onPress={() => navigation.navigate("RegisterEquipment")}
                />
                {equipos.map((equipo) => {return(
                    <EquipmentCard
                        key={equipo.codigo}
                        codigo ={equipo.codigo}
                        marca={equipo.marca}
                        modelo={equipo.modelo}
                        serie={equipo.serie}
                        sucursal={equipo.sucursal}
                        departamento={equipo.departamento}
                        empleadoAsignado={equipo.empleadoAsignado}
                        status={equipo.status}
                        foto={equipo.foto}

                        onPress={() => navigation.navigate("EquipmentDetail", {
                            codigo: equipo.codigo,
                            marca: equipo.marca,
                            modelo: equipo.modelo,
                            serie: equipo.serie,
                            sucursal: equipo.sucursal,
                            departamento: equipo.departamento,
                            empleadoAsignado: equipo.empleadoAsignado,
                            status: equipo.status,
                            foto: equipo.foto,
                        })}
                    />
                )})}
            </ScrollView>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: '#fff',
    },

    container:{
        paddingHorizontal:20,
        paddingTop: 18,
        paddingBottom:30,
    },

    title:{
        fontSize:26,
        fontWeight: 'bold',
        color: '#1E3A8A',
        marginBottom: 16,
    }
})

export default EquipmentListScreen;