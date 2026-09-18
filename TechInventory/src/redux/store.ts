//1. Importaciones 
import { configureStore } from '@reduxjs/toolkit';

import equipmentReducer, { cargarEquipos} from './equipmentSlice';
import maintenanceReducer from './maintenanceSlice';
import usersReducer from './usersSlice';
import notificationsReducer from './notificationsSlice';
import { saveEquipments, loadEquipments } from './equipmentStorage';


// 2. Creamos el Store principal de TechInventory.
export const store = configureStore({
    reducer: {
        // 3. La propiedad equipment representará todo el estado manejado por equipmentSlice.
        equipment: equipmentReducer,
        // 4. La propiedad maintenance representará todo el estado manejado por maintenanceSlice.
        maintenance: maintenanceReducer,
        // 5. La propiedad users representará todo el estado manejado por usersSlice.
        users: usersReducer,
        // 6. La propiedad notifications representará todo el estado manejado por notificationsSlice.
        notifications: notificationsReducer,
    },
});

// 8. Nos suscribimos a los cambios del Store. Esta función se ejecutará cada vez que Redux
// actualice alguno de sus estados.
store.subscribe(() => {

    // 9. Obtenemos el estado completo y tomamos solamente el arreglo de equipos.
    const equipments = store.getState().equipment.equipments;

    //Prueba temporal
    console.log(
        'Guardando equipos en AsyncStorage:',
        equipments.length
    );

    // 10. Guardamos el arreglo actualizado en AsyncStorage. Si ocurre un error, lo mostramos en consola.
    saveEquipments(equipments).catch((error) => {
        console.log('Error al guardar los equipos:', error);
    });
});



// 11. Creamos una función encargada de recuperar los equipos cuando inicia la aplicación.
const initializeEquipments = async () => {

    // 12. Intentamos recuperar los equipos almacenados anteriormente.
    const savedEquipments = await loadEquipments();


    // 13. Si AsyncStorage contiene equipos, reemplazamos el estado inicial de Redux
    // por los datos recuperados.
    if (savedEquipments !== null) {

        store.dispatch(
            cargarEquipos(savedEquipments)
        );

        // 14. Mostramos temporalmente cuántos equipos fueron recuperados.
        console.log(
            'Equipos recuperados de AsyncStorage:',
            savedEquipments.length
        );
    }
};

// 15. Ejecutamos la carga cuando se crea el Store.
initializeEquipments();


// 6. RootState representa la estructura completa del estado global almacenado dentro de Redux.
export type RootState = ReturnType<typeof store.getState>;

// 7. AppDispatch representa el tipo de dispatch configurado dentro de nuestro Store.
export type AppDispatch = typeof store.dispatch;