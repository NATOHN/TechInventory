// 1. Importamos únicamente el tipo ImageSourcePropType.
import type { ImageSourcePropType } from 'react-native';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';


// 2. Definimos los estados permitidos para un equipo.
export type EquipmentStatus = | 'activo' | 'taller' | 'baja';

// 12. Define cada movimiento de ubicación realizado sobre un equipo.
export type EquipmentLocationHistory = {
    sucursalAnterior: string;
    departamentoAnterior: string;
    sucursalNueva: string;
    departamentoNuevo: string;
    empleadoAnterior?: string;
    empleadoNuevo?: string;
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

        // Permite dar de baja un equipo sin eliminarlo del inventario.
        darDeBajaEquipo: (state, action: PayloadAction<{ codigo: string }>) => {
            // Buscamos el equipo utilizando su código único.
            const equipo = state.equipments.find(
                (equipo) => equipo.codigo === action.payload.codigo
            );
            // Si encontramos el equipo, cambiamos únicamente su estado.
            if (equipo && equipo.status !== "baja") {
                //Guardamos el estado actual para poder restaurarlo posteriormente.
                equipo.estadoAntesDeBaja = equipo.status;
                // Cambiamos el estado actual a baja.
                equipo.status = "baja";
            }
        },

        // Permite reactivar un equipo que anteriormente fue dado de baja.
        reactivarEquipo: (
            state,
            action: PayloadAction<{ codigo: string }>
        ) => {

            // Buscamos el equipo mediante su código único.
            const equipo = state.equipments.find(
                (equipo) => equipo.codigo === action.payload.codigo
            );

            if (equipo && equipo.status === "baja") {

                // Restauramos el estado que poseía antes de la baja.
                // Si es un registro antiguo sin estado previo, vuelve a activo.
                equipo.status = equipo.estadoAntesDeBaja ?? "activo";

                // Ya no necesitamos conservar temporalmente el estado anterior.
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
    darDeBajaEquipo, 
    reactivarEquipo,
    actualizarDatosEquipo 
} = equipmentSlice.actions;

export default equipmentSlice.reducer;