
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import EquipmentListScreen from "../screens/equipment/EquipmentListScreen";
import RegisterEquipmentScreen from "../screens/equipment/RegisterEquipmentScreen";


export type EquipmentStackParamList = {
    EquipmentList: undefined;
    RegisterEquipment: undefined;
};

const Stack = createNativeStackNavigator<EquipmentStackParamList>();

const EquipmentNavigator = () =>{
    return(
       <Stack.Navigator screenOptions={{ headerShown: false }}>
            <Stack.Screen name='EquipmentList' component={EquipmentListScreen}/>
            <Stack.Screen name="RegisterEquipment" component={RegisterEquipmentScreen}/>
       </Stack.Navigator>
    );
};


export default EquipmentNavigator;