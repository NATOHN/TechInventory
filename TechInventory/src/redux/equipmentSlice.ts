// 1. Importamos únicamente el tipo ImageSourcePropType.
import type { ImageSourcePropType } from 'react-native';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';


// 2. Definimos los estados permitidos para un equipo.
export type EquipmentStatus = | 'activo' | 'taller' | 'baja';

// Representa un cambio de estado realizado sobre un equipo.
// Se utilizará en el historial para registrar bajas, reactivaciones
// y posteriormente cambios generados desde Mantenimiento.
export type EquipmentStatusHistory = {
    estadoAnterior: EquipmentStatus;
    estadoNuevo: EquipmentStatus;
    fecha: string;

    // Indica desde qué proceso se realizó el cambio.
    origen: "detalle" | "mantenimiento";

    // Estos datos quedan preparados para futuras integraciones.
    motivo?: string;
    realizadoPorId?: string;
    realizadoPorNombre?: string;
};

// 12. Define cada movimiento de ubicación realizado sobre un equipo.
export type EquipmentLocationHistory = {
    sucursalAnterior: string;
    departamentoAnterior: string;
    sucursalNueva: string;
    departamentoNuevo: string;
    empleadoAnterior?: string;
    empleadoNuevo?: string;

    // Usuario del sistema que realizó la reasignación.
    // Se completará cuando integremos los usuarios desde Supabase.
    realizadoPorId?: string;
    realizadoPorNombre?: string;

    fecha: string;
};


// 3. Definimos la estructura que tendrá cada equipo
// almacenado dentro de Redux.
export type Equipment = {
    codigo: string;
    marca: string;
    modelo: string;
    serie: string;
    sucursal: string;
    departamento: string;
    empleadoAsignado: string;
    status: EquipmentStatus;
    foto: ImageSourcePropType;
    // Guarda los cambios de ubicación realizados al equipo.
    historialUbicaciones?: EquipmentLocationHistory[];
    // Guarda todos los cambios de estado realizados sobre el equipo.
    historialEstados?: EquipmentStatusHistory[];
    // Guarda temporalmente el estado que tenía el equipo antes de ser dado de baja.
    estadoAntesDeBaja?: 'activo' | 'taller';
};


// 4. Definimos la estructura del estado que manejará Redux para el módulo de equipos.
// equipments será el arreglo que contendrá todos los equipos registrados en TechInventory.
type EquipmentState = {
    equipments: Equipment[];
};


// 5. Creamos el estado inicial del módulo de equipos.
// Por ahora comenzamos con un arreglo vacío.
const initialState: EquipmentState = {
    equipments: [
        // 12. Primer equipo de prueba.
        {
            codigo: "EQ-0001",
            marca: "Dell",
            modelo: "Inspiron 3530",
            serie: "ABC123456",
            sucursal: "Tegucigalpa",
            departamento: "Administración",
            empleadoAsignado: "Carlos López",
            status: "activo",
            foto: require("../img/dell.png"),
        },

        // 13. Segundo equipo de prueba.
        {
            codigo: "EQ-0002",
            marca: "HP",
            modelo: "ProDesk 400 G9",
            serie: "N/A",
            sucursal: "San Pedro Sula",
            departamento: "Contabilidad",
            empleadoAsignado: "Sin asignar",
            status: "taller",
            foto: require("../img/hp-prodesk-400-g9.png"),
        },

        // 14. Tercer equipo de prueba.
        {
            codigo: "EQ-0003",
            marca: "Dell",
            modelo: "Inspiron 5555",
            serie: "AB554FG",
            sucursal: "San Pedro Sula",
            departamento: "Vetas",
            empleadoAsignado: "Josue Meza",
            status: "baja",
            foto: require("../img/dell-5555.jpg"),
        },
    ],
};


// 6. Creamos el Slice encargado de manejar
// toda la información relacionada con los equipos.
const equipmentSlice = createSlice({

    // 7. Nombre interno del Slice dentro de Redux.
    name: 'equipment',

    // 8. Indicamos cuál será el estado inicial que utilizará este módulo.
    initialState,

    // 9. Aquí agregaremos las funciones que modificarán el estado de los equipos.
    reducers: {
        agregarEquipo: (state, action: PayloadAction<Equipment>) => {
            // 10. action.payload contiene el equipo que fue enviado desde la aplicación.
            state.equipments.push(action.payload);
        },

        // Reemplaza el arreglo completo con los equipos recuperados de AsyncStorage.
        cargarEquipos: (state, action: PayloadAction<Equipment[]>) => {
            //11. Sustituimos los equipos actuales por los recuperados desde AsyncStorage.
            state.equipments = action.payload;
        },

        // Permite actualizar la sucursal y el departamento de un equipo existente.
        cambiarUbicacionEquipo: (
            state,
            action: PayloadAction<{
                codigo: string;
                sucursal: string;
                departamento: string;
                empleadoAsignado: string;
            }>
        ) => {
            // Buscamos el equipo utilizando su código único.
            const equipo = state.equipments.find((equipo) => equipo.codigo === action.payload.codigo);

            // Si encontramos el equipo, actualizamos únicamente su ubicación.
            if (equipo) {
                // Creamos el historial si el equipo todavía no posee movimientos anteriores.
                if (!equipo.historialUbicaciones) {
                    equipo.historialUbicaciones = [];
                }

                // Guardamos la ubicación actual antes de reemplazarla por la nueva.
                equipo.historialUbicaciones.push({
                    sucursalAnterior: equipo.sucursal,
                    departamentoAnterior: equipo.departamento,
                    empleadoAnterior: equipo.empleadoAsignado,

                    sucursalNueva: action.payload.sucursal,
                    departamentoNuevo: action.payload.departamento,
                    empleadoNuevo: action.payload.empleadoAsignado,

                    fecha: new Date().toISOString(),
                });

                //Actualizamos la ubicación actual del equipo.
                equipo.sucursal = action.payload.sucursal;
                equipo.departamento = action.payload.departamento;
                equipo.empleadoAsignado = action.payload.empleadoAsignado;
            }
        },


        // Envía un equipo a taller cuando comienza un mantenimiento.
        // También registra automáticamente el cambio dentro del historial de estados.
        enviarEquipoATallerPorMantenimiento: (
            state,
            action: PayloadAction<{ codigo: string }>
        ) => {
            // Buscamos el equipo mediante su código único.
            const equipo = state.equipments.find(
                (equipo) => equipo.codigo === action.payload.codigo
            );

            // Solo hacemos el cambio si actualmente está activo.
            // Esto evita registrar varias veces activo -> taller por error.
            if (equipo && equipo.status === "activo") {
                equipo.historialEstados ??= [];

                // Registramos que el cambio fue provocado por Mantenimiento.
                equipo.historialEstados.push({
                    estadoAnterior: "activo",
                    estadoNuevo: "taller",
                    fecha: new Date().toISOString(),
                    origen: "mantenimiento",
                    motivo: "Inicio de mantenimiento",
                });

                // Finalmente actualizamos el estado actual del equipo.
                equipo.status = "taller";
            }
        },

        // Devuelve el equipo a Activo cuando el mantenimiento finaliza correctamente.
        // También registra automáticamente el cambio dentro del historial de estados.
        activarEquipoTrasMantenimiento: (
            state,
            action: PayloadAction<{ codigo: string }>
        ) => {
            // Buscamos el equipo utilizando su código único.
            const equipo = state.equipments.find(
                (equipo) => equipo.codigo === action.payload.codigo
            );

            // Solo realizamos el cambio si el equipo está actualmente en Taller.
            if (equipo && equipo.status === "taller") {
                equipo.historialEstados ??= [];

                // Registramos el cambio provocado por la finalización del mantenimiento.
                equipo.historialEstados.push({
                    estadoAnterior: "taller",
                    estadoNuevo: "activo",
                    fecha: new Date().toISOString(),
                    origen: "mantenimiento",
                    motivo: "Mantenimiento finalizado",
                });

                // El equipo vuelve a quedar disponible.
                equipo.status = "activo";
            }
        },

        // Da de baja un equipo directamente desde un mantenimiento.
        // El motivo quedará registrado para mostrarlo posteriormente en el historial.
        darDeBajaEquipoPorMantenimiento: (
            state,
            action: PayloadAction<{ codigo: string; motivo: string }>
        ) => {
            // Buscamos el equipo relacionado con el mantenimiento.
            const equipo = state.equipments.find(
                (equipo) => equipo.codigo === action.payload.codigo
            );

            // La baja desde mantenimiento solo procede si el equipo está en Taller.
            if (equipo && equipo.status === "taller") {
                // Conservamos el estado anterior por si posteriormente se reactiva el equipo.
                equipo.estadoAntesDeBaja = "taller";

                // Creamos el historial de estados si todavía no existe.
                equipo.historialEstados ??= [];

                // Registramos que la baja se originó dentro de Mantenimiento.
                equipo.historialEstados.push({
                    estadoAnterior: "taller",
                    estadoNuevo: "baja",
                    fecha: new Date().toISOString(),
                    origen: "mantenimiento",
                    motivo: action.payload.motivo,
                });

                // Finalmente cambiamos el estado actual del equipo.
                equipo.status = "baja";
            }
        },

        // Da de baja un equipo y registra el cambio dentro del historial de estados.
        darDeBajaEquipo: (state, action: PayloadAction<{ codigo: string }>) => {
            // Buscamos el equipo utilizando su código único.
            const equipo = state.equipments.find(
                (equipo) => equipo.codigo === action.payload.codigo
            );

            // Solo registramos la baja si el equipo existe
            // y todavía no se encuentra dado de baja.
            if (equipo && equipo.status !== "baja") {

                // Guardamos el estado anterior para poder recuperarlo
                // posteriormente si el equipo es reactivado.
                const estadoAnterior = equipo.status;
                equipo.estadoAntesDeBaja = estadoAnterior;

                // Creamos el historial si el equipo todavía no posee uno.
                equipo.historialEstados ??= [];

                // Registramos el evento antes de modificar el estado actual.
                equipo.historialEstados.push({
                    estadoAnterior,
                    estadoNuevo: "baja",
                    fecha: new Date().toISOString(),
                    origen: "detalle",
                });

                // Finalmente actualizamos el estado del equipo.
                equipo.status = "baja";
            }
        },

        // Permite reactivar un equipo que anteriormente fue dado de baja.
        reactivarEquipo: (state, action: PayloadAction<{ codigo: string }>) => {

            // Buscamos el equipo mediante su código único.
            const equipo = state.equipments.find(
                (equipo) => equipo.codigo === action.payload.codigo
            );

            if (equipo && equipo.status === "baja") {
                equipo.historialEstados ??= [];

                // Buscamos el último evento donde este equipo fue dado de baja.
                // Lo necesitamos para saber si la baja vino desde Mantenimiento o desde Detalle.
                const ultimaBaja = [...equipo.historialEstados]
                    .reverse()
                    .find((evento) => evento.estadoNuevo === "baja");

                // Si la baja ocurrió dentro de un mantenimiento ya finalizado,
                // al reactivarlo debe volver a Activo y no a Taller.
                const nuevoEstado =
                    ultimaBaja?.origen === "mantenimiento"
                        ? "activo"
                        : equipo.estadoAntesDeBaja ?? "activo";

                // Registramos la reactivación en el historial.
                equipo.historialEstados.push({
                    estadoAnterior: "baja",
                    estadoNuevo: nuevoEstado,
                    fecha: new Date().toISOString(),
                    origen: "detalle",
                    motivo:
                        ultimaBaja?.origen === "mantenimiento"
                            ? "Equipo reactivado después de una baja por mantenimiento"
                            : undefined,
                });

                // Aplicamos el nuevo estado.
                equipo.status = nuevoEstado;

                // Ya no necesitamos conservar el estado temporal anterior.
                delete equipo.estadoAntesDeBaja;
            }
        },

        // Permite editar únicamente los datos propios del equipo.
        // No modifica ubicación, responsable, estado ni código.
        actualizarDatosEquipo: (
            state,
            action: PayloadAction<{
                codigo: string;
                marca: string;
                modelo: string;
                serie: string;
                foto: ImageSourcePropType;
            }>
        ) => {

            // Buscamos el equipo utilizando su código único.
            const equipo = state.equipments.find(
                (equipo) => equipo.codigo === action.payload.codigo
            );

            // Si encontramos el equipo, actualizamos únicamente
            // la información permitida desde Editar equipo.
            if (equipo) {
                equipo.marca = action.payload.marca;
                equipo.modelo = action.payload.modelo;
                equipo.serie = action.payload.serie;
                equipo.foto = action.payload.foto;
            }
        },

    },
});

export const {
    agregarEquipo,
    cargarEquipos,
    cambiarUbicacionEquipo,
    enviarEquipoATallerPorMantenimiento,
    activarEquipoTrasMantenimiento,
    darDeBajaEquipoPorMantenimiento,
    darDeBajaEquipo,
    reactivarEquipo,
    actualizarDatosEquipo
} = equipmentSlice.actions;

export default equipmentSlice.reducer;