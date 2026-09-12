
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import type { ImageSourcePropType } from "react-native";
import EquipmentListScreen from "../screens/equipment/EquipmentListScreen";
import RegisterEquipmentScreen from "../screens/equipment/RegisterEquipmentScreen";
import EquipmentDetailScreen from "../screens/equipment/EquipmentDetailScreen";
import EquipmentHistoryScreen from "../screens/equipment/EquipmentHistoryScreen";



export type EquipmentStackParamList = {
    EquipmentList: undefined;
    RegisterEquipment: undefined;
    EquipmentDetail: {
        codigo: string;
        marca: string;
        modelo: string;
        serie: string;
        sucursal: string;
        departamento: string;
        empleadoAsignado: string;
        status: 'activo' | 'taller' | 'baja';
        foto: ImageSourcePropType;
    };
    // Ruta utilizada para consultar el historial de un equipo específico.
    EquipmentHistory: {
        codigo: string;
    };
};

const Stack = createNativeStackNavigator<EquipmentStackParamList>();

const EquipmentNavigator = () => {
    return (
        <Stack.Navigator screenOptions={{ headerShown: false }}>
            <Stack.Screen name='EquipmentList' component={EquipmentListScreen} />
            <Stack.Screen name="RegisterEquipment" component={RegisterEquipmentScreen} />
            <Stack.Screen name="EquipmentDetail" component={EquipmentDetailScreen} />
            <Stack.Screen name="EquipmentHistory" component={EquipmentHistoryScreen}/>
        </Stack.Navigator>
    );
};


export default EquipmentNavigator;