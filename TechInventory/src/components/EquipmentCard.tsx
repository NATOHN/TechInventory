import { View, Text, Image, ImageSourcePropType, StyleSheet, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import StatusBadge from "./StatusBadge";

import { useTheme } from "../context/ThemeContext";
import { useLanguage } from "../context/LanguageContext";

//Agregue la props onPress
type Props = {
    codigo: string;
    marca: string;
    modelo: string;
    serie: string;
    sucursal: string;
    departamento: string;
    empleadoAsignado: string;
    status: 'activo' | 'taller' | 'baja';
    foto: ImageSourcePropType;
    onPress: () => void;
};


const EquipmentCard = ({ codigo, marca, modelo, serie, sucursal, departamento, empleadoAsignado, status, foto, onPress }: Props) => {
    //Obtenemos la paleta de colores actual desde ThemeContext.
    const { colors } = useTheme();

    //Obtenemos la función t desde LanguageContext
    const { t } = useLanguage();

    return (
        //Cambie el View Exterio por TouchableOpacity para que la tarjeta pueda ser tocable 
        <TouchableOpacity style={[styles.card, { backgroundColor: colors.cardBackground, borderColor: colors.cardBorder, }]} onPress={onPress}>
            {/*La fotografía queda a la izquierda. */}
            <Image
                source={foto}
                style={styles.image}
            />

            {/*Este nuevo contenedor guardará toda la información ubicada a la derecha. */}
            <View style={styles.content}>
                <View style={styles.header}>
                    <Text style={[styles.codigo, { color: colors.primary }]}>{codigo}</Text>
                    <StatusBadge status={status} />
                </View>
                <Text style={[styles.titulo, { color: colors.text }]}>{`${marca} ${modelo}`}</Text>
                <Text style={[styles.info, { color: colors.textSecondary }]}>{`${t("seriesLabel")}: ${serie}`}</Text>
                <Text style={[styles.info, { color: colors.textSecondary }]}>{`${sucursal} • ${departamento}`}</Text>
                <Text style={[styles.info, { color: colors.textSecondary }]}>
                    {`${t("assignedLabel")}: ${empleadoAsignado === "Sin asignar"
                            ? t("unassigned")
                            : empleadoAsignado
                        }`}
                </Text>
            </View>

            {/* Indicamos visualmente que el equipo puede abrirse para ver más información. */}
            <Ionicons
                name="chevron-forward"
                size={18}
                color={colors.textSecondary}
/>
        </TouchableOpacity>
    );
};


const styles = StyleSheet.create({

    content: {
        flex: 1,
        marginRight: 8,
    },

    card: {
        width: '100%',
        backgroundColor: '#fff',
        padding: 12,
        borderRadius: 12,
        marginVertical: 6,
        borderWidth: 1,
        borderColor: '#e0e0e0',
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 1,
        },
        shadowOpacity: 0.06,
        shadowRadius: 2,
        elevation: 1,
        flexDirection: 'row',
        alignItems: 'center',
    },

    codigo: {
        fontSize: 14,
        fontWeight: '700',
        marginBottom: 2,
    },

    titulo: {
        fontSize: 16,
        fontWeight: '600',
        marginBottom: 4,
    },
    info: {
        fontSize: 13,
        marginBottom: 3,
    },

    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 8,
    },

    image: {
        width: 72,
        height: 72,
        borderRadius: 10,
        marginRight: 12,
        resizeMode: 'contain',
    },
});

export default EquipmentCard;
