import { View, Text, StyleSheet} from "react-native";


//Props de los estados que recibira el eequipo
type Props = {
    status: 'activo' | 'taller' | 'baja';
};

//Paso la Prop a la funcion 
const StatusBadge = ({status}:Props) => {
    //Varible que controla el color de status
    const backgroundColor = status === 'activo' ? 'green' : status === 'taller' ? 'orange' : 'red';

    return(
        <View style={[styles.badge, {backgroundColor}]}>
            <Text style={styles.text}>{status}</Text>
        </View>
    );
};

const styles = StyleSheet.create({
    badge:{
        paddingHorizontal: 10,
        paddingVertical: 5,
        borderRadius: 8,
    },
    text:{
        color: 'white',
        fontWeight: 'bold',
        fontSize: 12,
        textTransform: 'uppercase', //Convierte visualmente activo = ACTIVO, taller = TALLER, baja = BAJA
    },
});





export default StatusBadge;