import { View, Text, StyleSheet} from "react-native";

import { useLanguage } from "../context/LanguageContext";


//Props de los estados que recibira el eequipo
type Props = {
    status: 'activo' | 'taller' | 'baja';
};

//Paso la Prop a la funcion 
const StatusBadge = ({status}:Props) => {
    //1. Obtenemos la función t desde LanguageContext
    const { t } = useLanguage();


    //Varible que controla el color de status
    const backgroundColor = status === 'activo' ? 'green' : status === 'taller' ? 'orange' : 'red';

    // 2.Seleccionamos el texto traducido según
    // el estado interno recibido por el componente.
    const statusText = status === 'activo' ? t('statusActive') : status === 'taller' ? t('statusWorkshop') : t('statusInactive');

    return(
        <View style={[styles.badge, {backgroundColor}]}>
            <Text style={styles.text}>{statusText}</Text>
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