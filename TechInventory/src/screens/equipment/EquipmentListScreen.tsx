import { Text, ScrollView, StyleSheet} from "react-native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import EquipmentCard from "../../components/EquipmentCard";
import CustomButton from "../../components/CustomButton";
import { EquipmentStackParamList } from "../../navigation/EquipmentNavigator";


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
            foto: require("../../img/dell.png"),
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
            foto: require("../../img/dell.png"),
    }

];

type Props = NativeStackScreenProps<
    EquipmentStackParamList,
    "EquipmentList"
>;


const EquipmentListScreen = ({navigation}:Props) =>{
    return(
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
                />
            )})}
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container:{
        padding:20,
    },

    title:{
        fontSize:26,
        fontWeight: 'bold',
        color: '#1E3A8A',
        marginBottom: 16,
    }
})

export default EquipmentListScreen;