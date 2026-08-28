
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import EquipmentListScreen from "../screens/equipment/EquipmentListScreen";


export type EquipmentStackParamList = {
    EquipmentList: undefined;
};

const Stack = createNativeStackNavigator<EquipmentStackParamList>();

const EquipmentNavigator = () =>{
    return(
       <Stack.Navigator screenOptions={{ headerShown: false }}>
            <Stack.Screen name='EquipmentList' component={EquipmentListScreen}/>
       </Stack.Navigator>
    );
};


export default EquipmentNavigator;