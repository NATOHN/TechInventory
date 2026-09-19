//1. Importaciones 
import { configureStore } from '@reduxjs/toolkit';

import equipmentReducer, { cargarEquipos } from './equipmentSlice';
import maintenanceReducer, { cargarMantenimientos } from './maintenanceSlice';
import usersReducer from './usersSlice';
import notificationsReducer, { cargarNotificaciones } from './notificationsSlice';
// Importamos el reducer y la acción asíncrona que cargará las sucursales desde Supabase.
import sucursalesReducer, { cargarSucursalesDesdeSupabase } from './sucursalesSlice';
// Importamos el reducer de departamentos para mantener este catálogo dentro de Redux.
import departamentosReducer, { cargarDepartamentosDesdeSupabase } from './departamentosSlice';
// Importamos el reducer y la acción asíncrona que cargará los empleados desde Supabase.
import empleadosReducer, { cargarEmpleadosDesdeSupabase } from './empleadosSlice';

import { saveEquipments, loadEquipments } from './equipmentStorage';
import { saveMaintenances, loadMaintenances } from './maintenanceStorage';
import { saveNotifications, loadNotifications } from './notificationsStorage';
// Sincroniza con Supabase únicamente los equipos que realmente cambian en Redux.
import { sincronizarEquipoConSupabase } from '../services/equiposService';


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
        // La propiedad departamentos mantendrá en Redux el catálogo obtenido desde Supabase.
        departamentos: departamentosReducer,
        // La propiedad empleados mantendrá en Redux el catálogo obtenido desde Supabase.
        empleados: empleadosReducer,
    },
});


// Guardamos la referencia actual de equipos para detectar únicamente
// modificaciones reales y evitar escribir en Supabase por cualquier acción del Store.
let previousEquipments = store.getState().equipment.equipments;

// Evita sincronizar automáticamente los datos antiguos recuperados desde AsyncStorage.
// Los datos locales actuales son de prueba y no necesitamos migrarlos a Supabase.
let equipmentInitializationComplete = false;

// Mantiene una cola independiente por código de equipo.
// Esto evita que dos cambios rápidos, por ejemplo finalizar mantenimiento y liberar
// empleado, lleguen a Supabase en un orden diferente al ocurrido dentro de Redux.
const equipmentSyncQueue = new Map<string, Promise<void>>();


// Guardamos la referencia actual para persistir únicamente cuando Mantenimiento cambie.
let previousMaintenances = store.getState().maintenance.maintenances;

// 8. Nos suscribimos a los cambios del Store. Esta función se ejecutará cada vez que Redux
// actualice alguno de sus estados.
store.subscribe(() => {

    // Obtenemos una sola vez el estado actual para trabajar con equipos y catálogos.
    const currentState = store.getState();
    const equipments = currentState.equipment.equipments;

    // Solo persistimos cuando el arreglo de equipos cambió realmente.
    // Así evitamos guardar equipos cada vez que cambia otro Slice del Store.
    if (equipments !== previousEquipments) {
        const previousEquipmentsMap = new Map(
            previousEquipments.map((equipo) => [equipo.codigo, equipo])
        );

        // Immer conserva la referencia de los objetos que no cambiaron.
        // Por eso podemos identificar exactamente qué equipos fueron modificados.
        const changedEquipments = equipments.filter(
            (equipo) =>
                previousEquipmentsMap.get(equipo.codigo) !== equipo
        );

        // Actualizamos la referencia antes de comenzar operaciones asíncronas.
        previousEquipments = equipments;

        // AsyncStorage continúa funcionando durante la migración.
        // Lo eliminaremos únicamente cuando toda la información relacionada
        // con Equipos esté completamente respaldada por Supabase.
        saveEquipments(equipments).catch((error) => {
            console.log('Error al guardar los equipos:', error);
        });

        // No sincronizamos el arreglo antiguo cargado inicialmente desde AsyncStorage.
        if (equipmentInitializationComplete) {
            changedEquipments.forEach((equipo) => {
                // Capturamos los catálogos actuales para convertir nombres a IDs.
                const catalogos = {
                    sucursales: currentState.sucursales.sucursales,
                    departamentos: currentState.departamentos.departamentos,
                    empleados: currentState.empleados.empleados,
                };

                // Recuperamos la última sincronización pendiente del mismo equipo.
                const previousSync =
                    equipmentSyncQueue.get(equipo.codigo) ?? Promise.resolve();

                // Encadenamos el nuevo cambio para garantizar el orden correcto.
                const nextSync = previousSync
                    .catch(() => undefined)
                    .then(async () => {
                        await sincronizarEquipoConSupabase(equipo, catalogos);

                        console.log(
                            'Equipo sincronizado con Supabase:',
                            equipo.codigo
                        );
                    })
                    .catch((error) => {
                        console.log(
                            `Error al sincronizar ${equipo.codigo} con Supabase:`,
                            error
                        );
                    });

                equipmentSyncQueue.set(equipo.codigo, nextSync);

                // Eliminamos la cola solamente si esta sigue siendo
                // la última operación pendiente para el equipo.
                void nextSync.finally(() => {
                    if (equipmentSyncQueue.get(equipo.codigo) === nextSync) {
                        equipmentSyncQueue.delete(equipo.codigo);
                    }
                });
            });
        }
    }

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

    // A partir de este punto los nuevos cambios realizados por el usuario
// sí podrán sincronizarse con Supabase.
// La recuperación inicial de datos locales queda excluida intencionalmente.
equipmentInitializationComplete = true;
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

// 22. Cargamos el catálogo de departamentos directamente desde Supabase.
// Redux conservará los departamentos y su relación mediante sucursal_id.
const initializeDepartamentos = async () => {
    try {
        const departamentos = await store.dispatch(cargarDepartamentosDesdeSupabase()).unwrap();

        // Mostramos temporalmente el resultado para comprobar la conexión Supabase → Redux.
        console.log('Departamentos recuperados de Supabase:', departamentos.length);
        console.log('Departamentos:', departamentos);
    } catch (error) {
        // Si Supabase rechaza la consulta, mostramos el error sin detener la aplicación.
        console.log('Error al cargar departamentos desde Supabase:', error);
    }
};

// 23. Ejecutamos la carga de departamentos cuando se crea el Store.
initializeDepartamentos();

// 24. Cargamos el catálogo de empleados directamente desde Supabase.
const initializeEmpleados = async () => {
    try {
        const empleados = await store.dispatch(cargarEmpleadosDesdeSupabase()).unwrap();

        // Validación temporal para confirmar Supabase → Redux.
        console.log('Empleados recuperados de Supabase:', empleados.length);
        console.log('Empleados:', empleados);
    } catch (error) {
        // Un error en el catálogo no debe detener el resto de la aplicación.
        console.log('Error al cargar empleados desde Supabase:', error);
    }
};

// 25. Ejecutamos la carga de empleados cuando se crea el Store.
initializeEmpleados();

// 6. RootState representa la estructura completa del estado global almacenado dentro de Redux.
export type RootState = ReturnType<typeof store.getState>;


// 7. AppDispatch representa el tipo de dispatch configurado dentro de nuestro Store.
export type AppDispatch = typeof store.dispatch;