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
// Mantiene los indicadores reales obtenidos desde Supabase para Home y Reportes.
import analyticsReducer from './analyticsSlice';

import { saveEquipments, loadEquipments } from './equipmentStorage';
import { saveMaintenances, loadMaintenances } from './maintenanceStorage';
import { saveNotifications, loadNotifications } from './notificationsStorage';
// Sincroniza con Supabase únicamente los equipos que realmente cambian en Redux.
import { obtenerEquiposDesdeSupabase, sincronizarEquipoConSupabase } from '../services/equiposService';
// Sincroniza los cambios actuales de Mantenimiento con PostgreSQL.
import { obtenerMantenimientosDesdeSupabase, sincronizarMantenimientoConSupabase } from '../services/mantenimientosService';


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
        // Los indicadores de Home y Reportes se almacenan por separado
        // para no depender de los datos temporales recuperados desde AsyncStorage.
        analytics: analyticsReducer,
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

// Refresca el inventario desde Supabase sin interpretar la carga remota
// como si fueran modificaciones realizadas localmente por el usuario.
export const refrescarEquiposDesdeSupabase = async () => {
    // Antes de leer Supabase esperamos cualquier cambio local que todavía
    // se encuentre sincronizándose. Esto evita traer una versión antigua
    // justo después de registrar o modificar un equipo.
    await Promise.allSettled([...equipmentSyncQueue.values()]);

    const equiposSupabase = await obtenerEquiposDesdeSupabase();

    // Conservamos el estado actual de la bandera porque esta función
    // también puede utilizarse durante la inicialización de la aplicación.
    const initializationAnterior = equipmentInitializationComplete;

    // La carga proveniente de Supabase no debe volver a enviarse a Supabase.
    equipmentInitializationComplete = false;

    try {
        store.dispatch(cargarEquipos(equiposSupabase));
    } finally {
        equipmentInitializationComplete = initializationAnterior;
    }

    return equiposSupabase;
};


// Guardamos la referencia actual para persistir únicamente cuando Mantenimiento cambie.
let previousMaintenances = store.getState().maintenance.maintenances;

// Evita enviar a Supabase automáticamente los mantenimientos antiguos
// recuperados inicialmente desde AsyncStorage.
let maintenanceInitializationComplete = false;

// Cada mantenimiento utiliza su propia cola para conservar el orden
// cuando se realizan varios cambios consecutivos.
const maintenanceSyncQueue = new Map<string, Promise<void>>();

// Recupera nuevamente los mantenimientos compartidos desde Supabase
// sin interpretar la carga remota como modificaciones locales.
export const refrescarMantenimientosDesdeSupabase = async () => {
    // Esperamos cualquier sincronización local pendiente antes de leer nuevamente.
    await Promise.allSettled([...maintenanceSyncQueue.values()]);

    const mantenimientosSupabase =
        await obtenerMantenimientosDesdeSupabase();

    // Conservamos el estado anterior de la bandera.
    const initializationAnterior =
        maintenanceInitializationComplete;

    // Mientras cargamos información remota evitamos volverla
    // a enviar inmediatamente hacia Supabase.
    maintenanceInitializationComplete = false;

    try {
        store.dispatch(
            cargarMantenimientos(mantenimientosSupabase)
        );
    } finally {
        maintenanceInitializationComplete =
            initializationAnterior;
    }

    return mantenimientosSupabase;
};

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



    // Obtenemos los mantenimientos actuales directamente del estado ya leído.
    const maintenances = currentState.maintenance.maintenances;

    // Solo trabajamos cuando Redux realmente modificó el arreglo de mantenimientos.
    if (maintenances !== previousMaintenances) {
        const previousMaintenancesMap = new Map(
            previousMaintenances.map((mantenimiento) => [
                mantenimiento.id,
                mantenimiento,
            ])
        );

        // Immer conserva la referencia de los objetos sin cambios.
        // Así detectamos exactamente qué mantenimiento fue creado o modificado.
        const changedMaintenances = maintenances.filter(
            (mantenimiento) =>
                previousMaintenancesMap.get(mantenimiento.id) !== mantenimiento
        );

        previousMaintenances = maintenances;

        // Conservamos AsyncStorage mientras finalizamos la migración completa.
        saveMaintenances(maintenances).catch((error) => {
            console.log('Error al guardar los mantenimientos:', error);
        });

        // Los datos antiguos de prueba cargados inicialmente no se migran automáticamente.
        if (maintenanceInitializationComplete) {
            changedMaintenances.forEach((mantenimiento) => {
                const previousSync =
                    maintenanceSyncQueue.get(mantenimiento.id) ?? Promise.resolve();

                // Encadenamos las operaciones para que una edición rápida
                // no llegue a PostgreSQL antes que la creación inicial.
                const nextSync = previousSync
                    .catch(() => undefined)
                    .then(async () => {
                        await sincronizarMantenimientoConSupabase(mantenimiento);

                        console.log(
                            'Mantenimiento sincronizado con Supabase:',
                            mantenimiento.codigoMantenimiento ?? mantenimiento.id
                        );
                    })
                    .catch((error) => {
                        console.log(
                            `Error al sincronizar mantenimiento ${mantenimiento.codigoMantenimiento ?? mantenimiento.id}:`,
                            error
                        );
                    });

                maintenanceSyncQueue.set(mantenimiento.id, nextSync);

                // Limpiamos la cola cuando ya no exista otra operación pendiente.
                void nextSync.finally(() => {
                    if (maintenanceSyncQueue.get(mantenimiento.id) === nextSync) {
                        maintenanceSyncQueue.delete(mantenimiento.id);
                    }
                });
            });
        }
    }

    // 10a. Obtenemos el arreglo completo de notificaciones y lo guardamos tambien en AsyncStorage.
    const notifications = store.getState().notifications.notifications;

    saveNotifications(notifications).catch((error) => {
        console.log('Error al guardar las notificaciones:', error);
    });
});



// 11. Recupera primero el inventario compartido desde Supabase.
// AsyncStorage queda únicamente como respaldo temporal si no existe conexión.
const initializeEquipments = async () => {
    try {
        // Utilizamos el mismo refresco seguro empleado por las pantallas.
        // La carga remota no se vuelve a interpretar como una edición local.
        const equiposSupabase = await refrescarEquiposDesdeSupabase();

        console.log(
            'Equipos recuperados desde Supabase:',
            equiposSupabase.length
        );
    } catch (error) {
        console.log(
            'No se pudieron cargar los equipos desde Supabase:',
            error
        );

        // Si el dispositivo está temporalmente sin conexión,
        // intentamos trabajar con la última copia disponible.
        const savedEquipments = await loadEquipments();

        if (savedEquipments !== null) {
            store.dispatch(
                cargarEquipos(savedEquipments)
            );

            console.log(
                'Equipos recuperados desde respaldo local:',
                savedEquipments.length
            );
        }
    } finally {
        // Solo después de terminar la hidratación inicial permitimos
        // que los nuevos cambios del usuario vuelvan a sincronizarse.
        equipmentInitializationComplete = true;
    }
};

// 15. Ejecutamos la carga cuando se crea el Store.
initializeEquipments();

// Recupera primero los mantenimientos compartidos desde Supabase.
// AsyncStorage queda únicamente como respaldo temporal si no existe conexión.
const initializeMaintenances = async () => {
    try {
        // Supabase pasa a ser la fuente principal del módulo.
        const mantenimientosSupabase =
            await refrescarMantenimientosDesdeSupabase();

        // Guardamos una copia local únicamente como respaldo.
        await saveMaintenances(mantenimientosSupabase);

        console.log(
            'Mantenimientos recuperados desde Supabase:',
            mantenimientosSupabase.length
        );
    } catch (error) {
        console.log(
            'No se pudieron cargar los mantenimientos desde Supabase:',
            error
        );

        // Solo si Supabase falla utilizamos la última copia disponible.
        const savedMaintenances =
            await loadMaintenances();

        if (savedMaintenances !== null) {
            store.dispatch(
                cargarMantenimientos(savedMaintenances)
            );

            console.log(
                'Mantenimientos recuperados desde respaldo local:',
                savedMaintenances.length
            );
        }
    } finally {
        // Desde este momento los cambios nuevos sí se sincronizan.
        maintenanceInitializationComplete = true;
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