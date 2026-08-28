import { View, Text, Image,StyleSheet} from "react-native";
import StatusBadge from "./StatusBadge";


type Props ={
    codigo: string;
    marca: string;
    modelo: string;
    serie: string;
    sucursal: string;
    departamento: string;
    empleadoAsignado: string;
    status: 'activo' | 'taller' | 'baja';
};


const EquipmentCard = ({codigo,marca,modelo,serie,sucursal,departamento,empleadoAsignado,status}: Props) => {

    return(
        <View style={styles.card}>
            <View style={styles.header}>
                <Text style={styles.codigo}>{codigo}</Text>
                <StatusBadge status={status}/>
            </View>
            <Text style={styles.titulo}>{`${marca} ${modelo}`}</Text>
            <Text style={styles.info}>{`Serie: ${serie}`}</Text>
            <Text style={styles.info}>{`${sucursal} • ${departamento}`}</Text>
            <Text style={styles.info}>{`Asignado: ${empleadoAsignado}`}</Text>
        </View>
    );
};


const styles = StyleSheet.create({
    card:{
        backgroundColor: '#fff',
        padding: 16,
        borderRadius: 12,
        marginVertical:8,
        borderWidth: 1,
        borderColor: '#e0e0e0',
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },

    codigo: {
    fontSize: 12,
    color: '#666',
    marginBottom: 4,
    },

    titulo:{
        fontSize: 18,
        fontWeight: 'bold',
        color: '#1E3A8A',
        marginBottom: 6,
    },
    info:{
        fontSize: 14,
        color: '#555',
        marginBottom: 4,
    },

    header:{
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 8,
    }
});

export default EquipmentCard;
