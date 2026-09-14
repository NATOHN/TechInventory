// 1. Importamos 
import AsyncStorage from '@react-native-async-storage/async-storage';

import type { Equipment } from './equipmentSlice';


// 3. Creamos una clave fija para identificar dónde estarán almacenados los equipos.
const EQUIPMENT_STORAGE_KEY = '@techinventory_equipments';


// 4. Creamos una función asíncrona encargada de guardar el arreglo completo de equipos.
export const saveEquipments = async (equipments: Equipment[]) => {

    // 5. Convertimos el arreglo de JavaScript a un texto JSON.
    const equipmentsJson = JSON.stringify(equipments);


    // 6. Guardamos el texto dentro de AsyncStorage utilizando nuestra clave.
    await AsyncStorage.setItem(
        EQUIPMENT_STORAGE_KEY,
        equipmentsJson
    );
};



// 7. Creamos una función para recuperar los equipos guardados anteriormente.
export const loadEquipments = async (): Promise<Equipment[] | null> => {

    try {

        // 8. Buscamos en AsyncStorage utilizando la misma clave con la que guardamos los equipos.
        const equipmentsJson = await AsyncStorage.getItem(
            EQUIPMENT_STORAGE_KEY
        );


        // 9. Si no existe información guardada,
        // devolvemos null.
        if (!equipmentsJson) {
            return null;
        }


        // 10. AsyncStorage nos devuelve texto. JSON.parse convierte ese texto nuevamente
        // en un arreglo de objetos Equipment.
        const equipments: Equipment[] =
            JSON.parse(equipmentsJson);


        // 11. Retornamos los equipos recuperados.
        return equipments;

    } catch (error) {

        // 12. Si ocurre un problema al leer o convertir los datos, lo mostramos en consola.
        console.log(
            'Error al cargar los equipos:',
            error
        );

        return null;
    }
};
