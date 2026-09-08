import { Text, ScrollView, StyleSheet} from "react-native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";

import EquipmentCard from "../../components/EquipmentCard";
import CustomButton from "../../components/CustomButton";
import { EquipmentStackParamList } from "../../navigation/EquipmentNavigator";
import { SafeAreaView } from "react-native-safe-area-context";
import { useTheme } from "../../context/ThemeContext";
import { useLanguage } from "../../context/LanguageContext";
import { useAppSelector } from "../../redux/hooks";


type Props = NativeStackScreenProps<
    EquipmentStackParamList,
    "EquipmentList"
>;


const EquipmentListScreen = ({navigation}:Props) =>{
    //Obtenemos la paleta de colores actual desde ThemeContext.
    const { colors } = useTheme();
    //Obtenemos la función t desde LanguageContext
    const { t } = useLanguage();

    // Obtenemos el arreglo de equipos almacenado en Redux, state representa todo el Store.
    // equipment es nuestro Slice, equipments es el arreglo definido dentro del estado.
    const equipos = useAppSelector(
        (state) => state.equipment.equipments
    );

    return(
        <SafeAreaView style={[styles.safeArea,{ backgroundColor: colors.background }]}>
            <ScrollView style={{ backgroundColor: colors.background }} contentContainerStyle={styles.container}>
                <Text style={[styles.title, { color: colors.primary }]}>{t("equipmentListTitle")}</Text>
                
                <CustomButton 
                    title={t("registerEquipmentButton")}
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