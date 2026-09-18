import { View, Text, StyleSheet } from "react-native";

import { useLanguage } from "../context/LanguageContext";


//Props de los estados que recibira el eequipo
type Props = {
    status: 'activo' | 'taller' | 'baja';
    empleadoAsignado?: string;
};

//Paso la Prop a la funcion 
const StatusBadge = ({ status, empleadoAsignado }: Props) => {
    //1. Obtenemos la función t desde LanguageContext
    const { t } = useLanguage();


    // Un equipo activo con empleado asignado se muestra visualmente como "En uso".
    // Los estados Taller y Baja siempre tienen prioridad.
    const tieneEmpleado =
        !!empleadoAsignado?.trim() &&
        empleadoAsignado !== 'Sin asignar';

    const backgroundColor =
        status === 'taller'
            ? 'orange'
            : status === 'baja'
                ? 'red'
                : tieneEmpleado
                    ? '#2563EB'
                    : 'green';

    // Solo cambia el texto mostrado; Redux continúa usando activo/taller/baja.
    const statusText =
        status === 'taller'
            ? t('statusWorkshop')
            : status === 'baja'
                ? t('statusInactive')
                : tieneEmpleado
                    ? t('statusInUse')
                    : t('statusActive');

    return (
        <View style={[styles.badge, { backgroundColor }]}>
            <Text style={styles.text}>{statusText}</Text>
        </View>
    );
};

const styles = StyleSheet.create({
    badge: {
        paddingHorizontal: 10,
        paddingVertical: 5,
        borderRadius: 8,
    },
    text: {
        color: 'white',
        fontWeight: 'bold',
        fontSize: 12,
        textTransform: 'uppercase', //Convierte visualmente activo = ACTIVO, taller = TALLER, baja = BAJA
    },
});





export default StatusBadge;