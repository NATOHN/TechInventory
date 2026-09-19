//1. Importaciones 
import { configureStore } from '@reduxjs/toolkit';

import equipmentReducer, { cargarEquipos } from './equipmentSlice';
import maintenanceReducer, { cargarMantenimientos } from './maintenanceSlice';
import usersReducer from './usersSlice';
import notificationsReducer, { cargarNotificaciones } from './notificationsSlice';
// Importamos el reducer y la acción asíncrona que cargará las sucursales desde Supabase.
import sucursalesReducer, { cargarSucursalesDesdeSupabase } from './sucursalesSlice';
import { saveEquipments, loadEquipments } from './equipmentStorage';
import { saveMaintenances, loadMaintenances } from './maintenanceStorage';
import { saveNotifications, loadNotifications } from './notificationsStorage';


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
        // La propiedad sucursales mantendrá en Redux el catálogo obtenido desde Supabase.
        sucursales: sucursalesReducer,
    },
});

// Guardamos la referencia actual para persistir únicamente cuando Mantenimiento cambie.
let previousMaintenances = store.getState().maintenance.maintenances;

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

    // Obtenemos los mantenimientos actuales del Store.
    const maintenances = store.getState().maintenance.maintenances;

    // Solo guardamos cuando realmente cambió el arreglo de mantenimientos.
    if (maintenances !== previousMaintenances) {
        previousMaintenances = maintenances;

        console.log(
            'Guardando mantenimientos en AsyncStorage:',
            maintenances.length
        );

        saveMaintenances(maintenances).catch((error) => {
            console.log('Error al guardar los mantenimientos:', error);
        });
    }

    // 10a. Obtenemos el arreglo completo de notificaciones y lo guardamos tambien en AsyncStorage.
    const notifications = store.getState().notifications.notifications;

    saveNotifications(notifications).catch((error) => {
        console.log('Error al guardar las notificaciones:', error);
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

// Recuperamos los mantenimientos guardados cuando inicia la aplicación.
const initializeMaintenances = async () => {
    const savedMaintenances = await loadMaintenances();

    // Si existen datos guardados, reemplazamos los datos iniciales del Slice.
    if (savedMaintenances !== null) {
        store.dispatch(cargarMantenimientos(savedMaintenances));

        console.log(
            'Mantenimientos recuperados de AsyncStorage:',
            savedMaintenances.length
        );
    }
};

// Ejecutamos la recuperación al crear el Store.
initializeMaintenances();


// 16. Creamos una función encargada de recuperar las notificaciones cuando inicia la aplicación.
const initializeNotifications = async () => {

    // 17. Intentamos recuperar las notificaciones almacenadas anteriormente.
    const savedNotifications = await loadNotifications();

    // 18. Si AsyncStorage contiene notificaciones, reemplazamos el estado inicial de Redux
    // por los datos recuperados.
    if (savedNotifications !== null) {

        store.dispatch(
            cargarNotificaciones(savedNotifications)
        );

        console.log(
            'Notificaciones recuperadas de AsyncStorage:',
            savedNotifications.length
        );
    }
};

// 19. Ejecutamos la carga de notificaciones cuando se crea el Store.
initializeNotifications();


// 20. Cargamos el catálogo de sucursales directamente desde Supabase.
// Redux conservará estos datos para que las pantallas puedan utilizarlos posteriormente.
const initializeSucursales = async () => {
    try {
        const sucursales = await store.dispatch(cargarSucursalesDesdeSupabase()).unwrap();

        // Mostramos temporalmente el resultado para comprobar la conexión Supabase → Redux.
        console.log('Sucursales recuperadas de Supabase:', sucursales.length);
        console.log('Sucursales:', sucursales);
    } catch (error) {
        // Si Supabase rechaza la consulta, mostramos el error sin detener la aplicación.
        console.log('Error al cargar sucursales desde Supabase:', error);
    }
};

// 21. Ejecutamos la carga de sucursales cuando se crea el Store.
initializeSucursales();

// 6. RootState representa la estructura completa del estado global almacenado dentro de Redux.
export type RootState = ReturnType<typeof store.getState>;


// 7. AppDispatch representa el tipo de dispatch configurado dentro de nuestro Store.
export type AppDispatch = typeof store.dispatch;